import { z } from 'zod'

const fuelEntry = z.object({
  enabled: z.boolean(),
  capacity: z.string().optional(),
})

export const addBranchSchema = z
  .object({
    branchName: z.string().min(3, 'Branch name must be at least 3 characters'),
    locationState: z.string().min(1, 'Select a state'),
    address: z.string().min(8, 'Enter a full street address'),
    managerId: z.string().min(1, 'Select a manager'),
    stationId: z.string().min(1, 'Station ID is required'),
    fuelTypes: z.object({
      PMS: fuelEntry,
      AGO: fuelEntry,
      DPK: fuelEntry,
      Gas: fuelEntry,
    }),
  })
  .refine((data) => Object.values(data.fuelTypes).some((f) => f.enabled), {
    message: 'Select at least one fuel type',
    path: ['fuelTypes'],
  })
  .refine(
    (data) =>
      Object.values(data.fuelTypes).every(
        (f) => !f.enabled || (f.capacity && Number(f.capacity) > 0)
      ),
    { message: 'Enter a valid capacity for every selected fuel type', path: ['fuelTypes'] }
  )

export type AddBranchFormValues = z.infer<typeof addBranchSchema>