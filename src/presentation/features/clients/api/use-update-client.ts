'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateClientInput } from '@domain/entities/client'
import { clientHttpRepository } from '@infrastructure/repositories/client.http-repository'
import { clientKeys } from '@presentation/features/clients/api/clients.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

interface UpdateClientVariables {
  id: string
  input: UpdateClientInput
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationKey: ['clients', 'update'],
    mutationFn: ({ id, input }: UpdateClientVariables) => clientHttpRepository.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
      dispatch(notify('success', 'Cliente atualizado com sucesso'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
