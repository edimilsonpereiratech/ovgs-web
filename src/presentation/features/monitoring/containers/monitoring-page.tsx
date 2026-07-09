'use client'

import { useMemo, useState } from 'react'
import {
  EMPTY_ORDER_FILTERS,
  OrderFilters,
  type OrderFiltersValue,
} from '@presentation/features/orders/components/order-filters'
import { OrderTable } from '@presentation/features/orders/components/order-table'
import { useOrders } from '@presentation/features/orders/api/use-orders'
import { useClients } from '@presentation/features/clients/api/use-clients'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { useOrderMetrics } from '@presentation/features/monitoring/api/use-order-metrics'
import { MetricCardsRow } from '@presentation/features/monitoring/components/metric-cards-row'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Pagination } from '@presentation/shared/components/ui/pagination'
import { Spinner } from '@presentation/shared/components/ui/spinner'

const PAGE_SIZE = 10

export function MonitoringPage() {
  const [filters, setFilters] = useState<OrderFiltersValue>(EMPTY_ORDER_FILTERS)
  const [page, setPage] = useState(1)

  const { data: clients } = useClients()
  const { data: transportTypes } = useTransportTypes()

  const baseFilters = {
    clientId: filters.clientId || undefined,
    transportTypeId: filters.transportTypeId || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  }

  const metrics = useOrderMetrics(baseFilters)
  const { data, isLoading } = useOrders({
    ...baseFilters,
    status: filters.status || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const clientsById = useMemo(() => new Map((clients ?? []).map((c) => [c.id, c])), [clients])
  const transportTypesById = useMemo(
    () => new Map((transportTypes ?? []).map((t) => [t.id, t])),
    [transportTypes],
  )

  function handleFiltersChange(next: OrderFiltersValue) {
    setFilters(next)
    setPage(1)
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-text">Monitoramento Operacional</h1>
        <p className="mt-1 text-sm text-text-muted">
          Visão consolidada das ordens de venda por status, cliente e transporte.
        </p>
      </div>

      <div className="mt-6">
        {metrics.isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <MetricCardsRow statuses={metrics.statuses} counts={metrics.counts} />
        )}
      </div>

      <div className="mt-6">
        <OrderFilters
          value={filters}
          clients={clients ?? []}
          transportTypes={transportTypes ?? []}
          onChange={handleFiltersChange}
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="Nenhuma ordem encontrada para os filtros selecionados" />
        ) : (
          <>
            <OrderTable
              orders={data.items}
              clientsById={clientsById}
              transportTypesById={transportTypesById}
            />
            <div className="mt-4">
              <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
