import type { Client } from '@domain/entities/client'
import type { TransportType } from '@domain/entities/transport-type'
import { Badge } from '@presentation/shared/components/ui/badge'
import { Button } from '@presentation/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface ClientTableProps {
  clients: Client[]
  transportTypesById: Map<string, TransportType>
  onEdit: (client: Client) => void
}

export function ClientTable({ clients, transportTypesById, onEdit }: ClientTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>Nome</TableHeaderCell>
          <TableHeaderCell>Documento</TableHeaderCell>
          <TableHeaderCell>Transportes autorizados</TableHeaderCell>
          <TableHeaderCell />
        </tr>
      </TableHead>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell className="text-text-muted">{client.document}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1.5">
                {client.authorizedTransportTypeIds.map((id) => (
                  <Badge key={id} color="neutral">
                    {transportTypesById.get(id)?.name ?? id}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onEdit(client)}>
                Editar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
