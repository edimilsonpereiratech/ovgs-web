import { Badge, type BadgeColor } from '@presentation/shared/components/ui/badge'
import { ORDER_STATUS_CONFIG, type OrderStatus } from '@domain/value-objects/order-status'

const TOKEN_TO_COLOR: Record<string, BadgeColor> = {
  'status-created': 'created',
  'status-planned': 'planned',
  'status-scheduled': 'scheduled',
  'status-transit': 'transit',
  'status-delivered': 'delivered',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_CONFIG[status]
  return <Badge color={TOKEN_TO_COLOR[config.colorToken]}>{config.label}</Badge>
}
