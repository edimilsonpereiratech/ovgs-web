'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Order } from '@domain/entities/order'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'

const SCHEDULING_SAMPLE_SIZE = 500

export interface ScheduledGroup {
  deliveryDate: string
  orders: Order[]
}

export function useSchedulableOrders() {
  const query = useQuery({
    queryKey: [...orderKeys.all, 'schedulable'],
    queryFn: () => orderHttpRepository.list({ page: 1, pageSize: SCHEDULING_SAMPLE_SIZE }),
  })

  const pending = useMemo(
    () => (query.data?.items ?? []).filter((order) => order.status === 'PLANEJADA'),
    [query.data],
  )

  const scheduledGroups = useMemo<ScheduledGroup[]>(() => {
    const byDate = new Map<string, Order[]>()

    for (const order of query.data?.items ?? []) {
      if (order.status !== 'AGENDADA' || !order.scheduling) continue
      const group = byDate.get(order.scheduling.deliveryDate) ?? []
      group.push(order)
      byDate.set(order.scheduling.deliveryDate, group)
    }

    return Array.from(byDate.entries())
      .sort(([dateA], [dateB]) => (dateA < dateB ? -1 : 1))
      .map(([deliveryDate, orders]) => ({
        deliveryDate,
        orders: [...orders].sort((a, b) => {
          const startA = a.scheduling?.timeWindow.start ?? ''
          const startB = b.scheduling?.timeWindow.start ?? ''
          return startA < startB ? -1 : startA > startB ? 1 : 0
        }),
      }))
  }, [query.data])

  return { isLoading: query.isLoading, pending, scheduledGroups }
}
