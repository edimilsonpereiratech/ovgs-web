import { CreateItemInputSchema, ItemSchema } from '@domain/entities/item'

describe('ItemSchema', () => {
  it('accepts a persisted item with id and createdAt', () => {
    const result = ItemSchema.safeParse({
      id: '99999999-9999-4999-8999-999999999999',
      sku: 'SKU-0001',
      name: 'Cimento',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })
})

describe('CreateItemInputSchema', () => {
  it('accepts an item with a valid SKU and name', () => {
    expect(CreateItemInputSchema.safeParse({ sku: 'SKU-0001', name: 'Cimento' }).success).toBe(true)
  })

  it('rejects a SKU shorter than 3 characters', () => {
    expect(CreateItemInputSchema.safeParse({ sku: 'AB', name: 'Cimento' }).success).toBe(false)
  })

  it('rejects a name shorter than 2 characters', () => {
    expect(CreateItemInputSchema.safeParse({ sku: 'SKU-0001', name: 'C' }).success).toBe(false)
  })
})
