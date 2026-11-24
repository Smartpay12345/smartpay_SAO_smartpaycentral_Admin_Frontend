// // lib/validations/branch.ts
// import { z } from 'zod'

// // 0803..., 803..., +234803... (client-side convenience; the server is the authority)
// const NG_PHONE = /^(\+?234|0)?[789][01]\d{8}$/

// const toNumber = (s: string) => Number(s.replace(/,/g, '').trim())

// export function makeBranchSchema(capacityMax: number) {
//   return z
//     .object({
//       name: z.string().trim().min(2, 'Enter the branch name'),
//       state: z.string().min(1, 'Select a state'),
//       address: z.string().trim().min(5, 'Enter the full street address'),
//       city: z.string().trim(),
//       latitude: z.string().trim(),
//       longitude: z.string().trim(),
//       fuel: z.record(z.string(), z.object({ enabled: z.boolean(), capacity: z.string() })),
//       manager: z.object({
//         full_name: z.string().trim().min(2, 'Enter the manager’s full name'),
//         email: z.string().trim().email('Enter a valid email address'),
//         phone: z
//           .string()
//           .trim()
//           .refine((v) => NG_PHONE.test(v.replace(/[\s-]/g, '')), 'Enter a valid Nigerian phone number'),
//         level: z.string().min(1, 'Select a level'),
//         home_address: z.string().trim(),
//       }),
//     })
//     .superRefine((v, ctx) => {
//       // at least one fuel type, and every ticked one needs a sensible capacity
//       const ticked = Object.entries(v.fuel).filter(([, f]) => f.enabled)
//       if (ticked.length === 0) {
//         ctx.addIssue({ code: 'custom', path: ['fuel'], message: 'Tick at least one fuel type' })
//       }
//       for (const [code, f] of ticked) {
//         const n = toNumber(f.capacity)
//         if (!f.capacity.trim() || !Number.isFinite(n) || n <= 0) {
//           ctx.addIssue({ code: 'custom', path: ['fuel', code, 'capacity'], message: 'Enter a capacity above 0' })
//         } else if (n > capacityMax) {
//           ctx.addIssue({
//             code: 'custom',
//             path: ['fuel', code, 'capacity'],
//             message: `Maximum is ${capacityMax.toLocaleString()}`,
//           })
//         }
//       }

//       // map location: both coordinates or neither
//       const lat = v.latitude.trim()
//       const lng = v.longitude.trim()
//       if (lat || lng) {
//         if (!lat) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter the latitude too' })
//         else if (!(Math.abs(Number(lat)) <= 90)) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Latitude must be between -90 and 90' })
//         if (!lng) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Enter the longitude too' })
//         else if (!(Math.abs(Number(lng)) <= 180)) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Longitude must be between -180 and 180' })
//       }
//     })
// }

// export type BranchFormValues = z.infer<ReturnType<typeof makeBranchSchema>>
// export { toNumber }

// export const editBranchSchema = z
//   .object({
//     name: z.string().trim().min(2, 'Enter the branch name'),
//     state: z.string().min(1, 'Select a state'),
//     address: z.string().trim().min(5, 'Enter the full street address'),
//     city: z.string().trim(),
//     latitude: z.string().trim(),
//     longitude: z.string().trim(),
//   })
//   .superRefine((v, ctx) => {
//     // map location: both coordinates or neither
//     if (v.latitude || v.longitude) {
//       if (!v.latitude) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter the latitude too' })
//       else if (!(Math.abs(Number(v.latitude)) <= 90)) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Latitude must be between -90 and 90' })
//       if (!v.longitude) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Enter the longitude too' })
//       else if (!(Math.abs(Number(v.longitude)) <= 180)) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Longitude must be between -180 and 180' })
//     }
//   })

// export type EditBranchFormValues = z.infer<typeof editBranchSchema>

// lib/validations/branch.ts
import { z } from 'zod'

// 0803..., 803..., +234803... (client-side convenience; the server is the authority)

// strips everything except digits, and keeps a "+" only at the very start
export function sanitizePhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  const plus = raw.trim().startsWith('+') ? '+' : ''
  return (plus + digits).slice(0, 14) // +234 + 10 digits is the longest valid form
}

const PHONE_RE = /^(\+234\d{10}|0\d{10}|\d{10})$/
const BAD_PHONE = 'Enter a valid Nigerian phone number'

// station phone: empty is allowed because the field is optional
export const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || PHONE_RE.test(v), BAD_PHONE)

// manager phone: same format, but it must be filled in
export const requiredPhone = z.string().trim().regex(PHONE_RE, BAD_PHONE)

const toNumber = (s: string) => Number(s.replace(/,/g, '').trim())

export function makeBranchSchema(capacityMax: number) {
  return z
    .object({
      name: z.string().trim().min(2, 'Enter the branch name'),
      state: z.string().min(1, 'Select a state'),
      address: z.string().trim().min(5, 'Enter the full street address'),
      city: z.string().trim(),
      phone: optionalPhone,
      latitude: z.string().trim(),
      longitude: z.string().trim(),
      fuel: z.record(z.string(), z.object({ enabled: z.boolean(), capacity: z.string() })),
      manager: z.object({
        full_name: z.string().trim().min(2, 'Enter the manager’s full name'),
        email: z.string().trim().email('Enter a valid email address'),
        phone: requiredPhone,
        level: z.string().min(1, 'Select a level'),
        home_address: z.string().trim(),
      }),
    })
    .superRefine((v, ctx) => {
      // at least one fuel type, and every ticked one needs a sensible capacity
      const ticked = Object.entries(v.fuel).filter(([, f]) => f.enabled)
      if (ticked.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['fuel'], message: 'Tick at least one fuel type' })
      }
      for (const [code, f] of ticked) {
        const n = toNumber(f.capacity)
        if (!f.capacity.trim() || !Number.isFinite(n) || n <= 0) {
          ctx.addIssue({ code: 'custom', path: ['fuel', code, 'capacity'], message: 'Enter a capacity above 0' })
        } else if (n > capacityMax) {
          ctx.addIssue({
            code: 'custom',
            path: ['fuel', code, 'capacity'],
            message: `Maximum is ${capacityMax.toLocaleString()}`,
          })
        }
      }

      // map location: both coordinates or neither
      const lat = v.latitude.trim()
      const lng = v.longitude.trim()
      if (lat || lng) {
        if (!lat) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter the latitude too' })
        else if (!(Math.abs(Number(lat)) <= 90)) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Latitude must be between -90 and 90' })
        if (!lng) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Enter the longitude too' })
        else if (!(Math.abs(Number(lng)) <= 180)) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Longitude must be between -180 and 180' })
      }
    })
}

export type BranchFormValues = z.infer<ReturnType<typeof makeBranchSchema>>
export { toNumber }

export const editBranchSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter the branch name'),
    state: z.string().min(1, 'Select a state'),
    address: z.string().trim().min(5, 'Enter the full street address'),
    city: z.string().trim(),
    latitude: z.string().trim(),
    longitude: z.string().trim(),
    phone: optionalPhone,
  })
  .superRefine((v, ctx) => {
    // map location: both coordinates or neither
    if (v.latitude || v.longitude) {
      if (!v.latitude) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Enter the latitude too' })
      else if (!(Math.abs(Number(v.latitude)) <= 90)) ctx.addIssue({ code: 'custom', path: ['latitude'], message: 'Latitude must be between -90 and 90' })
      if (!v.longitude) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Enter the longitude too' })
      else if (!(Math.abs(Number(v.longitude)) <= 180)) ctx.addIssue({ code: 'custom', path: ['longitude'], message: 'Longitude must be between -180 and 180' })
    }
  })

export type EditBranchFormValues = z.infer<typeof editBranchSchema>

