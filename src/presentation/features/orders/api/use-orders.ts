'use client'

import { useQuery } from '@tanstack/react-query'
import type { OrderFilters } from '@application/ports/order.repository'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderHttpRepository.list(filters),
  })
}
