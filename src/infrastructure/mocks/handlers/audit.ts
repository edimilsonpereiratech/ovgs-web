import { http, HttpResponse } from 'msw'
import { db } from '@infrastructure/mocks/db'

export const auditHandlers = [
  http.get('*/audit-logs', ({ request }) => {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId')
    const action = url.searchParams.get('action')
    const dateFrom = url.searchParams.get('dateFrom')
    const dateTo = url.searchParams.get('dateTo')

    let filtered = db.auditLogs
    if (orderId) filtered = filtered.filter((log) => log.orderId === orderId)
    if (action) filtered = filtered.filter((log) => log.action === action)
    if (dateFrom) filtered = filtered.filter((log) => log.occurredAt.slice(0, 10) >= dateFrom)
    if (dateTo) filtered = filtered.filter((log) => log.occurredAt.slice(0, 10) <= dateTo)

    const sorted = [...filtered].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
    return HttpResponse.json(sorted)
  }),
]
