import { z } from "zod";

export const emailField = z
  .string()
  .min(1, "Email is required")
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

/**
 * Not wired into any form yet, but ready for the moment you add
 * sign-up / reset-password with a confirmation field. Usage:
 *
 *   z.object({ password: passwordField, confirmPassword: passwordField })
 *     .superRefine(confirmPasswordRefinement)
 */
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


export const nigerianPhoneField = z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => val.replace(/\D/g, "")) // strip spaces/dashes before checking
  .pipe(
    z
      .string()
      .regex(
        /^(0\d{10}|234\d{10})$/,
        "Enter a valid Nigerian phone number (e.g. 0801 234 5678)"
      )
  );