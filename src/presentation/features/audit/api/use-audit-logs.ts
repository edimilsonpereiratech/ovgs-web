'use client'

import { useQuery } from '@tanstack/react-query'
import type { AuditFilters } from '@application/ports/audit.repository'
import { auditHttpRepository } from '@infrastructure/repositories/audit.http-repository'
import { auditKeys } from '@presentation/features/audit/api/audit.keys'

export function useAuditLogs(filters: AuditFilters) {
  return useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () => auditHttpRepository.list(filters),
  })
}
