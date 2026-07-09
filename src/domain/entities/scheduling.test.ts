import { CreateSchedulingInputSchema } from '@domain/entities/scheduling'

const VALID_INPUT = {
  deliveryDate: '2026-08-01',
  timeWindow: { start: '08:00', end: '10:00' },
}

describe('CreateSchedulingInputSchema', () => {
  it('accepts a delivery date in YYYY-MM-DD format with a valid time window', () => {
    expect(CreateSchedulingInputSchema.safeParse(VALID_INPUT).success).toBe(true)
  })

  it('rejects a delivery date that is not in YYYY-MM-DD format', () => {
    expect(
      CreateSchedulingInputSchema.safeParse({ ...VALID_INPUT, deliveryDate: '01/08/2026' }).success,
    ).toBe(false)
  })

  it('rejects a time window with a malformed time', () => {
    expect(
      CreateSchedulingInputSchema.safeParse({
        ...VALID_INPUT,
        timeWindow: { start: '8am', end: '10:00' },
      }).success,
    ).toBe(false)
  })
})
