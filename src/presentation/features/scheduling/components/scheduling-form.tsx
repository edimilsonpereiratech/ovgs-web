'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  CreateSchedulingInputSchema,
  type CreateSchedulingInput,
} from '@domain/entities/scheduling'
import {
  STANDARD_DELIVERY_WINDOWS,
  formatDeliveryWindow,
} from '@domain/value-objects/delivery-window'
import { Button } from '@presentation/shared/components/ui/button'
import { Input } from '@presentation/shared/components/ui/input'
import { Select } from '@presentation/shared/components/ui/select'

interface SchedulingFormProps {
  isSubmitting?: boolean
  onSubmit: (input: CreateSchedulingInput) => void
}

export function SchedulingForm({ isSubmitting, onSubmit }: SchedulingFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSchedulingInput>({
    resolver: zodResolver(CreateSchedulingInputSchema),
    defaultValues: {
      deliveryDate: '',
      timeWindow: STANDARD_DELIVERY_WINDOWS[0],
    },
  })

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="flex flex-col gap-4">
      <Input
        label="Data de entrega"
        type="date"
        error={errors.deliveryDate?.message}
        {...register('deliveryDate')}
      />
      <Controller
        name="timeWindow"
        control={control}
        render={({ field }) => (
          <Select
            label="Janela de horário"
            value={STANDARD_DELIVERY_WINDOWS.findIndex(
              (window) => window.start === field.value.start,
            )}
            onChange={(event) =>
              field.onChange(STANDARD_DELIVERY_WINDOWS[Number(event.target.value)])
            }
          >
            {STANDARD_DELIVERY_WINDOWS.map((window, index) => (
              <option key={window.start} value={index}>
                {formatDeliveryWindow(window)}
              </option>
            ))}
          </Select>
        )}
      />
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? 'Salvando...' : 'Confirmar'}
      </Button>
    </form>
  )
}
