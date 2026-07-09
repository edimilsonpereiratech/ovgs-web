import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AUDIT_ACTION_LABELS, type AuditLog } from '@domain/entities/audit-log'
import type { TransportType } from '@domain/entities/transport-type'
import { formatDateTime } from '@lib/date'
import { formatAuditState } from '@presentation/features/audit/lib/format-audit-state'
import { Badge } from '@presentation/shared/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@presentation/shared/components/ui/table'

interface AuditTableProps {
  logs: AuditLog[]
  transportTypesById: Map<string, TransportType>
}

export function AuditTable({ logs, transportTypesById }: AuditTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>Ordem</TableHeaderCell>
          <TableHeaderCell>Ação</TableHeaderCell>
          <TableHeaderCell>Alteração</TableHeaderCell>
          <TableHeaderCell>Ocorrido em</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <Link
                href={`/ordens/${log.orderId}`}
                className="font-mono text-sm text-primary hover:underline"
              >
                #{log.orderId.slice(0, 8)}
              </Link>
            </TableCell>
            <TableCell>
              <Badge color="neutral">{AUDIT_ACTION_LABELS[log.action]}</Badge>
            </TableCell>
            <TableCell className="text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                {formatAuditState(log.action, log.previousState, transportTypesById)}
                <ArrowRight className="h-3.5 w-3.5" />
                <span className="text-text">
                  {formatAuditState(log.action, log.newState, transportTypesById)}
                </span>
              </span>
            </TableCell>
            <TableCell className="text-text-muted">{formatDateTime(log.occurredAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
