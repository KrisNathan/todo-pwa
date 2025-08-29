import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App.tsx'
import InstallContext from './components/InstallContext.tsx'
import { startReminderScheduler } from './utils/reminderScheduler'
import useTodoStore from './stores/todoStore'
import SyncUtils from './utils/sync'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InstallContext>
      <App />
    </InstallContext>
  </StrictMode>,
)

// Start local reminder scheduler after initial render tick
queueMicrotask(() => startReminderScheduler());
// Hydrate store from IndexedDB
queueMicrotask(async () => {
  await useTodoStore.getState().init();
  // initial sync after store is ready here
  try {
    const sync = new SyncUtils();

    // Ensure sync operations don't overlap: serialize push/pull via a simple promise chain
    let syncChain: Promise<void> = Promise.resolve();
    function queueSync<T>(op: () => Promise<T>): Promise<T> {
      const run = () => op();
      const p = syncChain.then(run);
      // Keep the chain as Promise<void> regardless of op result and swallow errors to not block the chain
      syncChain = p.then(
        () => undefined,
        () => undefined,
      );
      return p;
    }

    // Helper: simple debounce
    function debounce<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
      let t: number | undefined;
      return (...args: T) => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => fn(...args), ms);
      };
    }

    // 1) Initial pull/push sequence
    const pullResult = await queueSync(() => sync.pull()).catch(() => 'not-found');
    if (pullResult === 'not-found') {
      await queueSync(() => sync.push()).catch(console.error);
    } else {
      await queueSync(() => sync.push()).catch(console.error);
    }

    // 2) Subscribe to store updates and push on changes (debounced)
    const signature = () => {
      const s = useTodoStore.getState();
      // Keep only relevant fields for sync
      const t = s.tasks.map((x) => [
        x.id,
        x.title,
        x.completed,
        x.isImportant,
        x.listId,
        x.dueDate ? new Date(x.dueDate).getTime() : null,
      ]);
      const w = s.workspaces.map((x) => [x.id, x.name]);
      return JSON.stringify({ t, w });
    };

    let prevSig = signature();
    const debouncedPush = debounce<void[]>(() => {
      // Skip if store not hydrated for any reason
      if (!useTodoStore.getState().hydrated) return;
      void queueSync(() => sync.push()).catch(console.error);
    }, 1200);

    useTodoStore.subscribe(() => {
      // Only push when tasks/workspaces actually changed
      const nextSig = signature();
      if (nextSig !== prevSig) {
        prevSig = nextSig;
        debouncedPush();
      }
    });

    // 3) Periodic pull to fetch remote updates (serialized with other sync ops)
    const PULL_INTERVAL_MS = Number(import.meta.env.VITE_SYNC_PULL_INTERVAL_MS ?? 2 * 60 * 1000); // 2 minutes
    const pullTimer = window.setInterval(() => {
      // Only attempt when app is hydrated and online
      if (!useTodoStore.getState().hydrated) return;
      if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) return;
      void queueSync(() => sync.pull()).catch(() => { });
    }, PULL_INTERVAL_MS);

    // Clean up timer if the page is being closed/refreshed
    window.addEventListener('beforeunload', () => {
      window.clearInterval(pullTimer);
    });
  } catch (e) {
    // Missing keys or network issues shouldn't block app start
    console.warn('[sync] initial sync skipped:', e);
  }
});
