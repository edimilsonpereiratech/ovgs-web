import type { Item } from '@domain/entities/item'
import { formatDate } from '@lib/date'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface ItemTableProps {
  items: Item[]
}

export function ItemTable({ items }: ItemTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>SKU</TableHeaderCell>
          <TableHeaderCell>Nome</TableHeaderCell>
          <TableHeaderCell>Criado em</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-text-muted">{formatDate(item.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
