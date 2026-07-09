import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@infrastructure/mocks/server'
import { NewOrderPage } from '@presentation/features/orders/containers/new-order-page'
import { renderWithProviders } from '@presentation/test-utils/render-with-providers'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  push.mockClear()
})
afterAll(() => server.close())

describe('NewOrderPage (integration)', () => {
  it('creates an order with the pre-filled defaults and redirects to its detail page', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewOrderPage />)

    expect(await screen.findByText('Acme Indústria Ltda.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /criar ordem de venda/i }))

    await waitFor(() => expect(push).toHaveBeenCalledTimes(1))
    expect(push.mock.calls[0][0]).toMatch(/^\/ordens\/[0-9a-f-]+$/)
  })

  it('narrows the transport options to only what the selected client is authorized to use', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewOrderPage />)

    await screen.findByText('Acme Indústria Ltda.')
    const transportSelect = screen.getByLabelText(/tipo de transporte/i)
    expect(transportSelect).not.toHaveTextContent('Bi-truck')

    await user.selectOptions(screen.getByLabelText(/^cliente$/i), 'Transportes União Ltda.')

    await waitFor(() => expect(transportSelect).toHaveTextContent('Bi-truck'))
    expect(transportSelect).not.toHaveTextContent('Van')
  })
})
