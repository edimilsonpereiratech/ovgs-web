export async function enableMocking(): Promise<void> {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true') {
    return
  }

  const { worker } = await import('@infrastructure/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
