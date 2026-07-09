import type { Client, CreateClientInput, UpdateClientInput } from '@domain/entities/client'
import { httpClient } from '@infrastructure/http/client'
import { ENDPOINTS } from '@infrastructure/http/endpoints'

export const clientHttpRepository = {
  async list(): Promise<Client[]> {
    const { data } = await httpClient.get(ENDPOINTS.clients)
    return data
  },

  async create(input: CreateClientInput): Promise<Client> {
    const { data } = await httpClient.post(ENDPOINTS.clients, input)
    return data
  },

  async update(id: string, input: UpdateClientInput): Promise<Client> {
    const { data } = await httpClient.put(ENDPOINTS.client(id), input)
    return data
  },
}
