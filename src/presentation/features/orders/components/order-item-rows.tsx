import { Trash2 } from 'lucide-react'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import type { Item } from '@domain/entities/item'
import type { CreateOrderInput } from '@domain/entities/order'
import { Button } from '@presentation/shared/components/ui/button'
import { Input } from '@presentation/shared/components/ui/input'
import { Select } from '@presentation/shared/components/ui/select'

interface OrderItemRowsProps {
  control: Control<CreateOrderInput>
  register: UseFormRegister<CreateOrderInput>
  items: Item[]
  errors: FieldErrors<CreateOrderInput>
}

export function OrderItemRows({ control, register, items, errors }: OrderItemRowsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text">Itens da ordem</span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ itemId: items[0]?.id ?? '', quantity: 1 })}
        >
          Adicionar item
        </Button>
      </div>

      {errors.items?.message && <span className="text-xs text-error">{errors.items.message}</span>}

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label={index === 0 ? 'Item' : undefined}
              defaultValue={field.itemId}
              {...register(`items.${index}.itemId`)}
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.sku} — {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-24">
            <Input
              label={index === 0 ? 'Qtd.' : undefined}
              type="number"
              min={1}
              defaultValue={field.quantity}
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={fields.length === 1}
            onClick={() => remove(index)}
            aria-label="Remover item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
