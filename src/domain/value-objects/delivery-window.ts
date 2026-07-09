import { z } from 'zod'

export const DeliveryWindowSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
})

export type DeliveryWindow = z.infer<typeof DeliveryWindowSchema>

export const STANDARD_DELIVERY_WINDOWS: DeliveryWindow[] = [
  { start: '08:00', end: '10:00' },
  { start: '10:00', end: '12:00' },
  { start: '14:00', end: '16:00' },
  { start: '16:00', end: '18:00' },
]

export function formatDeliveryWindow(window: DeliveryWindow): string {
  return `${window.start} - ${window.end}`
}
