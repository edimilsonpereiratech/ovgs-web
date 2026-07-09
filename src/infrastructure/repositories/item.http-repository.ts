import type { CreateItemInput, Item } from '@domain/entities/item'
import { httpClient } from '@infrastructure/http/client'
import { ENDPOINTS } from '@infrastructure/http/endpoints'

export const itemHttpRepository = {
  async list(): Promise<Item[]> {
    const { data } = await httpClient.get(ENDPOINTS.items)
    return data
  },

  async create(input: CreateItemInput): Promise<Item> {
    const { data } = await httpClient.post(ENDPOINTS.items, input)
    return data
  },
}
