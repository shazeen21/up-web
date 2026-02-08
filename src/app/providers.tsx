"use client";

import { AuthProvider } from "@/features/auth/AuthProvider";
import { CommerceProvider } from "@/features/commerce/CommerceProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CommerceProvider>{children}</CommerceProvider>
    </AuthProvider>
  );
}

