import { z } from 'zod'

export const AuditActionSchema = z.enum([
  'ORDER_CREATED',
  'STATUS_CHANGED',
  'SCHEDULING_CHANGED',
  'TRANSPORT_CHANGED',
])

export type AuditAction = z.infer<typeof AuditActionSchema>

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  ORDER_CREATED: 'Ordem criada',
  STATUS_CHANGED: 'Status alterado',
  SCHEDULING_CHANGED: 'Agendamento alterado',
  TRANSPORT_CHANGED: 'Transporte alterado',
}

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  action: AuditActionSchema,
  previousState: z.string().nullable(),
  newState: z.string().nullable(),
  occurredAt: z.string().datetime(),
})

export type AuditLog = z.infer<typeof AuditLogSchema>
