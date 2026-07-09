import { http, HttpResponse } from 'msw'
import type { CreateItemInput } from '@domain/entities/item'
import { db } from '@infrastructure/mocks/db'

export const itemHandlers = [
  http.get('*/items', () => HttpResponse.json(db.items)),

  http.post('*/items', async ({ request }) => {
    const body = (await request.json()) as CreateItemInput
    const duplicate = db.items.some((item) => item.sku === body.sku)

    if (duplicate) {
      return HttpResponse.json(
        {
          code: 'DUPLICATE_SKU',
          message: `Já existe um item cadastrado com o SKU ${body.sku}`,
          meta: { sku: body.sku },
        },
        { status: 409 },
      )
    }

    const item = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    }
    db.items.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),
]
