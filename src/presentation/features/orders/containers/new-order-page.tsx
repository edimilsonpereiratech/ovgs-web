'use client'

import { useRouter } from 'next/navigation'
import { useCreateOrder } from '@presentation/features/orders/api/use-create-order'
import { OrderForm } from '@presentation/features/orders/components/order-form'
import { useClients } from '@presentation/features/clients/api/use-clients'
import { useItems } from '@presentation/features/items/api/use-items'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { Spinner } from '@presentation/shared/components/ui/spinner'

export function NewOrderPage() {
  const router = useRouter()
  const { data: clients, isLoading: isLoadingClients } = useClients()
  const { data: transportTypes, isLoading: isLoadingTransportTypes } = useTransportTypes()
  const { data: items, isLoading: isLoadingItems } = useItems()
  const createMutation = useCreateOrder()

  const isLoading = isLoadingClients || isLoadingTransportTypes || isLoadingItems

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-text">Nova ordem de venda</h1>
      <p className="mt-1 text-sm text-text-muted">
        Selecione o cliente, o transporte autorizado e os itens da ordem.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <OrderForm
            clients={clients ?? []}
            transportTypes={transportTypes ?? []}
            items={items ?? []}
            isSubmitting={createMutation.isPending}
            onSubmit={(input) => {
              const client = (clients ?? []).find((candidate) => candidate.id === input.clientId)
              if (!client) return

              createMutation.mutate(
                { client, input },
                { onSuccess: (order) => router.push(`/ordens/${order.id}`) },
              )
            }}
          />
        )}
      </div>
    </div>
  )
}
