import { cn } from '@lib/cn'

interface CheckboxGroupOption {
  id: string
  label: string
}

interface CheckboxGroupProps {
  label?: string
  options: CheckboxGroupOption[]
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function CheckboxGroup({ label, options, value, onChange, error }: CheckboxGroupProps) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id])
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-text">{label}</span>}
      <div
        className={cn(
          'flex flex-col gap-2 rounded-md border border-border bg-surface p-3',
          error && 'border-error',
        )}
      >
        {options.length === 0 && <span className="text-sm text-text-muted">Nenhuma opção disponível.</span>}
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-[var(--primary)]"
              checked={value.includes(option.id)}
              onChange={() => toggle(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
