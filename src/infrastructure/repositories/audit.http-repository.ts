import type { AuditFilters, AuditRepository } from '@application/ports/audit.repository'
import type { AuditLog } from '@domain/entities/audit-log'
import { httpClient } from '@infrastructure/http/client'
import { ENDPOINTS } from '@infrastructure/http/endpoints'

export const auditHttpRepository: AuditRepository = {
  async list(filters: AuditFilters): Promise<AuditLog[]> {
    const { data } = await httpClient.get(ENDPOINTS.auditLogs, { params: filters })
    return data
  },

  async listByOrder(orderId: string): Promise<AuditLog[]> {
    const { data } = await httpClient.get(ENDPOINTS.auditLogs, { params: { orderId } })
    return data
  },
}
