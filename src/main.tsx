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

    // Helper: simple debounce
    function debounce<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
      let t: number | undefined;
      return (...args: T) => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => fn(...args), ms);
      };
    }

    // 1) Initial pull/push sequence
    const pullResult = await sync.pull().catch(() => 'not-found');
    if (pullResult === 'not-found') {
      await sync.push().catch(console.error);
    } else {
      await sync.push().catch(console.error);
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
      void sync.push().catch(console.error);
    }, 1200);

    useTodoStore.subscribe(() => {
      // Only push when tasks/workspaces actually changed
      const nextSig = signature();
      if (nextSig !== prevSig) {
        prevSig = nextSig;
        debouncedPush();
      }
    });
  } catch (e) {
    // Missing keys or network issues shouldn't block app start
    console.warn('[sync] initial sync skipped:', e);
  }
});
