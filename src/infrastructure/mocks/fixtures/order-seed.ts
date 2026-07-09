import { addDays, subDays } from 'date-fns'
import type { AuditLog } from '@domain/entities/audit-log'
import type { Order, OrderItem } from '@domain/entities/order'
import { STANDARD_DELIVERY_WINDOWS } from '@domain/value-objects/delivery-window'
import { ORDER_STATUS_SEQUENCE, type OrderStatus } from '@domain/value-objects/order-status'
import { clients } from '@infrastructure/mocks/fixtures/clients'
import { items } from '@infrastructure/mocks/fixtures/items'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(list: T[]): T {
  return list[randomInt(0, list.length - 1)]
}

function clampToNow(date: Date): Date {
  const now = new Date()
  return date > now ? now : date
}

function pickItems(): OrderItem[] {
  const count = randomInt(1, 4)
  const chosen = new Set<string>()
  while (chosen.size < count) {
    chosen.add(pick(items).id)
  }
  return Array.from(chosen).map((itemId) => ({ itemId, quantity: randomInt(1, 20) }))
}

const STATUS_DISTRIBUTION: OrderStatus[] = [
  ...Array(10).fill('CRIADA'),
  ...Array(8).fill('PLANEJADA'),
  ...Array(10).fill('AGENDADA'),
  ...Array(8).fill('EM_TRANSPORTE'),
  ...Array(14).fill('ENTREGUE'),
]

function buildOrder(targetStatus: OrderStatus): { order: Order; logs: AuditLog[] } {
  const client = pick(clients)
  const transportTypeId = pick(client.authorizedTransportTypeIds)
  const orderId = crypto.randomUUID()

  const createdAt = subDays(new Date(), randomInt(1, 60))
  const logs: AuditLog[] = []
  let cursor = createdAt

  logs.push({
    id: crypto.randomUUID(),
    orderId,
    action: 'ORDER_CREATED',
    previousState: null,
    newState: 'CRIADA',
    occurredAt: cursor.toISOString(),
  })

  const targetIndex = ORDER_STATUS_SEQUENCE.indexOf(targetStatus)
  let scheduling: Order['scheduling'] = null

  for (let step = 1; step <= targetIndex; step++) {
    cursor = clampToNow(addDays(cursor, randomInt(1, 3)))
    const previous = ORDER_STATUS_SEQUENCE[step - 1]
    const next = ORDER_STATUS_SEQUENCE[step]

    logs.push({
      id: crypto.randomUUID(),
      orderId,
      action: 'STATUS_CHANGED',
      previousState: previous,
      newState: next,
      occurredAt: cursor.toISOString(),
    })

    if (next === 'AGENDADA') {
      const deliveryDate = addDays(cursor, randomInt(1, 5))
      scheduling = {
        orderId,
        deliveryDate: deliveryDate.toISOString().slice(0, 10),
        timeWindow: pick(STANDARD_DELIVERY_WINDOWS),
        confirmedAt: cursor.toISOString(),
        rescheduledFrom: null,
      }

      logs.push({
        id: crypto.randomUUID(),
        orderId,
        action: 'SCHEDULING_CHANGED',
        previousState: null,
        newState: `${scheduling.deliveryDate} (${scheduling.timeWindow.start}-${scheduling.timeWindow.end})`,
        occurredAt: cursor.toISOString(),
      })
    }
  }

  const updatedAt = logs[logs.length - 1].occurredAt

  const order: Order = {
    id: orderId,
    clientId: client.id,
    transportTypeId,
    items: pickItems(),
    status: targetStatus,
    scheduling,
    createdAt: createdAt.toISOString(),
    updatedAt,
  }

  return { order, logs }
}

const seed = STATUS_DISTRIBUTION.map(buildOrder)

export const orders: Order[] = seed.map((entry) => entry.order)
export const auditLogs: AuditLog[] = seed.flatMap((entry) => entry.logs)
