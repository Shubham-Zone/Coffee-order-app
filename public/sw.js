self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    return caches.delete(cache);
                })
            );
        })
    );
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
