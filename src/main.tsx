import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App.tsx'
import InstallContext from './components/InstallContext.tsx'
import { startReminderScheduler } from './utils/reminderScheduler'
import useTodoStore from './stores/todoStore'

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
queueMicrotask(() => {
  void useTodoStore.getState().init();
});
