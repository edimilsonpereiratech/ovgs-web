import { z } from 'zod'

export const OrderStatusSchema = z.enum([
  'CRIADA',
  'PLANEJADA',
  'AGENDADA',
  'EM_TRANSPORTE',
  'ENTREGUE',
])

export type OrderStatus = z.infer<typeof OrderStatusSchema>

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  CRIADA: 'PLANEJADA',
  PLANEJADA: 'AGENDADA',
  AGENDADA: 'EM_TRANSPORTE',
  EM_TRANSPORTE: 'ENTREGUE',
  ENTREGUE: null,
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; colorToken: string }> = {
  CRIADA: { label: 'Criada', colorToken: 'status-created' },
  PLANEJADA: { label: 'Planejada', colorToken: 'status-planned' },
  AGENDADA: { label: 'Agendada', colorToken: 'status-scheduled' },
  EM_TRANSPORTE: { label: 'Em Transporte', colorToken: 'status-transit' },
  ENTREGUE: { label: 'Entregue', colorToken: 'status-delivered' },
}

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'CRIADA',
  'PLANEJADA',
  'AGENDADA',
  'EM_TRANSPORTE',
  'ENTREGUE',
]
