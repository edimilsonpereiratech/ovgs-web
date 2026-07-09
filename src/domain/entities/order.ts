import { z } from 'zod'
import { OrderStatusSchema } from '@domain/value-objects/order-status'
import { SchedulingSchema } from '@domain/entities/scheduling'

export const OrderItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  transportTypeId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1),
  status: OrderStatusSchema,
  scheduling: SchedulingSchema.nullable(),
  observations: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Order = z.infer<typeof OrderSchema>

export const CreateOrderInputSchema = z.object({
  clientId: z.string().uuid(),
  transportTypeId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1),
  observations: z.string().max(500).optional(),
})

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>
