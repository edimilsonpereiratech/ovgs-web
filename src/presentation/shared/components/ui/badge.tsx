import type { ReactNode } from 'react'
import { cn } from '@lib/cn'

export type BadgeColor =
  | 'created'
  | 'planned'
  | 'scheduled'
  | 'transit'
  | 'delivered'
  | 'success'
  | 'error'
  | 'warning'
  | 'neutral'

interface BadgeProps {
  color?: BadgeColor
  children: ReactNode
  className?: string
}

const COLOR_CLASSES: Record<BadgeColor, string> = {
  created: 'bg-status-created/10 text-status-created',
  planned: 'bg-status-planned/10 text-status-planned',
  scheduled: 'bg-status-scheduled/10 text-status-scheduled',
  transit: 'bg-status-transit/10 text-status-transit',
  delivered: 'bg-status-delivered/10 text-status-delivered',
  success: 'bg-success/10 text-success',
  error: 'bg-error/10 text-error',
  warning: 'bg-warning/10 text-warning',
  neutral: 'bg-surface-alt text-text-muted',
}

export function Badge({ color = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        COLOR_CLASSES[color],
        className,
      )}
    >
      {children}
    </span>
  )
}
