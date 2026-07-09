import type { Item } from '@domain/entities/item'
import type { OrderItem } from '@domain/entities/order'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface OrderItemsTableProps {
  orderItems: OrderItem[]
  itemsById: Map<string, Item>
}

export function OrderItemsTable({ orderItems, itemsById }: OrderItemsTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>SKU</TableHeaderCell>
          <TableHeaderCell>Item</TableHeaderCell>
          <TableHeaderCell>Quantidade</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        {orderItems.map((orderItem) => {
          const item = itemsById.get(orderItem.itemId)
          return (
            <TableRow key={orderItem.itemId}>
              <TableCell className="font-mono text-sm">{item?.sku ?? orderItem.itemId}</TableCell>
              <TableCell className="font-medium">{item?.name ?? '—'}</TableCell>
              <TableCell className="text-text-muted">{orderItem.quantity}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
