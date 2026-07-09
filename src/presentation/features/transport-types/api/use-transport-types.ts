'use client'

import { useQuery } from '@tanstack/react-query'
import { transportTypeHttpRepository } from '@infrastructure/repositories/transport-type.http-repository'
import { transportTypeKeys } from '@presentation/features/transport-types/api/transport-types.keys'

export function useTransportTypes() {
  return useQuery({
    queryKey: transportTypeKeys.all,
    queryFn: transportTypeHttpRepository.list,
  })
}
