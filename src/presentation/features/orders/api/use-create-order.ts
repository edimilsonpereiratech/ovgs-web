'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrder } from '@application/orders/create-order.use-case'
import type { Client } from '@domain/entities/client'
import type { CreateOrderInput } from '@domain/entities/order'
import { orderHttpRepository } from '@infrastructure/repositories/order.http-repository'
import { orderKeys } from '@presentation/features/orders/api/orders.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

interface CreateOrderVariables {
  client: Client
  input: CreateOrderInput
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationKey: ['orders', 'create'],
    mutationFn: ({ client, input }: CreateOrderVariables) =>
      createOrder(orderHttpRepository, client, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      dispatch(notify('success', 'Ordem de venda criada com sucesso'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
