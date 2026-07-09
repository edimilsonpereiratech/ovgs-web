import { AUDIT_ACTION_LABELS, type AuditAction } from '@domain/entities/audit-log'
import { Button } from '@presentation/shared/components/ui/button'
import { Input } from '@presentation/shared/components/ui/input'
import { Select } from '@presentation/shared/components/ui/select'

export interface AuditFiltersValue {
  action: AuditAction | ''
  dateFrom: string
  dateTo: string
}

export const EMPTY_AUDIT_FILTERS: AuditFiltersValue = {
  action: '',
  dateFrom: '',
  dateTo: '',
}

interface AuditFiltersProps {
  value: AuditFiltersValue
  onChange: (value: AuditFiltersValue) => void
}

export function AuditFilters({ value, onChange }: AuditFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        label="Ação"
        value={value.action}
        onChange={(event) => onChange({ ...value, action: event.target.value as AuditAction | '' })}
      >
        <option value="">Todas</option>
        {Object.entries(AUDIT_ACTION_LABELS).map(([action, label]) => (
          <option key={action} value={action}>
            {label}
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
      <Button variant="secondary" size="md" onClick={() => onChange({ ...EMPTY_AUDIT_FILTERS })}>
        Limpar filtros
      </Button>
    </div>
  )
}
