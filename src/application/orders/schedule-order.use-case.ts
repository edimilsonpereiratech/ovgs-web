import type { OrderRepository } from '@application/ports/order.repository'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'
import type { Order } from '@domain/entities/order'
import { SchedulingNotAllowedError } from '@domain/errors/scheduling-not-allowed.error'

export async function confirmScheduling(
  orderRepository: OrderRepository,
  order: Order,
  input: CreateSchedulingInput,
): Promise<Order> {
  if (order.status !== 'PLANEJADA') {
    throw new SchedulingNotAllowedError(order.status)
  }
  return orderRepository.confirmScheduling(order.id, input)
}

export async function rescheduleScheduling(
  orderRepository: OrderRepository,
  order: Order,
  input: CreateSchedulingInput,
): Promise<Order> {
  if (order.status !== 'AGENDADA') {
    throw new SchedulingNotAllowedError(order.status)
  }
  return orderRepository.rescheduleScheduling(order.id, input)
}
