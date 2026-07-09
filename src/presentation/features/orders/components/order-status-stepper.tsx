import { Check } from 'lucide-react'
import { cn } from '@lib/cn'
import { ORDER_STATUS_CONFIG, ORDER_STATUS_SEQUENCE } from '@domain/value-objects/order-status'
import type { OrderStatus } from '@domain/value-objects/order-status'

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status)

  return (
    <div className="flex items-center">
      {ORDER_STATUS_SEQUENCE.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                  isDone && 'border-primary bg-primary text-white',
                  isCurrent && 'border-primary text-primary',
                  !isDone && !isCurrent && 'border-border text-text-muted',
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isCurrent ? 'text-text' : 'text-text-muted',
                )}
              >
                {ORDER_STATUS_CONFIG[step].label}
              </span>
            </div>
            {index < ORDER_STATUS_SEQUENCE.length - 1 && (
              <div className={cn('mx-2 h-0.5 flex-1', isDone ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
