import type { TransportType } from '@domain/entities/transport-type'
import { formatDate } from '@lib/date'
import { Button } from '@presentation/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface TransportTypeTableProps {
  transportTypes: TransportType[]
  onEdit: (transportType: TransportType) => void
}

export function TransportTypeTable({ transportTypes, onEdit }: TransportTypeTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>Nome</TableHeaderCell>
          <TableHeaderCell>Criado em</TableHeaderCell>
          <TableHeaderCell />
        </tr>
      </TableHead>
      <TableBody>
        {transportTypes.map((transportType) => (
          <TableRow key={transportType.id}>
            <TableCell className="font-medium">{transportType.name}</TableCell>
            <TableCell className="text-text-muted">{formatDate(transportType.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onEdit(transportType)}>
                Editar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
