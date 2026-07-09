import { http, HttpResponse } from 'msw'
import type {
  CreateTransportTypeInput,
  UpdateTransportTypeInput,
} from '@domain/entities/transport-type'
import { db } from '@infrastructure/mocks/db'

export const transportTypeHandlers = [
  http.get('*/transport-types', () => HttpResponse.json(db.transportTypes)),

  http.post('*/transport-types', async ({ request }) => {
    const body = (await request.json()) as CreateTransportTypeInput
    const transportType = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    }
    db.transportTypes.push(transportType)
    return HttpResponse.json(transportType, { status: 201 })
  }),

  http.put('*/transport-types/:id', async ({ request, params }) => {
    const body = (await request.json()) as UpdateTransportTypeInput
    const index = db.transportTypes.findIndex((type) => type.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Tipo de transporte não encontrado' }, { status: 404 })
    }

    db.transportTypes[index] = { ...db.transportTypes[index], ...body }
    return HttpResponse.json(db.transportTypes[index])
  }),
]
