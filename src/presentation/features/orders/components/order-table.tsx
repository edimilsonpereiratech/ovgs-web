import Link from 'next/link'
import type { Client } from '@domain/entities/client'
import type { Order } from '@domain/entities/order'
import type { TransportType } from '@domain/entities/transport-type'
import { formatDateTime } from '@lib/date'
import { StatusBadge } from '@presentation/shared/components/status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface OrderTableProps {
  orders: Order[]
  clientsById: Map<string, Client>
  transportTypesById: Map<string, TransportType>
}

export function OrderTable({ orders, clientsById, transportTypesById }: OrderTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>Cliente</TableHeaderCell>
          <TableHeaderCell>Transporte</TableHeaderCell>
          <TableHeaderCell>Itens</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Criada em</TableHeaderCell>
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
            <TableCell className="text-text-muted">{order.items.length}</TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-text-muted">{formatDateTime(order.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Link href={`/ordens/${order.id}`} className="text-sm font-medium text-primary hover:underline">
                Ver detalhes
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
