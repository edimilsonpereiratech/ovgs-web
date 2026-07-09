import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from '@presentation/shared/components/toast-container'
import { createStore } from '@store/create-store'

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const store = createStore()

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {ui}
        <ToastContainer />
      </Provider>
    </QueryClientProvider>,
  )
}
