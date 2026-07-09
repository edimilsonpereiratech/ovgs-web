import { DomainError } from '@domain/errors/domain-error'
import type { OrderStatus } from '@domain/value-objects/order-status'

export class SchedulingNotAllowedError extends DomainError {
  readonly code = 'SCHEDULING_NOT_ALLOWED'

  constructor(readonly currentStatus: OrderStatus) {
    super(`Agendamento não é permitido para uma ordem com status ${currentStatus}`)
  }
}
