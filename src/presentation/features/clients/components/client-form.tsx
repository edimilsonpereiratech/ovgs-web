'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { CreateClientInputSchema, type CreateClientInput } from '@domain/entities/client'
import type { TransportType } from '@domain/entities/transport-type'
import { Button } from '@presentation/shared/components/ui/button'
import { CheckboxGroup } from '@presentation/shared/components/ui/checkbox-group'
import { Input } from '@presentation/shared/components/ui/input'

interface ClientFormProps {
  transportTypes: TransportType[]
  defaultValues?: CreateClientInput
  isSubmitting?: boolean
  onSubmit: (input: CreateClientInput) => void
}

export function ClientForm({
  transportTypes,
  defaultValues,
  isSubmitting,
  onSubmit,
}: ClientFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(CreateClientInputSchema),
    defaultValues: defaultValues ?? { name: '', document: '', authorizedTransportTypeIds: [] },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        placeholder="Razão social"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Documento"
        placeholder="CNPJ/CPF"
        error={errors.document?.message}
        {...register('document')}
      />
      <Controller
        name="authorizedTransportTypeIds"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Tipos de transporte autorizados"
            options={transportTypes.map((type) => ({ id: type.id, label: type.name }))}
            value={field.value}
            onChange={field.onChange}
            error={errors.authorizedTransportTypeIds?.message}
          />
        )}
      />
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
