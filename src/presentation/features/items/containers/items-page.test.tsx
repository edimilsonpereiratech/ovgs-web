import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '@infrastructure/mocks/server'
import { ItemsPage } from '@presentation/features/items/containers/items-page'
import { renderWithProviders } from '@presentation/test-utils/render-with-providers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ItemsPage (integration)', () => {
  it('lists the seeded catalog items fetched from the API', async () => {
    renderWithProviders(<ItemsPage />)

    expect(await screen.findByText('Cimento CP-II 50kg')).toBeInTheDocument()
  })

  it('creates a new item through the drawer form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ItemsPage />)

    await screen.findByText('Cimento CP-II 50kg')

    await user.click(screen.getByRole('button', { name: /novo item/i }))
    await user.type(screen.getByLabelText(/sku/i), 'SKU-9999')
    await user.type(screen.getByLabelText(/nome/i), 'Escora metálica')
    await user.click(screen.getByRole('button', { name: /adicionar item/i }))

    await waitFor(() => expect(screen.getByText('Escora metálica')).toBeInTheDocument())
  })

  it('rejects a SKU that already exists in the catalog', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ItemsPage />)

    await screen.findByText('Cimento CP-II 50kg')

    await user.click(screen.getByRole('button', { name: /novo item/i }))
    await user.type(screen.getByLabelText(/sku/i), 'SKU-1000')
    await user.type(screen.getByLabelText(/nome/i), 'Duplicata proposital')
    await user.click(screen.getByRole('button', { name: /adicionar item/i }))

    expect(await screen.findByText(/já existe um item cadastrado com o sku/i)).toBeInTheDocument()
    expect(screen.queryByText('Duplicata proposital')).not.toBeInTheDocument()
  })
})
