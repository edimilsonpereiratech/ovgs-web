import type { AuditFilters } from '@application/ports/audit.repository'
import { queryKeys } from '@lib/query-keys'

export const auditKeys = {
  all: queryKeys.auditLogs,
  list: (filters: AuditFilters) => [...queryKeys.auditLogs, 'list', filters] as const,
  byOrder: (orderId: string) => [...queryKeys.auditLogs, 'order', orderId] as const,
}
