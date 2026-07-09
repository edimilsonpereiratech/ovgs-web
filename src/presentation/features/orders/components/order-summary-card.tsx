import type { Client } from '@domain/entities/client'
import type { Order } from '@domain/entities/order'
import type { TransportType } from '@domain/entities/transport-type'
import { formatDate, formatDateTime } from '@lib/date'
import { formatDeliveryWindow } from '@domain/value-objects/delivery-window'

interface OrderSummaryCardProps {
  order: Order
  client?: Client
  transportType?: TransportType
}

export function OrderSummaryCard({ order, client, transportType }: OrderSummaryCardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4">
      <div>
        <p className="text-xs text-text-muted">Cliente</p>
        <p className="mt-1 text-sm font-medium text-text">{client?.name ?? '—'}</p>
      </div>
      <div>
        <p className="text-xs text-text-muted">Transporte</p>
        <p className="mt-1 text-sm font-medium text-text">{transportType?.name ?? '—'}</p>
      </div>
      <div>
        <p className="text-xs text-text-muted">Criada em</p>
        <p className="mt-1 text-sm font-medium text-text">{formatDateTime(order.createdAt)}</p>
      </div>
      <div>
        <p className="text-xs text-text-muted">Atualizada em</p>
        <p className="mt-1 text-sm font-medium text-text">{formatDateTime(order.updatedAt)}</p>
      </div>
      {order.scheduling && (
        <div className="col-span-2 sm:col-span-4">
          <p className="text-xs text-text-muted">Agendamento</p>
          <p className="mt-1 text-sm font-medium text-text">
            {formatDate(order.scheduling.deliveryDate)} ·{' '}
            {formatDeliveryWindow(order.scheduling.timeWindow)}
          </p>
        </div>
      )}
      {order.observations && (
        <div className="col-span-2 sm:col-span-4">
          <p className="text-xs text-text-muted">Observações</p>
          <p className="mt-1 text-sm text-text">{order.observations}</p>
        </div>
      )}
    </div>
  )
}
