// lib/validations/manager.ts
import { z } from 'zod'
import { emailField, passwordField, confirmPasswordRefinement } from './fields'
import { nigerianPhoneField } from './fields'

export const addManagerSchema = z
  .object({
    fullName: z.string().min(3, 'Full name is required'),
    managerId: z.string().min(1, 'Manager ID is required'),
    phone: nigerianPhoneField,
    email: emailField,
    homeAddress: z.string().min(5, 'Address is required'),
    assignedStation: z.string().min(1, 'Select a station'),
    role: z.string().min(1, 'Select a role'),
    password: passwordField,
    confirmPassword: passwordField,
  })
  .superRefine(confirmPasswordRefinement)

export type AddManagerFormValues = z.infer<typeof addManagerSchema>