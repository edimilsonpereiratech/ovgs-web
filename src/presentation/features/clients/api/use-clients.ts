'use client'

import { useQuery } from '@tanstack/react-query'
import { clientHttpRepository } from '@infrastructure/repositories/client.http-repository'
import { clientKeys } from '@presentation/features/clients/api/clients.keys'

export function useClients() {
  return useQuery({
    queryKey: clientKeys.all,
    queryFn: clientHttpRepository.list,
  })
}
