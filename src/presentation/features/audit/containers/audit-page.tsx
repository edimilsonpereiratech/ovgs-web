'use client'

import { useMemo, useState } from 'react'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { useAuditLogs } from '@presentation/features/audit/api/use-audit-logs'
import {
  AuditFilters,
  EMPTY_AUDIT_FILTERS,
  type AuditFiltersValue,
} from '@presentation/features/audit/components/audit-filters'
import { AuditTable } from '@presentation/features/audit/components/audit-table'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Spinner } from '@presentation/shared/components/ui/spinner'

export function AuditPage() {
  const [filters, setFilters] = useState<AuditFiltersValue>(EMPTY_AUDIT_FILTERS)

  const { data: transportTypes } = useTransportTypes()
  const { data: logs, isLoading } = useAuditLogs({
    action: filters.action || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  })

  const transportTypesById = useMemo(
    () => new Map((transportTypes ?? []).map((type) => [type.id, type])),
    [transportTypes],
  )

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-text">Auditoria</h1>
        <p className="mt-1 text-sm text-text-muted">
          Histórico de todas as alterações realizadas nas ordens de venda.
        </p>
      </div>

      <div className="mt-6">
        <AuditFilters value={filters} onChange={setFilters} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !logs || logs.length === 0 ? (
          <EmptyState title="Nenhum registro de auditoria encontrado" />
        ) : (
          <AuditTable logs={logs} transportTypesById={transportTypesById} />
        )}
      </div>
    </div>
  )
}
