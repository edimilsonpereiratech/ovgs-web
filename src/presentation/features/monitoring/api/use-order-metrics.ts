'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { OrderFilters } from '@application/ports/order.repository'
import { ORDER_STATUS_SEQUENCE, type OrderStatus } from '@domain/value-objects/order-status'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'

const METRICS_SAMPLE_SIZE = 500

export function useOrderMetrics(filters: Omit<OrderFilters, 'status' | 'page' | 'pageSize'>) {
  const query = useQuery({
    queryKey: [...orderKeys.all, 'metrics', filters],
    queryFn: () => orderHttpRepository.list({ ...filters, page: 1, pageSize: METRICS_SAMPLE_SIZE }),
  })

  const counts = useMemo(() => {
    const base: Record<OrderStatus, number> = {
      CRIADA: 0,
      PLANEJADA: 0,
      AGENDADA: 0,
      EM_TRANSPORTE: 0,
      ENTREGUE: 0,
    }
    for (const order of query.data?.items ?? []) {
      base[order.status] += 1
    }
    return base
  }, [query.data])

  const total = query.data?.total ?? 0

  return {
    isLoading: query.isLoading,
    total,
    counts,
    statuses: ORDER_STATUS_SEQUENCE,
  }
}
