import { ArrowRight } from 'lucide-react'
import { AUDIT_ACTION_LABELS, type AuditLog } from '@domain/entities/audit-log'
import type { TransportType } from '@domain/entities/transport-type'
import { formatDateTime } from '@lib/date'
import { formatAuditState } from '@presentation/features/audit/lib/format-audit-state'

interface OrderTimelineProps {
  logs: AuditLog[]
  transportTypesById: Map<string, TransportType>
}

export function OrderTimeline({ logs, transportTypesById }: OrderTimelineProps) {
  const sorted = [...logs].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))

  return (
    <ol className="flex flex-col gap-4">
      {sorted.map((log, index) => (
        <li key={log.id} className="relative flex gap-3 pl-6">
          <span
            className={
              'absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ' +
              (index === 0 ? 'bg-primary' : 'bg-border')
            }
          />
          {index < sorted.length - 1 && (
            <span className="absolute left-[4px] top-4 h-full w-px bg-border" />
          )}
          <div>
            <p className="text-sm font-medium text-text">{AUDIT_ACTION_LABELS[log.action]}</p>
            <p className="mt-0.5 text-sm text-text-muted">
              {formatAuditState(log.action, log.previousState, transportTypesById)}
              <ArrowRight className="mx-1 inline h-3.5 w-3.5" />
              {formatAuditState(log.action, log.newState, transportTypesById)}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">{formatDateTime(log.occurredAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
