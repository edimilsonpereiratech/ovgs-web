import type { OrderRepository } from '@application/ports/order.repository'
import type { Order } from '@domain/entities/order'
import { assertValidTransition, getNextStatus } from '@domain/rules/order-state-machine'

export async function advanceOrderStatus(
  orderRepository: OrderRepository,
  order: Order,
): Promise<Order> {
  const nextStatus = getNextStatus(order.status)
  if (!nextStatus) {
    throw new Error(`A ordem ${order.id} já está no status final`)
  }

  assertValidTransition(order.status, nextStatus)
  return orderRepository.updateStatus(order.id, nextStatus)
}
