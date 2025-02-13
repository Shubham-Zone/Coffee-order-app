self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installed');
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated');
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
});

self.addEventListener("push", (event) => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        actions: data.actions
    });
});

self.addEventListener("notificationclick", (event) => {
    const action = event.action;
    event.notification.close();

    if (action === "coffee" || action === "tea") {
        fetch(`${import.meta.env.VITE_BASE_URL}/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: "User1", choice: action })
        }).then(() => {
            clients.openWindow("/");
        });
    }
});
