self.addEventListener('install', (event) => {
    console.log("installing sw");
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
    console.log("activate sw");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    console.log("fetching sw");
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("push", (event) => {
    console.log("Pushing....");
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
