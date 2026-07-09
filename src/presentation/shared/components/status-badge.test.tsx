import { render, screen } from '@testing-library/react'
import { ORDER_STATUS_CONFIG, ORDER_STATUS_SEQUENCE } from '@domain/value-objects/order-status'
import { StatusBadge } from '@presentation/shared/components/status-badge'

describe('StatusBadge', () => {
  it.each(ORDER_STATUS_SEQUENCE)('renders the localized label for %s', (status) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(ORDER_STATUS_CONFIG[status].label)).toBeInTheDocument()
  })
})
