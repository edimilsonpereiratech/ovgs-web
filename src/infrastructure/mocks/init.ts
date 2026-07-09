let mockingPromise: Promise<void> | null = null

export function enableMocking(): Promise<void> {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true') {
    return Promise.resolve()
  }

  if (!mockingPromise) {
    mockingPromise = import('@infrastructure/mocks/browser').then(async ({ worker }) => {
      await worker.start({ onUnhandledRequest: 'bypass' })
    })
  }

  return mockingPromise
}
