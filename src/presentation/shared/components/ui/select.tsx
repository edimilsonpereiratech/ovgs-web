import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, name, children, ...props }, ref) => {
    const selectId = id ?? name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={cn(
            'focus:ring-primary/40 h-10 rounded-md border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2',
            error && 'border-error',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    )
  },
)
Select.displayName = 'Select'
