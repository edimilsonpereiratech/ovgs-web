'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { advanceOrderStatus } from '@application/orders/update-order-status.use-case'
import type { Order } from '@domain/entities/order'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

export function useAdvanceOrderStatus() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (order: Order) => advanceOrderStatus(orderHttpRepository, order),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.setQueryData(orderKeys.detail(updated.id), updated)
      dispatch(notify('success', 'Status da ordem atualizado'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
