'use client'

import { useQuery } from '@tanstack/react-query'
import { itemHttpRepository } from '@infrastructure/repositories/item.http-repository'
import { itemKeys } from '@presentation/features/items/api/items.keys'

export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: itemHttpRepository.list,
  })
}
