import type { CreateOrderInput, Order } from '@domain/entities/order'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'
import type { OrderStatus } from '@domain/value-objects/order-status'

export interface OrderFilters {
  status?: OrderStatus
  clientId?: string
  transportTypeId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface OrderRepository {
  list(filters: OrderFilters): Promise<PaginatedResult<Order>>
  getById(id: string): Promise<Order | null>
  create(input: CreateOrderInput): Promise<Order>
  updateStatus(id: string, status: OrderStatus): Promise<Order>
  updateTransport(id: string, transportTypeId: string): Promise<Order>
  confirmScheduling(id: string, input: CreateSchedulingInput): Promise<Order>
  rescheduleScheduling(id: string, input: CreateSchedulingInput): Promise<Order>
}
