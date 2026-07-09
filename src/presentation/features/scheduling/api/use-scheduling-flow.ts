'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import type { Order } from '@domain/entities/order'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import {
  schedulingConflictAcknowledged,
  schedulingRequested,
  type SchedulingMode,
} from '@store/slices/orders.slice'

export function useSchedulingFlow() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { isProcessing, conflict, lastUpdatedOrder } = useAppSelector((state) => state.orders)

  useEffect(() => {
    if (!lastUpdatedOrder) return
    queryClient.invalidateQueries({ queryKey: orderKeys.all })
    queryClient.setQueryData(orderKeys.detail(lastUpdatedOrder.id), lastUpdatedOrder)
  }, [lastUpdatedOrder, queryClient])

  const requestScheduling = useCallback(
    (order: Order, input: CreateSchedulingInput, mode: SchedulingMode) => {
      dispatch(schedulingRequested({ order, input, mode }))
    },
    [dispatch],
  )

  const acknowledgeConflict = useCallback(
    (proceed: boolean) => {
      dispatch(schedulingConflictAcknowledged({ proceed }))
    },
    [dispatch],
  )

  return { isProcessing, conflict, requestScheduling, acknowledgeConflict }
}
