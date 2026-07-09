import type { OrderRepository } from '@application/ports/order.repository'
import { advanceOrderStatus } from '@application/orders/update-order-status.use-case'
import type { Order } from '@domain/entities/order'

function buildOrder(status: Order['status']): Order {
  return {
    id: 'order-1',
    clientId: 'client-1',
    transportTypeId: 'truck-1',
    items: [{ itemId: 'item-1', quantity: 1 }],
    status,
    scheduling: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function buildRepository(updated: Order): OrderRepository {
  return {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn().mockResolvedValue(updated),
    updateTransport: jest.fn(),
    confirmScheduling: jest.fn(),
    rescheduleScheduling: jest.fn(),
  }
}

describe('advanceOrderStatus use-case', () => {
  it('moves the order to the next status in the sequence', async () => {
    const order = buildOrder('CRIADA')
    const updated = buildOrder('PLANEJADA')
    const repository = buildRepository(updated)

    const result = await advanceOrderStatus(repository, order)

    expect(repository.updateStatus).toHaveBeenCalledWith('order-1', 'PLANEJADA')
    expect(result).toBe(updated)
  })

  it('refuses to advance an order that is already in the terminal status', async () => {
    const order = buildOrder('ENTREGUE')
    const repository = buildRepository(order)

    await expect(advanceOrderStatus(repository, order)).rejects.toThrow('já está no status final')
    expect(repository.updateStatus).not.toHaveBeenCalled()
  })
})
