import type { Client } from '@domain/entities/client'
import type { TransportType } from '@domain/entities/transport-type'
import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_CONFIG } from '@domain/value-objects/order-status'
import type { OrderStatus } from '@domain/value-objects/order-status'
import { Button } from '@presentation/shared/components/ui/button'
import { Input } from '@presentation/shared/components/ui/input'
import { Select } from '@presentation/shared/components/ui/select'

export interface OrderFiltersValue {
  status: OrderStatus | ''
  clientId: string
  transportTypeId: string
  dateFrom: string
  dateTo: string
}

export const EMPTY_ORDER_FILTERS: OrderFiltersValue = {
  status: '',
  clientId: '',
  transportTypeId: '',
  dateFrom: '',
  dateTo: '',
}

interface OrderFiltersProps {
  value: OrderFiltersValue
  clients: Client[]
  transportTypes: TransportType[]
  onChange: (value: OrderFiltersValue) => void
}

export function OrderFilters({ value, clients, transportTypes, onChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        label="Status"
        value={value.status}
        onChange={(event) => onChange({ ...value, status: event.target.value as OrderStatus | '' })}
      >
        <option value="">Todos</option>
        {ORDER_STATUS_SEQUENCE.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_CONFIG[status].label}
          </option>
        ))}
      </Select>
      <Select
        label="Cliente"
        value={value.clientId}
        onChange={(event) => onChange({ ...value, clientId: event.target.value })}
      >
        <option value="">Todos</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </Select>
      <Select
        label="Transporte"
        value={value.transportTypeId}
        onChange={(event) => onChange({ ...value, transportTypeId: event.target.value })}
      >
        <option value="">Todos</option>
        {transportTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </Select>
      <Input
        label="De"
        type="date"
        value={value.dateFrom}
        onChange={(event) => onChange({ ...value, dateFrom: event.target.value })}
      />
      <Input
        label="Até"
        type="date"
        value={value.dateTo}
        onChange={(event) => onChange({ ...value, dateTo: event.target.value })}
      />
      <Button variant="secondary" size="md" onClick={() => onChange({ ...EMPTY_ORDER_FILTERS })}>
        Limpar filtros
      </Button>
    </div>
  )
}
