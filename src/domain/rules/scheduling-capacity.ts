export const MAX_DELIVERIES_PER_WINDOW = 3

export function isSchedulingCapacityExceeded(currentCount: number): boolean {
  return currentCount >= MAX_DELIVERIES_PER_WINDOW
}
