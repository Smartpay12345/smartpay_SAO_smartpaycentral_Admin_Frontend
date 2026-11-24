// components/modals/AuthFlowModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthModal } from "./AuthModal";
import { BackButton } from "./BackButton";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { OtpInput } from "./OtpInput";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { toFormError } from "@/lib/auth/api";
import { forgotPassword, login, resendMfa, verifyMfa,} from "@/lib/auth/actions";
import { authStore, setMfa, useAuth, logout, type AuthNotice, clearNotice, } from "@/lib/auth/store";
import { AUTH_NOTICE_TEXT } from "@/lib/auth/notices";
import {
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  type ForgotPasswordValues,
  type LoginValues,
} from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export type AuthStep = "login" | "otp" | "forgot-password" | "forgot-sent" | "change-password";

const previousStep: Partial<Record<AuthStep, AuthStep>> = {
  otp: "login",
  "forgot-password": "login",
};

const PRIMARY_BUTTON =
  "w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

const secondsUntil = (timestampMs: number) => Math.max(0, Math.ceil((timestampMs - Date.now()) / 1000));

interface AuthFlowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: AuthStep;
  notice?: AuthNotice | null;
  selectedRole?: string;
}

export function AuthFlowModal({ open, onOpenChange, initialStep = "login", selectedRole,  notice: noticeProp = null }: AuthFlowModalProps) {
  const { status, admin, notice: storeNotice } = useAuth();
  const forced = status === "authenticated" && admin?.must_change_password === true;
  const [busy, setBusy] = useState(false);

  const effectiveOpen = open || forced || storeNotice !== null;
  const effectiveStep: AuthStep = forced ? "change-password" : storeNotice ? "login" : initialStep;

  const [session, setSession] = useState(0);
  const [wasOpen, setWasOpen] = useState(effectiveOpen);
  if (effectiveOpen !== wasOpen) {
    setWasOpen(effectiveOpen);
    if (effectiveOpen) setSession((s) => s + 1);
  }

  function handleOpenChange(next: boolean) {
    if (!next && (forced || busy)) return; // can't close while a request runs, or before the password is changed
    if (!next) clearNotice();
    onOpenChange(next);
  }

  return (
    <AuthModal open={effectiveOpen} onOpenChange={handleOpenChange}>
      <AuthFlowContent
        key={session}
        initialStep={effectiveStep}
        notice={noticeProp ?? storeNotice}
        onBusyChange={setBusy}
        selectedRole={selectedRole}
      />
    </AuthModal>
  );
}

function AuthFlowContent({ initialStep, notice,  onBusyChange, selectedRole}: { initialStep: AuthStep; selectedRole?: string; notice: AuthNotice | null; onBusyChange: (busy: boolean)=> void; }) {
  const router = useRouter();
  const { mfa, admin } = useAuth();
  const [step, setStep] = useState<AuthStep>(initialStep);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const view: AuthStep = step === "change-password" && !admin ? "login" : step;

  // live here (not inside a step) so a lockout started on one step still shows on another
  const lockout = useCountdown();
  const verifyCooldown = useCountdown();
  const resendCooldown = useCountdown();
  const forgotCooldown = useCountdown();


  
  // an unfinished OTP attempt must not linger in memory once the modal is gone
  useEffect(() => () => setMfa(null), []);


  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const busy =
  loginForm.formState.isSubmitting ||
  forgotPasswordForm.formState.isSubmitting ||
  verifying ||
  resending ||
  redirecting;

useEffect(() => {
  onBusyChange(busy);
}, [busy, onBusyChange]);

// if this content unmounts, the modal must not stay locked
useEffect(() => () => onBusyChange(false), [onBusyChange]);

  function enterOtpStep() {
    const current = authStore.getSnapshot().mfa;
    if (current) resendCooldown.start(secondsUntil(current.resendAvailableAt));
    setCode("");
    setOtpError(null);
    setOtpNotice(null);
    setStep("otp");
  }

  // "go back to Login": drop the attempt, keep the email, clear the password
  function backToLogin(message: string, retryAfter?: number) {
    setMfa(null);
    setCode("");
    loginForm.reset({ email: loginForm.getValues("email"), password: "" });
    setLoginError(message);
    if (retryAfter) lockout.start(retryAfter);
    setStep("login");
  }

  function goBack() {
    if (step === "otp") {
      setMfa(null);
      setCode("");
      setOtpError(null);
    }
    const prev = previousStep[step];
    if (prev) setStep(prev);
  }

  async function onLoginSubmit(values: LoginValues) {
    setLoginError(null);
    try {
      const result = await login(values.email, values.password);

      if (result.mfaRequired) {
        enterOtpStep();
        return;
      }
      if (result.admin.must_change_password) {
  setStep("change-password");
  return;
}
      setRedirecting(true);
      router.replace("/dashboard");
    } catch (err) {
      const e = toFormError(err);

      if (e.code === "validation_error") {
        let mapped = false;
        for (const [field, message] of Object.entries(e.fields)) {
          if (field === "email" || field === "password") {
            loginForm.setError(field, { message });
            mapped = true;
          }
        }
        if (!mapped) setLoginError(e.message);
        return;
      }

      if ((e.code === "account_locked" || e.code === "rate_limited") && e.retryAfter) {
        lockout.start(e.retryAfter);
      }
      // invalid_credentials, account_disabled, mfa_delivery_failed, network_error...
      setLoginError(e.message);
    }
  }

  async function onForgotSubmit(values: ForgotPasswordValues) {
    setForgotError(null);
    try {
      await forgotPassword(values.email);
      forgotCooldown.start(5); // a few seconds of cool-down, as the backend suggests
      setStep("forgot-sent"); // always on a 200: the response is identical whether or not the account exists
    } catch (err) {
      const e = toFormError(err);
      if (e.code === "validation_error" && e.fields.email) {
        forgotPasswordForm.setError("email", { message: e.fields.email });
      } else {
        setForgotError(e.message);
      }
    }
  }

  async function onVerify() {
    const parsed = otpSchema.safeParse({ code });
    if (!parsed.success) {
      setOtpError(parsed.error.issues[0].message);
      return;
    }

    setVerifying(true);
    setOtpError(null);
    setOtpNotice(null);

    try {
  const verified = await verifyMfa(parsed.data.code);
  if (verified.must_change_password) {
    // first login: same modal, next step
    setVerifying(false);
    setStep("change-password");
    return;
  }
  // stay "verifying" while navigating so the code can't be submitted twice
  router.replace("/dashboard");
  return;
} catch (err) {
      setVerifying(false);
      const e = toFormError(err);
      setCode("");

      if (e.code === "invalid_code") {
        const left = e.attemptsLeft;
        setOtpError(left !== undefined ? `${e.message} ${left} ${left === 1 ? "try" : "tries"} left.` : e.message);
        return;
      }
      if (e.code === "mfa_attempts_exceeded" || e.code === "mfa_session_expired") {
        backToLogin(e.message);
        return;
      }
      if (e.code === "account_locked") {
        backToLogin(e.message, e.retryAfter);
        return;
      }
      if (e.code === "account_disabled") { backToLogin(e.message); return; }
      
      if (e.code === "rate_limited" && e.retryAfter) verifyCooldown.start(e.retryAfter);
      setOtpError(e.message);
      
    }
  }

  async function onResend() {
    setResending(true);
    setOtpError(null);
    setOtpNotice(null);

    try {
      await resendMfa();
      setCode("");
      setOtpNotice("Code sent");
      const current = authStore.getSnapshot().mfa;
      if (current) resendCooldown.start(secondsUntil(current.resendAvailableAt));
    } catch (err) {
      const e = toFormError(err);
      if (e.code === "mfa_session_expired" || e.code === "resend_limit_reached" || e.code === "mfa_delivery_failed") {
        backToLogin(e.message);
        return;
      }
      if ((e.code === "resend_too_soon" || e.code === "rate_limited") && e.retryAfter) {
        resendCooldown.start(e.retryAfter);
      }
      if (e.code === "account_disabled") { backToLogin(e.message); return; }
      setOtpError(e.message);
    } finally {
      setResending(false);
    }
  }

  async function signOutInstead() {
  await logout();
  setStep("login");
}

  const codeComplete = /^\d{6}$/.test(code);

  return (
    <>
      {previousStep[view] && !busy && <BackButton onClick={goBack} />}

      {view === "login" && (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Login</h3>
            {selectedRole && <p className="mt-1 text-xs text-gray-500">Signing in as {selectedRole}</p>}
          </div>

          {notice && !loginError && (
            <p
              className={cn(
                "rounded-lg px-3 py-2 text-xs",
                notice === "password_updated" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              )}
            >
              {AUTH_NOTICE_TEXT[notice]}
            </p>
          )}
          {loginError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {loginError}
            </p>
          )}

          <div className="space-y-4">
            <FormField
              label="Email"
              placeholder="Enter your email"
              registration={loginForm.register("email")}
              disabled={loginForm.formState.isSubmitting || redirecting}
              error={loginForm.formState.errors.email?.message}
            />
            <PasswordField
              label="Password"
              disabled={loginForm.formState.isSubmitting || redirecting}
              placeholder="••••••••••••"
              registration={loginForm.register("password")}
              error={loginForm.formState.errors.password?.message}
            />
            <div className="flex justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={() => setStep("forgot-password")}
                className="text-xs font-medium text-gray-700 hover:text-red-600"
              >
                Forgot password
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginForm.formState.isSubmitting || redirecting || lockout.active}
            className={PRIMARY_BUTTON}
          >
            {lockout.active
              ? `Try again in ${formatCountdown(lockout.remaining)}`
              : loginForm.formState.isSubmitting || redirecting
                ? "Signing in..."
                : "Sign in"}
          </button>
        </form>
      )}

      {view === "otp" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onVerify();
          }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enter verification code</h2>
            <p className="mt-1 text-xs text-gray-500">
              We sent a 6-digit code to {mfa?.emailHint ?? "your email"}.
            </p>
          </div>

          <div className="space-y-2">
            <OtpInput
              value={code}
              onChange={(v) => {
                setCode(v);
                setOtpError(null);
              }}
              disabled={verifying}
              hasError={Boolean(otpError)}
            />
            {otpError && (
              <p role="alert" className="text-center text-xs text-red-600">
                {otpError}
              </p>
            )}
            {otpNotice && !otpError && <p className="text-center text-xs text-green-600">{otpNotice}</p>}
          </div>

          <button type="submit" disabled={verifying || !codeComplete || verifyCooldown.active} className={PRIMARY_BUTTON}>
            {verifyCooldown.active
              ? `Try again in ${formatCountdown(verifyCooldown.remaining)}`
              : verifying
                ? "Verifying..."
                : "Verify"}
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={resendCooldown.active || resending || verifying}
            className="w-full text-center text-xs font-medium text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-500"
          >
            {resendCooldown.active
              ? `Resend code in ${formatCountdown(resendCooldown.remaining)}`
              : resending
                ? "Sending..."
                : "Resend code"}
          </button>
        </form>
      )}

      {view === "forgot-password" && (
        <form onSubmit={forgotPasswordForm.handleSubmit(onForgotSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-1 text-xs text-gray-500">
              Enter your account email and we will send a password reset link.
            </p>
          </div>

          {forgotError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {forgotError}
            </p>
          )}

          <FormField
            label="Email"
            placeholder="Enter your email"
            registration={forgotPasswordForm.register("email")}
            error={forgotPasswordForm.formState.errors.email?.message}
            disabled={forgotPasswordForm.formState.isSubmitting || redirecting}
          />
          <button
            type="submit"
            disabled={forgotPasswordForm.formState.isSubmitting || forgotCooldown.active}
            className={PRIMARY_BUTTON}
          >
            {forgotPasswordForm.formState.isSubmitting
              ? "Sending..."
              : forgotCooldown.active
                ? `Wait ${forgotCooldown.remaining}s`
                : "Continue"}
          </button>
        </form>
      )}

      {view === "forgot-sent" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-xs text-gray-500">
              If an account exists for that email, we&apos;ve sent a password reset link. Please check your
              inbox. The link works once and expires in 15 minutes.
            </p>
          </div>
          <button type="button" onClick={() => setStep("login")} className={PRIMARY_BUTTON}>
            Continue
          </button>
        </div>
      )}

      {view === "change-password" && admin && (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Set a new password</h2>
      <p className="mt-1 text-xs text-gray-500">
        You&apos;re signed in with a temporary password. Choose a new one to continue.
      </p>
    </div>
    <ChangePasswordForm email={admin.email} onSuccess={() => router.replace("/dashboard")} />
    <button
      type="button"
      onClick={signOutInstead}
      className="w-full text-center text-xs font-medium text-gray-500 hover:text-red-600"
    >
      Sign out instead
    </button>
  </div>
)}
    </>
  );
}