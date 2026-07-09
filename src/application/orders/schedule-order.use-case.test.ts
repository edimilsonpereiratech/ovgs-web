import type { OrderRepository } from '@application/ports/order.repository'
import {
  confirmScheduling,
  rescheduleScheduling,
} from '@application/orders/schedule-order.use-case'
import type { Order } from '@domain/entities/order'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'
import { SchedulingNotAllowedError } from '@domain/errors/scheduling-not-allowed.error'

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
    updateStatus: jest.fn(),
    updateTransport: jest.fn(),
    confirmScheduling: jest.fn().mockResolvedValue(updated),
    rescheduleScheduling: jest.fn().mockResolvedValue(updated),
  }
}

const input: CreateSchedulingInput = {
  deliveryDate: '2026-08-01',
  timeWindow: { start: '08:00', end: '10:00' },
}

describe('confirmScheduling use-case', () => {
  it('confirms scheduling for an order awaiting planning', async () => {
    const order = buildOrder('PLANEJADA')
    const updated = buildOrder('AGENDADA')
    const repository = buildRepository(updated)

    const result = await confirmScheduling(repository, order, input)

    expect(repository.confirmScheduling).toHaveBeenCalledWith('order-1', input)
    expect(result).toBe(updated)
  })

  it('refuses to confirm scheduling for an order in any other status', async () => {
    const order = buildOrder('CRIADA')
    const repository = buildRepository(order)

    await expect(confirmScheduling(repository, order, input)).rejects.toThrow(
      SchedulingNotAllowedError,
    )
    expect(repository.confirmScheduling).not.toHaveBeenCalled()
  })
})

describe('rescheduleScheduling use-case', () => {
  it('reschedules an order that is already scheduled', async () => {
    const order = buildOrder('AGENDADA')
    const updated = buildOrder('AGENDADA')
    const repository = buildRepository(updated)

    const result = await rescheduleScheduling(repository, order, input)

    expect(repository.rescheduleScheduling).toHaveBeenCalledWith('order-1', input)
    expect(result).toBe(updated)
  })

  it('refuses to reschedule an order that was never confirmed', async () => {
    const order = buildOrder('PLANEJADA')
    const repository = buildRepository(order)

    await expect(rescheduleScheduling(repository, order, input)).rejects.toThrow(
      SchedulingNotAllowedError,
    )
    expect(repository.rescheduleScheduling).not.toHaveBeenCalled()
  })
})
