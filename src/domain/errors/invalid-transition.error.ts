import { DomainError } from '@domain/errors/domain-error'
import type { OrderStatus } from '@domain/value-objects/order-status'

export class InvalidTransitionError extends DomainError {
  readonly code = 'INVALID_TRANSITION'

  constructor(
    readonly from: OrderStatus,
    readonly to: OrderStatus,
  ) {
    super(`Não é possível mudar o status de ${from} para ${to}`)
  }
}
