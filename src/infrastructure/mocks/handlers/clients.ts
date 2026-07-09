import { http, HttpResponse } from 'msw'
import type { CreateClientInput, UpdateClientInput } from '@domain/entities/client'
import { db } from '@infrastructure/mocks/db'

export const clientHandlers = [
  http.get('*/clients', () => HttpResponse.json(db.clients)),

  http.post('*/clients', async ({ request }) => {
    const body = (await request.json()) as CreateClientInput
    const client = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    }
    db.clients.push(client)
    return HttpResponse.json(client, { status: 201 })
  }),

  http.put('*/clients/:id', async ({ request, params }) => {
    const body = (await request.json()) as UpdateClientInput
    const index = db.clients.findIndex((client) => client.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Cliente não encontrado' }, { status: 404 })
    }

    db.clients[index] = { ...db.clients[index], ...body }
    return HttpResponse.json(db.clients[index])
  }),
]
