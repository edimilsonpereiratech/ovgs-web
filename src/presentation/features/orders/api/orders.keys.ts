import type { OrderFilters } from '@application/ports/order.repository'
import { queryKeys } from '@lib/query-keys'

export const orderKeys = {
  all: queryKeys.orders,
  list: (filters: OrderFilters) => [...queryKeys.orders, 'list', filters] as const,
  detail: (id: string) => [...queryKeys.orders, 'detail', id] as const,
}
