// components/auth/change-password-form.tsx
"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PasswordField } from "@/components/modals/PasswordField";
import { PasswordRulesChecklist } from "./password-rules-checklist";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { toFormError } from "@/lib/auth/api";
import { changePassword } from "@/lib/auth/actions";
import { buildChangePasswordSchema, type ChangePasswordValues } from "@/lib/validations/auth";

interface ChangePasswordFormProps {
  email: string;
  onSuccess?: () => void;
}

export function ChangePasswordForm({ email, onSuccess }: ChangePasswordFormProps) {
  const schema = useMemo(() => buildChangePasswordSchema(email), [email]);
  const [formError, setFormError] = useState<string | null>(null);
  const cooldown = useCountdown();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const newPassword = useWatch({ control, name: "new_password" });

  async function onSubmit(values: ChangePasswordValues) {
    setFormError(null);
    try {
      await changePassword(values);
      toast.success("Password updated");
      onSuccess?.();
    } catch (err) {
      const e = toFormError(err);

      if (e.code === "validation_error") {
        let mapped = false;
        for (const [field, message] of Object.entries(e.fields)) {
          if (field === "current_password" || field === "new_password" || field === "confirm_password") {
            setError(field, { message });
            mapped = true;
          }
        }
        if (!mapped) setFormError(e.message);
        return;
      }
      if (e.code === "incorrect_current_password") {
        setError("current_password", { message: e.message });
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

      <PasswordField
        label="Current Password"
        registration={register("current_password")}
        error={errors.current_password?.message}
        autoComplete="current-password"
      />
      <div className="space-y-2">
        <PasswordField
          label="New Password"
          registration={register("new_password")}
          error={errors.new_password?.message}
          autoComplete="new-password"
        />
        <PasswordRulesChecklist value={newPassword} email={email} />
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
            : "Update Password"}
      </button>

      </fieldset>
    </form>
  );
}