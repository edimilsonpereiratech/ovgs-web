'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  CreateTransportTypeInputSchema,
  type CreateTransportTypeInput,
} from '@domain/entities/transport-type'
import { Button } from '@presentation/shared/components/ui/button'
import { Input } from '@presentation/shared/components/ui/input'

interface TransportTypeFormProps {
  defaultValues?: CreateTransportTypeInput
  isSubmitting?: boolean
  onSubmit: (input: CreateTransportTypeInput) => void
}

export function TransportTypeForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: TransportTypeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransportTypeInput>({
    resolver: zodResolver(CreateTransportTypeInputSchema),
    defaultValues: defaultValues ?? { name: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        placeholder="Ex.: Caminhão"
        error={errors.name?.message}
        {...register('name')}
      />
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
