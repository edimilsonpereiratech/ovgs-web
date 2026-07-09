import { ENDPOINTS } from '@infrastructure/http/endpoints'

describe('ENDPOINTS', () => {
  it('exposes static paths for collection resources', () => {
    expect(ENDPOINTS.clients).toBe('/clients')
    expect(ENDPOINTS.transportTypes).toBe('/transport-types')
    expect(ENDPOINTS.items).toBe('/items')
    expect(ENDPOINTS.orders).toBe('/orders')
    expect(ENDPOINTS.auditLogs).toBe('/audit-logs')
  })

  it('builds id-scoped paths for a single resource', () => {
    expect(ENDPOINTS.client('client-1')).toBe('/clients/client-1')
    expect(ENDPOINTS.transportType('transport-1')).toBe('/transport-types/transport-1')
    expect(ENDPOINTS.order('order-1')).toBe('/orders/order-1')
  })

  it('builds nested paths for order sub-resources', () => {
    expect(ENDPOINTS.orderStatus('order-1')).toBe('/orders/order-1/status')
    expect(ENDPOINTS.orderTransport('order-1')).toBe('/orders/order-1/transport')
    expect(ENDPOINTS.orderScheduling('order-1')).toBe('/orders/order-1/scheduling')
    expect(ENDPOINTS.orderReschedule('order-1')).toBe('/orders/order-1/scheduling/reschedule')
  })
})
