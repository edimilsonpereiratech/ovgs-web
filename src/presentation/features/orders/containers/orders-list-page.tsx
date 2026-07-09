'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  OrderFilters,
  type OrderFiltersValue,
} from '@presentation/features/orders/components/order-filters'
import { OrderTable } from '@presentation/features/orders/components/order-table'
import { useOrders } from '@presentation/features/orders/api/use-orders'
import { useClients } from '@presentation/features/clients/api/use-clients'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { Button } from '@presentation/shared/components/ui/button'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Pagination } from '@presentation/shared/components/ui/pagination'
import { Spinner } from '@presentation/shared/components/ui/spinner'

const PAGE_SIZE = 10

export function OrdersListPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<OrderFiltersValue>({
    status: '',
    clientId: '',
    transportTypeId: '',
  })
  const [page, setPage] = useState(1)

  const { data: clients } = useClients()
  const { data: transportTypes } = useTransportTypes()
  const { data, isLoading } = useOrders({
    status: filters.status || undefined,
    clientId: filters.clientId || undefined,
    transportTypeId: filters.transportTypeId || undefined,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Ordens de Venda</h1>
          <p className="mt-1 text-sm text-text-muted">
            Acompanhe e gerencie o ciclo de vida das ordens de venda.
          </p>
        </div>
        <Button onClick={() => router.push('/ordens/nova')}>
          <Plus className="h-4 w-4" />
          Nova ordem
        </Button>
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
          <EmptyState title="Nenhuma ordem encontrada" />
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
