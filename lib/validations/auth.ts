import { z } from "zod";
import { emailField, passwordField } from "./fields";

export const getStartedSchema = z.object({
  email: emailField,
});
export type GetStartedValues = z.infer<typeof getStartedSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const bankAccountSchema = z.object({
  bankName: z.string().min(1, 'Select a bank'),
  accountNumber: z.string().length(10, 'Account number must be 10 digits'),
  accountName: z.string().min(1, 'Verify your account number first'),
  nickname: z.string().optional(),
})

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>
