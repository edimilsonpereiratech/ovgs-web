import { z } from 'zod'

export const TransportTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  createdAt: z.string().datetime(),
})

export type TransportType = z.infer<typeof TransportTypeSchema>

export const CreateTransportTypeInputSchema = TransportTypeSchema.omit({
  id: true,
  createdAt: true,
})
export type CreateTransportTypeInput = z.infer<typeof CreateTransportTypeInputSchema>

export const UpdateTransportTypeInputSchema = CreateTransportTypeInputSchema
export type UpdateTransportTypeInput = z.infer<typeof UpdateTransportTypeInputSchema>
