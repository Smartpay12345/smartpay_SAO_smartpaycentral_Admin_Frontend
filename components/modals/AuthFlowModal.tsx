// components/modals/AuthFlowModal.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthModal } from "./AuthModal";
import { BackButton } from "./BackButton";
import { FormField } from "./FormField";
import {
  getStartedSchema,
  GetStartedValues,
  loginSchema,
  LoginValues,
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/lib/validations/auth";

type AuthStep = "get-started" | "login" | "forgot-password" | "success";

const previousStep: Partial<Record<AuthStep, AuthStep>> = {
  login: "get-started",
  "forgot-password": "login",
};

interface AuthFlowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: AuthStep;
}

export function AuthFlowModal({ open, onOpenChange, initialStep = "get-started" }: AuthFlowModalProps) {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [wasOpen, setWasOpen] = useState(open);

  const getStartedForm = useForm<GetStartedValues>({
    resolver: zodResolver(getStartedSchema),
    defaultValues: { email: "" },
  });

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Sync step + reset every form whenever the modal transitions to open.
  // Each form resets independently so nothing carries over between steps.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(initialStep);
      getStartedForm.reset();
      loginForm.reset();
      forgotPasswordForm.reset();
    }
  }

  const onGetStartedSubmit = (values: GetStartedValues) => {
    console.log(values);
    setStep("success");
  };

  const onLoginSubmit = (values: LoginValues) => {
    console.log(values);
    setStep("success");
  };

  const onForgotPasswordSubmit = (values: ForgotPasswordValues) => {
    console.log(values);
    setStep("success");
  };

  return (
    <AuthModal open={open} onOpenChange={onOpenChange}>
      {previousStep[step] && <BackButton onClick={() => setStep(previousStep[step]!)} />}

      {step === "get-started" && (
        <form onSubmit={getStartedForm.handleSubmit(onGetStartedSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
            <p className="mt-1 text-xs text-gray-400">
              To get started, we need to know a bit more about your business.
            </p>
          </div>
          <FormField
            label="Email"
            placeholder="Enter your email"
            registration={getStartedForm.register("email")}
            error={getStartedForm.formState.errors.email?.message}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99]"
          >
            Get started
          </button>
          <button
            type="button"
            onClick={() => setStep("login")}
            className="w-full text-center text-xs font-medium text-gray-500 hover:text-red-600"
          >
            Already have an account? Sign in
          </button>
        </form>
      )}

      {step === "login" && (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
            <h3 className="mt-4 text-xl font-bold text-gray-900">Login</h3>
          </div>
          <div className="space-y-4">
            <FormField
              label="Email"
              placeholder="Enter your username or email"
              registration={loginForm.register("email")}
              error={loginForm.formState.errors.email?.message}
            />
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••••••"
              registration={loginForm.register("password")}
              error={loginForm.formState.errors.password?.message}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep("forgot-password")}
                className="text-xs font-medium text-gray-700 hover:text-red-600"
              >
                Forgot password
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99]"
          >
            Sign in
          </button>
        </form>
      )}

      {step === "forgot-password" && (
        <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-1 text-xs text-gray-500">
              Enter your account email and we will send a password reset link.
            </p>
          </div>
          <FormField
            label="Email"
            placeholder="Enter your email"
            registration={forgotPasswordForm.register("email")}
            error={forgotPasswordForm.formState.errors.email?.message}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 active:scale-[0.99]"
          >
            Continue
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Success</h2>
          <p className="text-xs text-gray-500">
            Thank you for your interest, we will be in contact and verified within 24 hours.
          </p>
        </div>
      )}
    </AuthModal>
  );
}