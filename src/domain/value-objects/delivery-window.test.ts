import {
  DeliveryWindowSchema,
  formatDeliveryWindow,
  STANDARD_DELIVERY_WINDOWS,
} from '@domain/value-objects/delivery-window'

describe('DeliveryWindowSchema', () => {
  it('accepts a window with HH:mm start and end', () => {
    expect(DeliveryWindowSchema.safeParse({ start: '08:00', end: '10:00' }).success).toBe(true)
  })

  it('rejects a window with a malformed time', () => {
    expect(DeliveryWindowSchema.safeParse({ start: '8h', end: '10:00' }).success).toBe(false)
  })
})

describe('formatDeliveryWindow', () => {
  it('renders the window as "start - end"', () => {
    expect(formatDeliveryWindow(STANDARD_DELIVERY_WINDOWS[0])).toBe('08:00 - 10:00')
  })
})
