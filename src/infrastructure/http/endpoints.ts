export const ENDPOINTS = {
  clients: '/clients',
  client: (id: string) => `/clients/${id}`,
  transportTypes: '/transport-types',
  transportType: (id: string) => `/transport-types/${id}`,
  items: '/items',
  orders: '/orders',
  order: (id: string) => `/orders/${id}`,
  orderStatus: (id: string) => `/orders/${id}/status`,
  orderTransport: (id: string) => `/orders/${id}/transport`,
  orderScheduling: (id: string) => `/orders/${id}/scheduling`,
  orderReschedule: (id: string) => `/orders/${id}/scheduling/reschedule`,
  auditLogs: '/audit-logs',
} as const
