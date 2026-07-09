'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateTransportTypeInput } from '@domain/entities/transport-type'
import { transportTypeHttpRepository } from '@infrastructure/repositories/transport-type.http-repository'
import { transportTypeKeys } from '@presentation/features/transport-types/api/transport-types.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

export function useCreateTransportType() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationKey: ['transport-types', 'create'],
    mutationFn: (input: CreateTransportTypeInput) => transportTypeHttpRepository.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.all })
      dispatch(notify('success', 'Tipo de transporte criado com sucesso'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
