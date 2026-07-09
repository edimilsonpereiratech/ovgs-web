import type { Client } from '@domain/entities/client'
import type { Order } from '@domain/entities/order'
import type { TransportType } from '@domain/entities/transport-type'
import { formatDateTime } from '@lib/date'
import { Button } from '@presentation/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface PendingSchedulingTableProps {
  orders: Order[]
  clientsById: Map<string, Client>
  transportTypesById: Map<string, TransportType>
  onSchedule: (order: Order) => void
}

export function PendingSchedulingTable({
  orders,
  clientsById,
  transportTypesById,
  onSchedule,
}: PendingSchedulingTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>Cliente</TableHeaderCell>
          <TableHeaderCell>Transporte</TableHeaderCell>
          <TableHeaderCell>Planejada em</TableHeaderCell>
          <TableHeaderCell />
        </tr>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {clientsById.get(order.clientId)?.name ?? order.clientId}
            </TableCell>
            <TableCell className="text-text-muted">
              {transportTypesById.get(order.transportTypeId)?.name ?? order.transportTypeId}
            </TableCell>
            <TableCell className="text-text-muted">{formatDateTime(order.updatedAt)}</TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                onClick={() => onSchedule(order)}
                trackingEvent="order.scheduling.open"
              >
                Confirmar agendamento
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
