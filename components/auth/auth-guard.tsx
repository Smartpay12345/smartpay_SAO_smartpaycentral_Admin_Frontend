// components/auth/auth-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status, admin } = useAuth();
  const mustChangePassword = admin?.must_change_password === true;

  // signed out, or password not changed yet: send them to "/" where AuthFlowModal takes over
  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && mustChangePassword)) {
      router.replace("/");
    }
  }, [status, mustChangePassword, router]);

  if (status !== "authenticated" || mustChangePassword) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}