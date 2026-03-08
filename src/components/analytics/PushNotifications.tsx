"use client";

/**
 * ============================================================
 * ONESIGNAL PUSH NOTIFICATION COMPONENT
 * ============================================================
 * Integrates OneSignal web push notifications.
 *
 * SETUP STEPS:
 * 1. Create a free account at https://onesignal.com
 * 2. Create a Web App and get your App ID
 * 3. Add to .env.local:
 *    NEXT_PUBLIC_ONESIGNAL_APP_ID=your-app-id-here
 * 4. Download OneSignal service worker files:
 *    - OneSignalSDKWorker.js  → put in /public/
 *    (Download from your OneSignal app settings)
 * ============================================================
 */

import { useEffect, useState } from "react";
import Script from "next/script";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

/**
 * Access the OneSignal SDK safely, bypassing TypeScript's
 * conflict with Next.js's existing `unknown[]` Window type.
 */
function getOneSignal() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (typeof window !== "undefined" ? (window as any).OneSignal : null) as {
        init: (config: Record<string, unknown>) => void;
        isPushNotificationsEnabled: () => Promise<boolean>;
        showSlidedownPrompt: () => void;
        sendTag: (key: string, value: string) => void;
        setExternalUserId: (id: string) => void;
        push: (fn: () => void) => void;
    } | null;
}

interface PushNotificationManagerProps {
    userId?: string; // Pass logged-in user's ID to link to OneSignal profile
}

export function PushNotificationManager({ userId }: PushNotificationManagerProps) {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (!ONESIGNAL_APP_ID || typeof window === "undefined") return;

        // Show custom permission banner after 10 seconds on site
        const timer = setTimeout(() => {
            if ("Notification" in window && Notification.permission === "default") {
                setShowBanner(true);
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const initOneSignal = () => {
        if (!ONESIGNAL_APP_ID || typeof window === "undefined") return;

        const os = getOneSignal();
        if (!os) return;

        os.push(() => {
            os.init({
                appId: ONESIGNAL_APP_ID,
                safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
                notifyButton: { enable: false },
                allowLocalhostAsSecureOrigin: true,
                welcomeNotification: {
                    title: "Uphaar & Kyddoz 🎁",
                    message:
                        "Thanks for subscribing! You'll be the first to know about new collections and sales.",
                },
            });

            // Link to user account if logged in
            if (userId) {
                os.setExternalUserId(userId);
                os.sendTag("user_id", userId);
            }
        });
    };

    const handleEnableNotifications = () => {
        setShowBanner(false);
        const os = getOneSignal();
        if (os?.showSlidedownPrompt) {
            os.showSlidedownPrompt();
            setPermissionGranted(true);
        }
    };

    if (!ONESIGNAL_APP_ID) return null; // No config = no component

    return (
        <>
            {/* OneSignal SDK Script */}
            <Script
                id="onesignal-sdk"
                src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
                strategy="lazyOnload"
                onLoad={initOneSignal}
            />

            {/* Custom Permission Banner */}
            {showBanner && !permissionGranted && (
                <div
                    className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 w-[340px] max-w-[calc(100vw-32px)]"
                    style={{
                        background: "#fff",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(103,14,16,0.18)",
                        border: "2px solid #670E10",
                        padding: "20px 20px 16px",
                        animation: "slideUp 0.4s cubic-bezier(.22,.68,0,1.2)",
                    }}
                >
                    <style>{`
            @keyframes slideUp {
              from { transform: translateX(-50%) translateY(120%); opacity: 0; }
              to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
          `}</style>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                background: "#f3cfc6",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                fontSize: "20px",
                            }}
                        >
                            🔔
                        </div>

                        <div style={{ flex: 1 }}>
                            <p
                                style={{
                                    margin: "0 0 4px",
                                    fontWeight: 700,
                                    color: "#670E10",
                                    fontSize: "14px",
                                }}
                            >
                                Stay in the loop!
                            </p>
                            <p
                                style={{
                                    margin: "0 0 14px",
                                    color: "#666",
                                    fontSize: "12px",
                                    lineHeight: 1.5,
                                }}
                            >
                                Get notified about new collections, flash sales &amp; exclusive discounts.
                            </p>

                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    onClick={handleEnableNotifications}
                                    style={{
                                        flex: 1,
                                        background: "#670E10",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "9px 0",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    ✓ Enable
                                </button>
                                <button
                                    onClick={() => setShowBanner(false)}
                                    style={{
                                        background: "transparent",
                                        color: "#999",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "9px 14px",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/**
 * ─── ADMIN: Send Push Notifications ──────────────────────────
 *
 * Example function to call from your server/admin panel:
 *
 * export async function sendPushNotification(message: string, title: string) {
 *   await fetch("https://onesignal.com/api/v1/notifications", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
 *     },
 *     body: JSON.stringify({
 *       app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
 *       included_segments: ["All"],
 *       headings: { en: title },
 *       contents: { en: message },
 *       url: "https://uphaarandkyddoz.com",
 *       chrome_web_icon: "https://uphaarandkyddoz.com/logos/uphaar.png",
 *     }),
 *   });
 * }
 *
 * Example calls:
 * sendPushNotification("New collection just dropped! 🛍️", "New Arrivals");
 * sendPushNotification("⚡ Flash Sale! 30% off for 2 hours!", "Flash Sale");
 * sendPushNotification("Your favourite item is back in stock! 🎁", "Back in Stock");
 */
