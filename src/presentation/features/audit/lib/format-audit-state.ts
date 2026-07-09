import type { AuditAction } from '@domain/entities/audit-log'
import type { TransportType } from '@domain/entities/transport-type'
import { ORDER_STATUS_CONFIG, type OrderStatus } from '@domain/value-objects/order-status'

export function formatAuditState(
  action: AuditAction,
  state: string | null,
  transportTypesById: Map<string, TransportType>,
): string {
  if (state === null) return '—'

  if (action === 'STATUS_CHANGED' || action === 'ORDER_CREATED') {
    return ORDER_STATUS_CONFIG[state as OrderStatus]?.label ?? state
  }

  if (action === 'TRANSPORT_CHANGED') {
    return transportTypesById.get(state)?.name ?? state
  }

  return state
}
