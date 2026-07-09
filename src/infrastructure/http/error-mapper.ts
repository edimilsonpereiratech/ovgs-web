import axios from 'axios'
import { DuplicateSkuError } from '@domain/errors/duplicate-sku.error'
import { InvalidTransitionError } from '@domain/errors/invalid-transition.error'
import { SchedulingNotAllowedError } from '@domain/errors/scheduling-not-allowed.error'
import { TransportNotAuthorizedError } from '@domain/errors/transport-not-authorized.error'
import type { OrderStatus } from '@domain/value-objects/order-status'

export class HttpStatusError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpStatusError'
  }
}

interface ApiErrorBody {
  code?: string
  message?: string
  meta?: Record<string, unknown>
}

export function mapHttpError(error: unknown): Error {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new Error('Erro inesperado. Tente novamente.')
  }

  if (!error.response) {
    return new HttpStatusError(0, 'Falha de conexão. Verifique sua internet e tente novamente.')
  }

  const body = error.response.data as ApiErrorBody | undefined
  const meta = body?.meta ?? {}

  switch (body?.code) {
    case 'INVALID_TRANSITION':
      return new InvalidTransitionError(meta.from as OrderStatus, meta.to as OrderStatus)
    case 'DUPLICATE_SKU':
      return new DuplicateSkuError(meta.sku as string)
    case 'TRANSPORT_NOT_AUTHORIZED':
      return new TransportNotAuthorizedError(
        meta.clientId as string,
        meta.transportTypeId as string,
      )
    case 'SCHEDULING_NOT_ALLOWED':
      return new SchedulingNotAllowedError(meta.currentStatus as OrderStatus)
    default:
      return new HttpStatusError(
        error.response.status,
        body?.message ?? 'Erro inesperado. Tente novamente.',
      )
  }
}
