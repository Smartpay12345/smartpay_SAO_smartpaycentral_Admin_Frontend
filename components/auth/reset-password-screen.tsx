"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { setNotice } from "@/lib/auth/store";
import Image from "next/image";

const PRIMARY_BUTTON =
  "w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99]";

export function ResetPasswordScreen({ token }: { token: string | null }) {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [tokenRejected, setTokenRejected] = useState(false);
  const LOGO_SRC = "/logo.svg";

  // the doc requires the token to leave the address bar. The prop keeps it for the form.
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // derived, not stored
  const view = done ? "done" : !token || tokenRejected ? "invalid" : "form";

  function goToSignIn(passwordUpdated: boolean) {
    if (passwordUpdated) setNotice("password_updated"); // "/" opens the login modal with the green banner
    router.replace("/");
  }

  return (
   <main className="relative isolate flex h-dvh flex-col overflow-hidden bg-neutral-950 text-white">
    {/* background: pure CSS, no images */}
 <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]"
    />
    <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-red-600/25 blur-3xl" />
    <div aria-hidden className="pointer-events-none absolute -bottom-48 -right-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-red-900/30 blur-3xl" />


       <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-4 xl:grid xl:grid-cols-2 xl:gap-16 xl:px-6">
      {/* brand text: large screens only */}
      <header className="hidden xl:block">
        <h1 className="text-5xl font-extrabold tracking-tight">Sao Fuel Pay</h1>
        <p className="mt-3 text-base font-medium">Your Smarter Management, Finance, Monitoring System.</p>
        <p className="mt-2 text-base font-bold text-red-600">Built For SAO Filling Station</p>
        <div className="mt-4 h-[2px] w-12 bg-white/60" />
      </header>


        {/* card */}
         <div className="flex max-h-full min-h-0 w-full max-w-md flex-col items-center gap-5 xl:justify-self-end">
         <Image src={LOGO_SRC} alt="SAO" width={64} height={64} priority className="h-14 w-auto shrink-0 xl:hidden" />
       <section className="relative flex min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl">
         <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-100/60" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-red-100/60" />

          <div className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8">
    

            {view === "form" && token && (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold">Reset password</h2>
                    <p className="mt-1 text-xs text-gray-500">Choose a new password for your admin account.</p>
                  </div>
                </div>

              <ResetPasswordForm
  token={token}
  onSuccess={() => setDone(true)}
  onTokenInvalid={() => setTokenRejected(true)}
>
  <button
    type="button"
    onClick={() => goToSignIn(false)}
    className="w-full text-center text-xs font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"
  >
    Back to sign in
  </button>
</ResetPasswordForm>
              </div>
            )}

            {view === "invalid" && (
              <div className="space-y-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold">Link expired</h2>
                  <p className="mt-2 text-xs text-gray-500">
                    This reset link is invalid or has already been used. Links work once and expire after 15 minutes.
                    Use &ldquo;Forgot password&rdquo; on the sign-in screen to get a new one.
                  </p>
                </div>
                <button type="button" onClick={() => goToSignIn(false)} className={PRIMARY_BUTTON}>
                  Back to sign in
                </button>
              </div>
            )}

            {view === "done" && (
              <div className="space-y-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold">Password updated</h2>
                  <p className="mt-2 text-xs text-gray-500">You can now sign in with your new password.</p>
                </div>
                <button type="button" onClick={() => goToSignIn(true)} className={PRIMARY_BUTTON}>
                  Continue to sign in
                </button>
              </div>
            )}
          </div>
        </section>
        </div>
      </div>

    <footer className="hidden pb-4 text-center text-[11px] font-medium text-white/60 xl:block">
  Powered by Smartpay studio
</footer>
    </main>
  );
}