import type {
  CreateTransportTypeInput,
  TransportType,
  UpdateTransportTypeInput,
} from '@domain/entities/transport-type'
import { httpClient } from '@infrastructure/http/client'
import { ENDPOINTS } from '@infrastructure/http/endpoints'

export const transportTypeHttpRepository = {
  async list(): Promise<TransportType[]> {
    const { data } = await httpClient.get(ENDPOINTS.transportTypes)
    return data
  },

  async create(input: CreateTransportTypeInput): Promise<TransportType> {
    const { data } = await httpClient.post(ENDPOINTS.transportTypes, input)
    return data
  },

  async update(id: string, input: UpdateTransportTypeInput): Promise<TransportType> {
    const { data } = await httpClient.put(ENDPOINTS.transportType(id), input)
    return data
  },
}
