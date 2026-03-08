"use client";

import { AuthProvider } from "@/features/auth/AuthProvider";
import { CommerceProvider } from "@/features/commerce/CommerceProvider";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { PushNotificationManager } from "@/components/analytics/PushNotifications";
import { useAuth } from "@/features/auth/AuthProvider";

/**
 * Inner providers that need auth context (e.g. to pass userId to OneSignal)
 */
function InnerProviders({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <>
      <PushNotificationManager userId={user?.id} />
      {children}
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CommerceProvider>
        <AnalyticsProvider>
          <InnerProviders>{children}</InnerProviders>
        </AnalyticsProvider>
      </CommerceProvider>
    </AuthProvider>
  );
}

