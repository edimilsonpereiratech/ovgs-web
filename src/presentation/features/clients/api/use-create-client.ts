'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateClientInput } from '@domain/entities/client'
import { clientHttpRepository } from '@infrastructure/repositories/client.http-repository'
import { clientKeys } from '@presentation/features/clients/api/clients.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

export function useCreateClient() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (input: CreateClientInput) => clientHttpRepository.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
      dispatch(notify('success', 'Cliente criado com sucesso'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
