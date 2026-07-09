import { cn } from '@lib/cn'

const BORDER_CLASSES: Record<string, string> = {
  'status-created': 'border-l-status-created',
  'status-planned': 'border-l-status-planned',
  'status-scheduled': 'border-l-status-scheduled',
  'status-transit': 'border-l-status-transit',
  'status-delivered': 'border-l-status-delivered',
}

interface MetricCardProps {
  label: string
  value: number
  colorToken: string
}

export function MetricCard({ label, value, colorToken }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-4 shadow-sm border-l-4',
        BORDER_CLASSES[colorToken],
      )}
    >
      <p className="text-3xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  )
}
