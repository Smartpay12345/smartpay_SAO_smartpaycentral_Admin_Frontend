// lib/validations/fields.ts
import { z } from "zod";

export const emailField = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

export const PASSWORD_RULES = [
  { key: "length", label: "10–72 characters", message: "Password must be 10–72 characters", test: (v: string) => v.length >= 10 && v.length <= 72 },
  { key: "lower", label: "One lowercase letter", message: "Include at least one lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { key: "upper", label: "One uppercase letter", message: "Include at least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { key: "number", label: "One number", message: "Include at least one number", test: (v: string) => /[0-9]/.test(v) },
  { key: "special", label: "One special character", message: "Include at least one special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

// for creating or changing a password
export const passwordField = z.string().superRefine((value, ctx) => {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) ctx.addIssue({ code: "custom", message: rule.message });
  }
});

// for the login form only: never apply strength rules to an existing password
export const loginPasswordField = z
  .string()
  .min(1, "Password is required")
  .max(72, "Password must be under 72 characters");

// "must not contain the part of the email before the @" (Change Password knows the admin's email)
export function passwordContainsEmailName(password: string, email: string) {
  const local = email.split("@")[0]?.toLowerCase();
  return Boolean(local) && password.toLowerCase().includes(local);
}

export const confirmPasswordRefinement = (
  data: { password: string; confirmPassword: string },
  ctx: z.RefinementCtx
) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
};

export const NG_PHONE = /^(\+?234|0)?[789][01]\d{8}$/