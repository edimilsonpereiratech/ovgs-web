import type { OrderRepository } from '@application/ports/order.repository'
import { createOrder } from '@application/orders/create-order.use-case'
import type { Client } from '@domain/entities/client'
import type { CreateOrderInput, Order } from '@domain/entities/order'
import { TransportNotAuthorizedError } from '@domain/errors/transport-not-authorized.error'

function buildClient(authorizedTransportTypeIds: string[]): Client {
  return {
    id: 'client-1',
    name: 'Cliente Teste',
    document: '12345678900',
    authorizedTransportTypeIds,
    createdAt: new Date().toISOString(),
  }
}

function buildRepository(order: Order): OrderRepository {
  return {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn().mockResolvedValue(order),
    updateStatus: jest.fn(),
    updateTransport: jest.fn(),
    confirmScheduling: jest.fn(),
    rescheduleScheduling: jest.fn(),
  }
}

const input: CreateOrderInput = {
  clientId: 'client-1',
  transportTypeId: 'truck-1',
  items: [{ itemId: 'item-1', quantity: 2 }],
}

describe('createOrder use-case', () => {
  it('delegates to the repository when the transport is authorized for the client', async () => {
    const client = buildClient(['truck-1'])
    const createdOrder = { id: 'order-1' } as Order
    const repository = buildRepository(createdOrder)

    const result = await createOrder(repository, client, input)

    expect(repository.create).toHaveBeenCalledWith(input)
    expect(result).toBe(createdOrder)
  })

  it('rejects the order before hitting the repository when transport is not authorized', async () => {
    const client = buildClient(['truck-2'])
    const repository = buildRepository({} as Order)

    await expect(createOrder(repository, client, input)).rejects.toThrow(
      TransportNotAuthorizedError,
    )
    expect(repository.create).not.toHaveBeenCalled()
  })
})
