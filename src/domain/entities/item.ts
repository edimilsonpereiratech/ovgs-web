import { z } from 'zod'

export const ItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(3),
  name: z.string().min(2),
  createdAt: z.string().datetime(),
})

export type Item = z.infer<typeof ItemSchema>

export const CreateItemInputSchema = ItemSchema.omit({ id: true, createdAt: true })
export type CreateItemInput = z.infer<typeof CreateItemInputSchema>
