import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@lib/cn'
import type { NotificationVariant } from '@store/slices/notifications.slice'

interface ToastProps {
  variant: NotificationVariant
  message: string
  onDismiss: () => void
}

const VARIANT_CONFIG: Record<NotificationVariant, { icon: typeof CheckCircle2; classes: string }> =
  {
    success: { icon: CheckCircle2, classes: 'border-success/30 bg-success/10 text-success' },
    error: { icon: XCircle, classes: 'border-error/30 bg-error/10 text-error' },
    info: { icon: Info, classes: 'border-primary/30 bg-primary/10 text-primary' },
  }

export function Toast({ variant, message, onDismiss }: ToastProps) {
  const { icon: Icon, classes } = VARIANT_CONFIG[variant]

  return (
    <div className={cn('flex items-start gap-3 rounded-md border px-4 py-3 shadow-sm', classes)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1 text-sm text-text">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="text-text-muted hover:text-text"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
