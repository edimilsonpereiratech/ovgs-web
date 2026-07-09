'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateTransportTypeInput } from '@domain/entities/transport-type'
import { transportTypeHttpRepository } from '@infrastructure/repositories/transport-type.http-repository'
import { transportTypeKeys } from '@presentation/features/transport-types/api/transport-types.keys'
import { useAppDispatch } from '@store/hooks'
import { notify } from '@store/slices/notifications.slice'

interface UpdateTransportTypeVariables {
  id: string
  input: UpdateTransportTypeInput
}

export function useUpdateTransportType() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationKey: ['transport-types', 'update'],
    mutationFn: ({ id, input }: UpdateTransportTypeVariables) =>
      transportTypeHttpRepository.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.all })
      dispatch(notify('success', 'Tipo de transporte atualizado com sucesso'))
    },
    onError: (error: Error) => {
      dispatch(notify('error', error.message))
    },
  })
}
