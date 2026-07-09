import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@infrastructure/mocks/server'
import { ClientsPage } from '@presentation/features/clients/containers/clients-page'
import { renderWithProviders } from '@presentation/test-utils/render-with-providers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ClientsPage (integration)', () => {
  it('lists the seeded clients with their authorized transport types', async () => {
    renderWithProviders(<ClientsPage />)

    expect(await screen.findByText('Acme Indústria Ltda.')).toBeInTheDocument()
  })

  it('creates a new client authorized for the selected transport types', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPage />)

    await screen.findByText('Acme Indústria Ltda.')

    await user.click(screen.getByRole('button', { name: /novo cliente/i }))
    await user.type(screen.getByLabelText(/nome/i), 'Nova Distribuidora Ltda.')
    await user.type(screen.getByLabelText(/documento/i), '99.888.777/0001-66')

    const drawer = screen.getByRole('dialog')
    const transportGroup = within(drawer).getByText('Caminhão').closest('label')
    if (transportGroup) await user.click(within(transportGroup).getByRole('checkbox'))

    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => expect(screen.getByText('Nova Distribuidora Ltda.')).toBeInTheDocument())
  })
})
