import { http, HttpResponse } from 'msw'
import type { CreateOrderInput } from '@domain/entities/order'
import type { CreateSchedulingInput } from '@domain/entities/scheduling'
import { VALID_TRANSITIONS, type OrderStatus } from '@domain/value-objects/order-status'
import { db } from '@infrastructure/mocks/db'

function paginate(request: Request) {
  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const clientId = url.searchParams.get('clientId')
  const transportTypeId = url.searchParams.get('transportTypeId')
  const dateFrom = url.searchParams.get('dateFrom')
  const dateTo = url.searchParams.get('dateTo')
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 10)

  let filtered = db.orders
  if (status) filtered = filtered.filter((order) => order.status === status)
  if (clientId) filtered = filtered.filter((order) => order.clientId === clientId)
  if (transportTypeId)
    filtered = filtered.filter((order) => order.transportTypeId === transportTypeId)
  if (dateFrom) filtered = filtered.filter((order) => order.createdAt.slice(0, 10) >= dateFrom)
  if (dateTo) filtered = filtered.filter((order) => order.createdAt.slice(0, 10) <= dateTo)

  const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  const start = (page - 1) * pageSize

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  }
}

export const orderHandlers = [
  http.get('*/orders', ({ request }) => HttpResponse.json(paginate(request))),

  http.get('*/orders/:id', ({ params }) => {
    const order = db.orders.find((item) => item.id === params.id)
    if (!order) return HttpResponse.json({ message: 'Ordem não encontrada' }, { status: 404 })
    return HttpResponse.json(order)
  }),

  http.post('*/orders', async ({ request }) => {
    const body = (await request.json()) as CreateOrderInput
    const client = db.clients.find((item) => item.id === body.clientId)

    if (!client?.authorizedTransportTypeIds.includes(body.transportTypeId)) {
      return HttpResponse.json(
        {
          code: 'TRANSPORT_NOT_AUTHORIZED',
          message: 'O tipo de transporte informado não está autorizado para este cliente',
          meta: { clientId: body.clientId, transportTypeId: body.transportTypeId },
        },
        { status: 422 },
      )
    }

    const now = new Date().toISOString()
    const order = {
      id: crypto.randomUUID(),
      clientId: body.clientId,
      transportTypeId: body.transportTypeId,
      items: body.items,
      observations: body.observations,
      status: 'CRIADA' as const,
      scheduling: null,
      createdAt: now,
      updatedAt: now,
    }

    db.orders.unshift(order)
    db.auditLogs.push({
      id: crypto.randomUUID(),
      orderId: order.id,
      action: 'ORDER_CREATED',
      previousState: null,
      newState: 'CRIADA',
      occurredAt: now,
    })

    return HttpResponse.json(order, { status: 201 })
  }),

  http.patch('*/orders/:id/status', async ({ request, params }) => {
    const { status: nextStatus } = (await request.json()) as { status: OrderStatus }
    const order = db.orders.find((item) => item.id === params.id)
    if (!order) return HttpResponse.json({ message: 'Ordem não encontrada' }, { status: 404 })

    if (VALID_TRANSITIONS[order.status] !== nextStatus) {
      return HttpResponse.json(
        {
          code: 'INVALID_TRANSITION',
          message: `Não é possível mudar o status de ${order.status} para ${nextStatus}`,
          meta: { from: order.status, to: nextStatus },
        },
        { status: 422 },
      )
    }

    const previous = order.status
    order.status = nextStatus
    order.updatedAt = new Date().toISOString()

    db.auditLogs.push({
      id: crypto.randomUUID(),
      orderId: order.id,
      action: 'STATUS_CHANGED',
      previousState: previous,
      newState: nextStatus,
      occurredAt: order.updatedAt,
    })

    return HttpResponse.json(order)
  }),

  http.patch('*/orders/:id/transport', async ({ request, params }) => {
    const { transportTypeId } = (await request.json()) as { transportTypeId: string }
    const order = db.orders.find((item) => item.id === params.id)
    if (!order) return HttpResponse.json({ message: 'Ordem não encontrada' }, { status: 404 })

    if (order.status !== 'CRIADA') {
      return HttpResponse.json(
        {
          code: 'TRANSPORT_CHANGE_NOT_ALLOWED',
          message: 'Só é possível alterar o transporte enquanto a ordem estiver CRIADA',
        },
        { status: 422 },
      )
    }

    const client = db.clients.find((item) => item.id === order.clientId)
    if (!client?.authorizedTransportTypeIds.includes(transportTypeId)) {
      return HttpResponse.json(
        {
          code: 'TRANSPORT_NOT_AUTHORIZED',
          message: 'O tipo de transporte informado não está autorizado para este cliente',
          meta: { clientId: order.clientId, transportTypeId },
        },
        { status: 422 },
      )
    }

    const previous = order.transportTypeId
    order.transportTypeId = transportTypeId
    order.updatedAt = new Date().toISOString()

    db.auditLogs.push({
      id: crypto.randomUUID(),
      orderId: order.id,
      action: 'TRANSPORT_CHANGED',
      previousState: previous,
      newState: transportTypeId,
      occurredAt: order.updatedAt,
    })

    return HttpResponse.json(order)
  }),

  http.post('*/orders/:id/scheduling', async ({ request, params }) => {
    const body = (await request.json()) as CreateSchedulingInput
    const order = db.orders.find((item) => item.id === params.id)
    if (!order) return HttpResponse.json({ message: 'Ordem não encontrada' }, { status: 404 })

    if (order.status !== 'PLANEJADA') {
      return HttpResponse.json(
        {
          code: 'SCHEDULING_NOT_ALLOWED',
          message: `Agendamento não é permitido para uma ordem com status ${order.status}`,
          meta: { currentStatus: order.status },
        },
        { status: 422 },
      )
    }

    const now = new Date().toISOString()
    order.scheduling = {
      orderId: order.id,
      deliveryDate: body.deliveryDate,
      timeWindow: body.timeWindow,
      confirmedAt: now,
      rescheduledFrom: null,
    }
    order.status = 'AGENDADA'
    order.updatedAt = now

    db.auditLogs.push(
      {
        id: crypto.randomUUID(),
        orderId: order.id,
        action: 'SCHEDULING_CHANGED',
        previousState: null,
        newState: `${body.deliveryDate} (${body.timeWindow.start}-${body.timeWindow.end})`,
        occurredAt: now,
      },
      {
        id: crypto.randomUUID(),
        orderId: order.id,
        action: 'STATUS_CHANGED',
        previousState: 'PLANEJADA',
        newState: 'AGENDADA',
        occurredAt: now,
      },
    )

    return HttpResponse.json(order)
  }),

  http.patch('*/orders/:id/scheduling/reschedule', async ({ request, params }) => {
    const body = (await request.json()) as CreateSchedulingInput
    const order = db.orders.find((item) => item.id === params.id)
    if (!order) return HttpResponse.json({ message: 'Ordem não encontrada' }, { status: 404 })

    if (order.status !== 'AGENDADA') {
      return HttpResponse.json(
        {
          code: 'SCHEDULING_NOT_ALLOWED',
          message: `Agendamento não é permitido para uma ordem com status ${order.status}`,
          meta: { currentStatus: order.status },
        },
        { status: 422 },
      )
    }

    const now = new Date().toISOString()
    const previousDate = order.scheduling?.deliveryDate ?? null

    order.scheduling = {
      orderId: order.id,
      deliveryDate: body.deliveryDate,
      timeWindow: body.timeWindow,
      confirmedAt: now,
      rescheduledFrom: previousDate,
    }
    order.updatedAt = now

    db.auditLogs.push({
      id: crypto.randomUUID(),
      orderId: order.id,
      action: 'SCHEDULING_CHANGED',
      previousState: previousDate,
      newState: `${body.deliveryDate} (${body.timeWindow.start}-${body.timeWindow.end})`,
      occurredAt: now,
    })

    return HttpResponse.json(order)
  }),
]
