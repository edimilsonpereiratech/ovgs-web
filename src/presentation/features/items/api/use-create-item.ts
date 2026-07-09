'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateItemInput } from '@domain/entities/item'
import { itemHttpRepository } from '@infrastructure/repositories/item.http-repository'
import { itemKeys } from '@presentation/features/items/api/items.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

export function useCreateItem() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationKey: ['items', 'create'],
    mutationFn: (input: CreateItemInput) => itemHttpRepository.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all })
      dispatch(notify('success', 'Item criado com sucesso'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
