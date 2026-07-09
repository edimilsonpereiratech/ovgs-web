import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@lib/cn'
import { logger } from '@lib/logger'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Nome do evento de interação a ser logado quando o botão é clicado. */
  trackingEvent?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-alt',
  ghost: 'bg-transparent text-text hover:bg-surface-alt',
  danger: 'bg-error text-white hover:opacity-90',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      trackingEvent,
      onClick,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      onClick={(event) => {
        if (trackingEvent) {
          logger.info('Interação de usuário', { event: trackingEvent })
        }
        onClick?.(event)
      }}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
