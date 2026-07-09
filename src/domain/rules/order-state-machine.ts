import { InvalidTransitionError } from '@domain/errors/invalid-transition.error'
import { VALID_TRANSITIONS, type OrderStatus } from '@domain/value-objects/order-status'

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  return VALID_TRANSITIONS[current]
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return getNextStatus(from) === to
}

export function assertValidTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to)
  }
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return getNextStatus(status) === null
}
