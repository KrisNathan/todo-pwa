/*
  This file is referenced by VitePWA as part of the generated service worker.
  We add click handling to bring the app into focus when the user taps a reminder.
*/
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = '/';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    let client = allClients.find(c => 'focus' in c);
    if (client) {
      await client.focus();
      return;
    }
    await self.clients.openWindow(url);
  })());
});
