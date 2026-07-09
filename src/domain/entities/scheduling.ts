import { z } from 'zod'
import { DeliveryWindowSchema } from '@domain/value-objects/delivery-window'

export const SchedulingSchema = z.object({
  orderId: z.string().uuid(),
  deliveryDate: z.string().date(),
  timeWindow: DeliveryWindowSchema,
  confirmedAt: z.string().datetime().nullable(),
  rescheduledFrom: z.string().date().nullable(),
})

export type Scheduling = z.infer<typeof SchedulingSchema>

export const CreateSchedulingInputSchema = z.object({
  deliveryDate: z.string().date(),
  timeWindow: DeliveryWindowSchema,
})
export type CreateSchedulingInput = z.infer<typeof CreateSchedulingInputSchema>
