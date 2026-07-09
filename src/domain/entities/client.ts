import { z } from 'zod'

export const ClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  document: z.string().min(11),
  authorizedTransportTypeIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
})

export type Client = z.infer<typeof ClientSchema>

export const CreateClientInputSchema = ClientSchema.omit({ id: true, createdAt: true })
export type CreateClientInput = z.infer<typeof CreateClientInputSchema>

export const UpdateClientInputSchema = CreateClientInputSchema
export type UpdateClientInput = z.infer<typeof UpdateClientInputSchema>
