import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, name, ...props }, ref) => {
    const textareaId = id ?? name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          className={cn(
            'focus:ring-primary/40 min-h-24 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2',
            error && 'border-error',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
