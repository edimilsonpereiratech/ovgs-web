import {
  CreateTransportTypeInputSchema,
  TransportTypeSchema,
  UpdateTransportTypeInputSchema,
} from '@domain/entities/transport-type'

describe('TransportTypeSchema', () => {
  it('accepts a persisted transport type with id and createdAt', () => {
    const result = TransportTypeSchema.safeParse({
      id: '99999999-9999-4999-8999-999999999999',
      name: 'Caminhão',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })
})

describe('CreateTransportTypeInputSchema', () => {
  it('accepts a name with at least 2 characters', () => {
    expect(CreateTransportTypeInputSchema.safeParse({ name: 'Caminhão' }).success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    expect(CreateTransportTypeInputSchema.safeParse({ name: 'C' }).success).toBe(false)
  })
})

describe('UpdateTransportTypeInputSchema', () => {
  it('accepts the same shape as the creation input', () => {
    expect(UpdateTransportTypeInputSchema.safeParse({ name: 'Carreta' }).success).toBe(true)
  })
})
