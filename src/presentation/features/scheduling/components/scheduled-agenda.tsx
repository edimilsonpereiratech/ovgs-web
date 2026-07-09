import type { Client } from '@domain/entities/client'
import type { Order } from '@domain/entities/order'
import type { TransportType } from '@domain/entities/transport-type'
import { MAX_DELIVERIES_PER_WINDOW } from '@domain/rules/scheduling-capacity'
import { formatDeliveryWindow } from '@domain/value-objects/delivery-window'
import { formatDate } from '@lib/date'
import type { ScheduledGroup } from '@presentation/features/scheduling/api/use-schedulable-orders'
import { Badge } from '@presentation/shared/components/ui/badge'
import { Button } from '@presentation/shared/components/ui/button'

interface ScheduledAgendaProps {
  groups: ScheduledGroup[]
  clientsById: Map<string, Client>
  transportTypesById: Map<string, TransportType>
  onReschedule: (order: Order) => void
}

export function ScheduledAgenda({
  groups,
  clientsById,
  transportTypesById,
  onReschedule,
}: ScheduledAgendaProps) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.deliveryDate}>
          <h3 className="mb-2 text-sm font-semibold text-text">{formatDate(group.deliveryDate)}</h3>
          <div className="flex flex-col gap-2">
            {group.orders.map((order) => {
              const sameWindowCount = group.orders.filter(
                (candidate) => candidate.scheduling?.timeWindow.start === order.scheduling?.timeWindow.start,
              ).length
              const nearCapacity = sameWindowCount >= MAX_DELIVERIES_PER_WINDOW

              return (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge color={nearCapacity ? 'warning' : 'scheduled'}>
                      {order.scheduling ? formatDeliveryWindow(order.scheduling.timeWindow) : '—'}
                    </Badge>
                    <span className="text-sm font-medium text-text">
                      {clientsById.get(order.clientId)?.name ?? order.clientId}
                    </span>
                    <span className="text-sm text-text-muted">
                      {transportTypesById.get(order.transportTypeId)?.name ?? order.transportTypeId}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => onReschedule(order)}>
                    Reagendar
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
