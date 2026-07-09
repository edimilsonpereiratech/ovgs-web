import { CreateOrderInputSchema, OrderItemSchema, OrderSchema } from '@domain/entities/order'

const VALID_INPUT = {
  clientId: '11111111-1111-4111-8111-111111111111',
  transportTypeId: '22222222-2222-4222-8222-222222222222',
  items: [{ itemId: '33333333-3333-4333-8333-333333333333', quantity: 2 }],
}

describe('OrderSchema', () => {
  it('accepts a persisted order with no scheduling yet', () => {
    const result = OrderSchema.safeParse({
      ...VALID_INPUT,
      id: '99999999-9999-4999-8999-999999999999',
      status: 'CRIADA',
      scheduling: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })
})

describe('OrderItemSchema', () => {
  it('accepts a positive integer quantity', () => {
    expect(OrderItemSchema.safeParse(VALID_INPUT.items[0]).success).toBe(true)
  })

  it('rejects a zero or negative quantity', () => {
    expect(OrderItemSchema.safeParse({ ...VALID_INPUT.items[0], quantity: 0 }).success).toBe(false)
  })
})

describe('CreateOrderInputSchema', () => {
  it('accepts a valid order with at least one item', () => {
    expect(CreateOrderInputSchema.safeParse(VALID_INPUT).success).toBe(true)
  })

  it('rejects an order with no items', () => {
    expect(CreateOrderInputSchema.safeParse({ ...VALID_INPUT, items: [] }).success).toBe(false)
  })

  it('rejects observations longer than 500 characters', () => {
    const result = CreateOrderInputSchema.safeParse({
      ...VALID_INPUT,
      observations: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('accepts an order without observations, since the field is optional', () => {
    expect(CreateOrderInputSchema.safeParse(VALID_INPUT).success).toBe(true)
  })
})
