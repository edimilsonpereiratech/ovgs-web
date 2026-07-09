import { ORDER_STATUS_CONFIG, type OrderStatus } from '@domain/value-objects/order-status'
import { MetricCard } from '@presentation/features/monitoring/components/metric-card'

interface MetricCardsRowProps {
  statuses: OrderStatus[]
  counts: Record<OrderStatus, number>
}

export function MetricCardsRow({ statuses, counts }: MetricCardsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {statuses.map((status) => {
        const config = ORDER_STATUS_CONFIG[status]
        return (
          <MetricCard
            key={status}
            label={config.label}
            value={counts[status]}
            colorToken={config.colorToken}
          />
        )
      })}
    </div>
  )
}
