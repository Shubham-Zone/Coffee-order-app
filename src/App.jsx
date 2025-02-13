import React, { useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

function App() {
    useEffect(async () => {
        if ("serviceWorker" in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();

            const oldSw = registrations.find((registration) =>
                registration.active?.scriptURL.includes('/login/sw.js'),
            );

            if (oldSw) {
                oldSw.unregister();
            }

            navigator.serviceWorker.register('/sw.js');

            // navigator.serviceWorker.register("/sw.js", { scope: "/" })
            //     .then((registration) => {
            //         console.log("Service Worker registered with scope:", registration.scope);
            //     })
            //     .catch((error) => console.error("Service Worker registration failed:", error));
        }
    }, []);

    const subscribeToNotifications = async () => {
        console.log("Subscribe button clicked");

        try {
            // ✅ Request permission only when user clicks the button
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Notifications permission denied. Please enable notifications in your browser settings."
                });
                return;
            }

            console.log("Registering service worker...");
            const registration = await navigator.serviceWorker.ready;

            console.log("Subscribing to push notifications...");
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BJqfij3FNYMvfxe-rKen3r2fd7Jmlq9QXQmpCOoOzMIdPlb3JK1zrRA7Z7fLFFDXSDUp01NoceY8-YKX2DGiaj0"
            });

            console.log("Subscription details:", subscription);

            await axios.post(`${import.meta.env.VITE_BASE_URL}/subscribe`, subscription);

            Swal.fire({
                title: "Good job!",
                text: "Subscribed for notifications!",
                icon: "success"
            });

        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: e.response?.data?.msg || 'Something went wrong',
            });
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#f8f3e7",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{
                color: "#6f4e37",
                fontSize: "2.5rem",
                textAlign: "center",
                marginBottom: "20px"
            }}>
                ☕ Coffee Order App
            </h1>
            <button
                onClick={subscribeToNotifications}
                style={{
                    padding: "12px 24px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#6f4e37",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    transition: "background-color 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#8B5A2B"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#6f4e37"}
            >
                🔔 Subscribe for Coffee Notifications
            </button>
        </div>

    );
}

export default App;
