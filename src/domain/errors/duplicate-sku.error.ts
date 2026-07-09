import { DomainError } from '@domain/errors/domain-error'

export class DuplicateSkuError extends DomainError {
  readonly code = 'DUPLICATE_SKU'

  constructor(readonly sku: string) {
    super(`Já existe um item cadastrado com o SKU ${sku}`)
  }
}
