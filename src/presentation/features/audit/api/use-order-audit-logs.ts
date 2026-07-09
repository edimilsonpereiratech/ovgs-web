'use client'

import { useQuery } from '@tanstack/react-query'
import { auditHttpRepository } from '@infrastructure/repositories/audit.http-repository'
import { auditKeys } from '@presentation/features/audit/api/audit.keys'

export function useOrderAuditLogs(orderId: string) {
  return useQuery({
    queryKey: auditKeys.byOrder(orderId),
    queryFn: () => auditHttpRepository.listByOrder(orderId),
  })
}
