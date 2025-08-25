// Lightweight notification helpers that prefer using the Service Worker registration
export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch {
    return Notification.permission;
  }
}

export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    // Prefer SW to ensure notifications display even when the tab is backgrounded.
    // Avoid awaiting navigator.serviceWorker.ready in dev (may never resolve if SW isn't enabled),
    // instead try to get an existing registration and fall back immediately if none.
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, options);
        return;
      }
    }
  } catch {
    // fall back to page-level notification
  }

  try {
    new Notification(title, options);
  } catch {
    // noop
  }
}
