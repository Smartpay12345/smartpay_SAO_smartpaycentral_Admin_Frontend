"use client";

import { ReactNode, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "@/components/modals/PasswordField";
import { PasswordRulesChecklist } from "./password-rules-checklist";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { toFormError } from "@/lib/auth/api";
import { resetPassword } from "@/lib/auth/actions";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth";

// TODO: replace with the real codes from the sao-admin-reset-password note
const TOKEN_ERROR_CODES = new Set(["invalid_token", "token_expired", "invalid_or_expired_token"]);

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
  onTokenInvalid: () => void;
}

export function ResetPasswordForm({ token, onSuccess, onTokenInvalid, children }: ResetPasswordFormProps & { children?: ReactNode }) {
  const [formError, setFormError] = useState<string | null>(null);
  const cooldown = useCountdown();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const newPassword = useWatch({ control, name: "new_password" });

  async function onSubmit(values: ResetPasswordValues) {
    setFormError(null);
    try {
      await resetPassword({ token, ...values });
      onSuccess();
    } catch (err) {
      const e = toFormError(err);

      if (TOKEN_ERROR_CODES.has(e.code) || (e.code === "validation_error" && e.fields.token)) {
        onTokenInvalid();
        return;
      }
      if (e.code === "validation_error") {
        let mapped = false;
        for (const [field, message] of Object.entries(e.fields)) {
          if (field === "new_password" || field === "confirm_password") {
            setError(field, { message });
            mapped = true;
          }
        }
        if (!mapped) setFormError(e.message);
        return;
      }
      if (e.code === "rate_limited" && e.retryAfter) cooldown.start(e.retryAfter);
      setFormError(e.message);
    }
  }

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <fieldset disabled={isSubmitting} className="m-0 min-w-0 space-y-4 border-0 p-0">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {formError}
        </p>
      )}

      <div className="space-y-2">
        <PasswordField
          label="New Password"
          registration={register("new_password")}
          error={errors.new_password?.message}
          autoComplete="new-password"
        />
        <PasswordRulesChecklist value={newPassword} />
      </div>
      <PasswordField
        label="Confirm Password"
        registration={register("confirm_password")}
        error={errors.confirm_password?.message}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={isSubmitting || cooldown.active}
        className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cooldown.active
          ? `Try again in ${formatCountdown(cooldown.remaining)}`
          : isSubmitting
            ? "Updating..."
            : "Reset Password"}
      </button>
    {children}
    </fieldset>
  </form>
);
}