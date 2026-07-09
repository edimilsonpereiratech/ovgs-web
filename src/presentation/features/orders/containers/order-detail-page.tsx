'use client'

import { useMemo, useState } from 'react'
import { getNextStatus } from '@domain/rules/order-state-machine'
import { ORDER_STATUS_CONFIG } from '@domain/value-objects/order-status'
import { useOrder } from '@presentation/features/orders/api/use-order'
import { useAdvanceOrderStatus } from '@presentation/features/orders/api/use-advance-order-status'
import { useUpdateOrderTransport } from '@presentation/features/orders/api/use-update-order-transport'
import { OrderItemsTable } from '@presentation/features/orders/components/order-items-table'
import { OrderStatusStepper } from '@presentation/features/orders/components/order-status-stepper'
import { OrderSummaryCard } from '@presentation/features/orders/components/order-summary-card'
import { useClients } from '@presentation/features/clients/api/use-clients'
import { useItems } from '@presentation/features/items/api/use-items'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { useOrderAuditLogs } from '@presentation/features/audit/api/use-order-audit-logs'
import { OrderTimeline } from '@presentation/features/audit/components/order-timeline'
import { CapacityConflictDialog } from '@presentation/features/scheduling/components/capacity-conflict-dialog'
import { SchedulingForm } from '@presentation/features/scheduling/components/scheduling-form'
import { useSchedulingFlow } from '@presentation/features/scheduling/api/use-scheduling-flow'
import { Button } from '@presentation/shared/components/ui/button'
import { Drawer } from '@presentation/shared/components/ui/drawer'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Select } from '@presentation/shared/components/ui/select'
import { Spinner } from '@presentation/shared/components/ui/spinner'
import { StatusBadge } from '@presentation/shared/components/status-badge'

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useOrder(orderId)
  const { data: clients } = useClients()
  const { data: transportTypes } = useTransportTypes()
  const { data: items } = useItems()
  const { data: auditLogs } = useOrderAuditLogs(orderId)

  const advanceStatusMutation = useAdvanceOrderStatus()
  const updateTransportMutation = useUpdateOrderTransport()
  const { isProcessing, conflict, requestScheduling, acknowledgeConflict } = useSchedulingFlow()

  const [schedulingOpen, setSchedulingOpen] = useState(false)
  const [transportDraft, setTransportDraft] = useState('')

  const itemsById = useMemo(() => new Map((items ?? []).map((item) => [item.id, item])), [items])
  const transportTypesById = useMemo(
    () => new Map((transportTypes ?? []).map((type) => [type.id, type])),
    [transportTypes],
  )
  const client = clients?.find((candidate) => candidate.id === order?.clientId)
  const transportType = transportTypes?.find((candidate) => candidate.id === order?.transportTypeId)
  const authorizedTransportTypes = useMemo(
    () =>
      (transportTypes ?? []).filter((type) => client?.authorizedTransportTypeIds.includes(type.id)),
    [transportTypes, client],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (!order) {
    return <EmptyState title="Ordem não encontrada" />
  }

  const nextStatus = getNextStatus(order.status)
  const schedulingMode = order.status === 'PLANEJADA' ? 'confirm' : 'reschedule'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Ordem #{order.id.slice(0, 8)}</h1>
          <p className="mt-1 text-sm text-text-muted">Criada em {order.createdAt.slice(0, 10)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <OrderStatusStepper status={order.status} />
      </div>

      <OrderSummaryCard order={order} client={client} transportType={transportType} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-text">Itens</h2>
        <OrderItemsTable orderItems={order.items} itemsById={itemsById} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-text">Histórico</h2>
        <div className="rounded-lg border border-border bg-surface p-4">
          <OrderTimeline logs={auditLogs ?? []} transportTypesById={transportTypesById} />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4">
        {nextStatus && (
          <Button
            disabled={advanceStatusMutation.isPending}
            onClick={() => advanceStatusMutation.mutate(order)}
          >
            Avançar para {ORDER_STATUS_CONFIG[nextStatus].label}
          </Button>
        )}

        {(order.status === 'PLANEJADA' || order.status === 'AGENDADA') && (
          <Button
            variant="secondary"
            disabled={isProcessing}
            onClick={() => setSchedulingOpen(true)}
          >
            {order.status === 'PLANEJADA' ? 'Confirmar agendamento' : 'Reagendar entrega'}
          </Button>
        )}

        {order.status === 'CRIADA' && authorizedTransportTypes.length > 0 && (
          <div className="flex items-end gap-2">
            <Select
              label="Alterar transporte"
              value={transportDraft || order.transportTypeId}
              onChange={(event) => setTransportDraft(event.target.value)}
            >
              {authorizedTransportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            <Button
              variant="secondary"
              disabled={
                updateTransportMutation.isPending ||
                (transportDraft || order.transportTypeId) === order.transportTypeId
              }
              onClick={() =>
                updateTransportMutation.mutate({
                  orderId: order.id,
                  transportTypeId: transportDraft,
                })
              }
            >
              Atualizar
            </Button>
          </div>
        )}
      </div>

      <Drawer
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
        title={schedulingMode === 'confirm' ? 'Confirmar agendamento' : 'Reagendar entrega'}
      >
        <SchedulingForm
          isSubmitting={isProcessing}
          onSubmit={(input) => {
            requestScheduling(order, input, schedulingMode)
            setSchedulingOpen(false)
          }}
        />
      </Drawer>

      <CapacityConflictDialog count={conflict?.count ?? null} onResolve={acknowledgeConflict} />
    </div>
  )
}
