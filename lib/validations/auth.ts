import { z } from "zod";
import { emailField, loginPasswordField, passwordContainsEmailName, passwordField,  } from "./fields";

export const loginSchema = z.object({
  email: emailField,
  password: loginPasswordField,
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

const changePasswordBase = z.object({
  current_password: z.string().min(1, "Enter your current password"),
  new_password: passwordField,
  confirm_password: z.string().min(1, "Confirm your new password"),
});
export type ChangePasswordValues = z.infer<typeof changePasswordBase>;

export function buildChangePasswordSchema(email: string) {
  return changePasswordBase.superRefine((d, ctx) => {
    if (d.new_password && d.new_password === d.current_password) {
      ctx.addIssue({ code: "custom", path: ["new_password"], message: "New password must be different from your current password" });
    }
    if (d.new_password && passwordContainsEmailName(d.new_password, email)) {
      ctx.addIssue({ code: "custom", path: ["new_password"], message: "Password must not contain the first part of your email" });
    }
    if (d.confirm_password && d.new_password !== d.confirm_password) {
      ctx.addIssue({ code: "custom", path: ["confirm_password"], message: "Passwords do not match" });
    }
  });
}

export const bankAccountSchema = z.object({
  bankName: z.string().min(1, 'Select a bank'),
  accountNumber: z.string().length(10, 'Account number must be 10 digits'),
  accountName: z.string().min(1, 'Verify your account number first'),
  nickname: z.string().optional(),
})

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>


export const resetPasswordSchema = z
  .object({
    new_password: passwordField,
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;