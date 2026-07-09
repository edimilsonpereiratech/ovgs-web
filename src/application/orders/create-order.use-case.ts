import type { OrderRepository } from '@application/ports/order.repository'
import type { Client } from '@domain/entities/client'
import type { CreateOrderInput, Order } from '@domain/entities/order'
import { assertTransportAuthorized } from '@domain/rules/transport-auth'

export async function createOrder(
  orderRepository: OrderRepository,
  client: Client,
  input: CreateOrderInput,
): Promise<Order> {
  assertTransportAuthorized(client, input.transportTypeId)
  return orderRepository.create(input)
}
