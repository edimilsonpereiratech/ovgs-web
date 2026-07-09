import {
  MAX_DELIVERIES_PER_WINDOW,
  isSchedulingCapacityExceeded,
} from '@domain/rules/scheduling-capacity'

describe('scheduling-capacity', () => {
  it('is not exceeded below the configured maximum', () => {
    expect(isSchedulingCapacityExceeded(MAX_DELIVERIES_PER_WINDOW - 1)).toBe(false)
  })

  it('is exceeded once the count reaches the configured maximum', () => {
    expect(isSchedulingCapacityExceeded(MAX_DELIVERIES_PER_WINDOW)).toBe(true)
  })

  it('is exceeded beyond the configured maximum', () => {
    expect(isSchedulingCapacityExceeded(MAX_DELIVERIES_PER_WINDOW + 5)).toBe(true)
  })
})
