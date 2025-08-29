import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App.tsx'
import InstallContext from './components/InstallContext.tsx'
import ReminderSchedulerInitTask from './init_task/reminder_scheduler.tsx'
import SyncSchedulerInitTask from './init_task/sync_scheduler.ts'
import useCodeStore from './stores/codeStore.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InstallContext>
      <App />
    </InstallContext>
  </StrictMode>,
)

// Start local reminder scheduler after initial render tick
queueMicrotask(() => ReminderSchedulerInitTask.start());
// Hydrate store from IndexedDB
queueMicrotask(async () => {
  // Wait until useCodeStore (zustand/persist) finishes hydration
  const waitForCodeStoreHydration = () => new Promise<void>((resolve) => {
    const storeAny = useCodeStore as unknown as {
      persist?: {
        hasHydrated?: () => boolean;
        onFinishHydration?: (cb: () => void) => () => void;
      }
    };

    const hasHydrated = storeAny.persist?.hasHydrated?.();
    if (hasHydrated) {
      resolve();
      return;
    }

    const unsubRef = { fn: undefined as undefined | (() => void) };
    unsubRef.fn = storeAny.persist?.onFinishHydration?.(() => {
      if (unsubRef.fn) unsubRef.fn();
      resolve();
    });

    // If persist API is missing for any reason, proceed immediately
    if (!storeAny.persist) resolve();
  });

  await waitForCodeStoreHydration();

  const codeStore = useCodeStore.getState();

  // Sync is disabled
  if (!codeStore.syncCode) {
    return;
  }

  SyncSchedulerInitTask.start();
});
