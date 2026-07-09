import { DuplicateSkuError } from '@domain/errors/duplicate-sku.error'
import { InvalidTransitionError } from '@domain/errors/invalid-transition.error'
import { SchedulingNotAllowedError } from '@domain/errors/scheduling-not-allowed.error'
import { TransportNotAuthorizedError } from '@domain/errors/transport-not-authorized.error'
import { HttpStatusError, mapHttpError } from '@infrastructure/http/error-mapper'

function buildAxiosError(status: number, body: Record<string, unknown>) {
  return {
    isAxiosError: true,
    response: { status, data: body },
  }
}

describe('mapHttpError', () => {
  it('maps a 422 INVALID_TRANSITION response to a domain error', () => {
    const error = buildAxiosError(422, {
      code: 'INVALID_TRANSITION',
      meta: { from: 'CRIADA', to: 'EM_TRANSPORTE' },
    })

    expect(mapHttpError(error)).toBeInstanceOf(InvalidTransitionError)
  })

  it('maps a 409 DUPLICATE_SKU response to a domain error carrying the SKU', () => {
    const error = buildAxiosError(409, { code: 'DUPLICATE_SKU', meta: { sku: 'SKU-1' } })

    const mapped = mapHttpError(error)
    expect(mapped).toBeInstanceOf(DuplicateSkuError)
    expect((mapped as DuplicateSkuError).sku).toBe('SKU-1')
  })

  it('maps a 422 TRANSPORT_NOT_AUTHORIZED response to a domain error', () => {
    const error = buildAxiosError(422, {
      code: 'TRANSPORT_NOT_AUTHORIZED',
      meta: { clientId: 'client-1', transportTypeId: 'truck-1' },
    })

    expect(mapHttpError(error)).toBeInstanceOf(TransportNotAuthorizedError)
  })

  it('maps a 422 SCHEDULING_NOT_ALLOWED response to a domain error', () => {
    const error = buildAxiosError(422, {
      code: 'SCHEDULING_NOT_ALLOWED',
      meta: { currentStatus: 'CRIADA' },
    })

    expect(mapHttpError(error)).toBeInstanceOf(SchedulingNotAllowedError)
  })

  it('falls back to a generic HttpStatusError for unknown error codes', () => {
    const error = buildAxiosError(500, { message: 'Erro interno' })

    const mapped = mapHttpError(error)
    expect(mapped).toBeInstanceOf(HttpStatusError)
    expect(mapped.message).toBe('Erro interno')
    expect((mapped as HttpStatusError).status).toBe(500)
  })

  it('maps a network failure without a response to a connection error', () => {
    const error = { isAxiosError: true, response: undefined }

    const mapped = mapHttpError(error)
    expect(mapped).toBeInstanceOf(HttpStatusError)
    expect(mapped.message).toMatch(/conexão/i)
  })

  it('passes through non-axios errors untouched', () => {
    const original = new Error('Erro genérico')
    expect(mapHttpError(original)).toBe(original)
  })

  it('wraps a non-axios, non-Error value in a generic error', () => {
    const mapped = mapHttpError('algo deu errado')
    expect(mapped).toBeInstanceOf(Error)
    expect(mapped.message).toBe('Erro inesperado. Tente novamente.')
  })

  it('falls back to a generic message when the response body has no message', () => {
    const error = buildAxiosError(500, {})

    const mapped = mapHttpError(error)
    expect(mapped.message).toBe('Erro inesperado. Tente novamente.')
  })
})
