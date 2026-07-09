import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@infrastructure/mocks/server'
import { TransportTypesPage } from '@presentation/features/transport-types/containers/transport-types-page'
import { renderWithProviders } from '@presentation/test-utils/render-with-providers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TransportTypesPage (integration)', () => {
  it('lists the seeded transport types fetched from the API', async () => {
    renderWithProviders(<TransportTypesPage />)

    expect(await screen.findByText('Caminhão')).toBeInTheDocument()
    expect(screen.getByText('Carreta')).toBeInTheDocument()
  })

  it('creates a new transport type through the drawer form and shows it in the table', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TransportTypesPage />)

    await screen.findByText('Caminhão')

    await user.click(screen.getByRole('button', { name: /novo tipo/i }))
    await user.type(screen.getByLabelText(/nome/i), 'Drone de entrega')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(screen.getByText('Drone de entrega')).toBeInTheDocument())
  })
})
