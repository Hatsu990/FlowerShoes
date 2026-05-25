self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || "꽃신 알림";
  const options = {
    body: data.body || "새 알림이 도착했습니다.",
    icon: "/images/kkotsin/hongcheon-kkotsin-08.png",
    badge: "/images/kkotsin/hongcheon-kkotsin-08.png",
    tag: data.tag || "kkotsin-notification",
    data: {
      url: data.url || "/admin/reservations",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || "/admin/reservations", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    }),
  );
});
