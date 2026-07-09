import type {
  OrderFilters,
  OrderRepository,
  PaginatedResult,
} from '@application/ports/order.repository'
import type { CreateOrderInput, Order } from '@domain/entities/order'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'
import type { OrderStatus } from '@domain/value-objects/order-status'
import { HttpStatusError } from '@infrastructure/http/error-mapper'
import { httpClient } from '@infrastructure/http/client'
import { ENDPOINTS } from '@infrastructure/http/endpoints'

export const orderHttpRepository: OrderRepository = {
  async list(filters: OrderFilters): Promise<PaginatedResult<Order>> {
    const { data } = await httpClient.get(ENDPOINTS.orders, { params: filters })
    return data
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const { data } = await httpClient.get(ENDPOINTS.order(id))
      return data
    } catch (error) {
      if (error instanceof HttpStatusError && error.status === 404) return null
      throw error
    }
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const { data } = await httpClient.post(ENDPOINTS.orders, input)
    return data
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await httpClient.patch(ENDPOINTS.orderStatus(id), { status })
    return data
  },

  async updateTransport(id: string, transportTypeId: string): Promise<Order> {
    const { data } = await httpClient.patch(ENDPOINTS.orderTransport(id), { transportTypeId })
    return data
  },

  async confirmScheduling(id: string, input: CreateSchedulingInput): Promise<Order> {
    const { data } = await httpClient.post(ENDPOINTS.orderScheduling(id), input)
    return data
  },

  async rescheduleScheduling(id: string, input: CreateSchedulingInput): Promise<Order> {
    const { data } = await httpClient.patch(ENDPOINTS.orderReschedule(id), input)
    return data
  },
}
