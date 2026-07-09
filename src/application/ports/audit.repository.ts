import type { AuditAction, AuditLog } from '@domain/entities/audit-log'

export interface AuditFilters {
  orderId?: string
  action?: AuditAction
  dateFrom?: string
  dateTo?: string
}

export interface AuditRepository {
  list(filters: AuditFilters): Promise<AuditLog[]>
  listByOrder(orderId: string): Promise<AuditLog[]>
}
