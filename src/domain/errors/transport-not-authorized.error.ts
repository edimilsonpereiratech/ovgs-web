import { DomainError } from '@domain/errors/domain-error'

export class TransportNotAuthorizedError extends DomainError {
  readonly code = 'TRANSPORT_NOT_AUTHORIZED'

  constructor(
    readonly clientId: string,
    readonly transportTypeId: string,
  ) {
    super('O tipo de transporte informado não está autorizado para este cliente')
  }
}
