import {
  ClientSchema,
  CreateClientInputSchema,
  UpdateClientInputSchema,
} from '@domain/entities/client'

const VALID_INPUT = {
  name: 'Acme Indústria Ltda.',
  document: '12.345.678/0001-90',
  authorizedTransportTypeIds: ['11111111-1111-4111-8111-111111111111'],
}

describe('ClientSchema', () => {
  it('accepts a persisted client with id and createdAt', () => {
    const result = ClientSchema.safeParse({
      ...VALID_INPUT,
      id: '99999999-9999-4999-8999-999999999999',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })
})

describe('UpdateClientInputSchema', () => {
  it('accepts the same shape as the creation input', () => {
    expect(UpdateClientInputSchema.safeParse(VALID_INPUT).success).toBe(true)
  })
})

describe('CreateClientInputSchema', () => {
  it('accepts a client with a valid name and document', () => {
    expect(CreateClientInputSchema.safeParse(VALID_INPUT).success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    expect(CreateClientInputSchema.safeParse({ ...VALID_INPUT, name: 'A' }).success).toBe(false)
  })

  it('rejects a document shorter than 11 characters', () => {
    expect(CreateClientInputSchema.safeParse({ ...VALID_INPUT, document: '123' }).success).toBe(
      false,
    )
  })

  it('rejects a malformed transport type id', () => {
    expect(
      CreateClientInputSchema.safeParse({
        ...VALID_INPUT,
        authorizedTransportTypeIds: ['not-a-uuid'],
      }).success,
    ).toBe(false)
  })
})
