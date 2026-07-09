'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'
import { auditKeys } from '@presentation/features/audit/api/audit.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

interface UpdateOrderTransportVariables {
  orderId: string
  transportTypeId: string
}

export function useUpdateOrderTransport() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: ({ orderId, transportTypeId }: UpdateOrderTransportVariables) =>
      orderHttpRepository.updateTransport(orderId, transportTypeId),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: auditKeys.byOrder(updated.id) })
      queryClient.setQueryData(orderKeys.detail(updated.id), updated)
      dispatch(notify('success', 'Transporte da ordem atualizado'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
