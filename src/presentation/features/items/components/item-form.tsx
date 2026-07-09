'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateItemInputSchema, type CreateItemInput } from '@domain/entities/item'
import { Button } from '@presentation/shared/components/ui/button'
import { Input } from '@presentation/shared/components/ui/input'

interface ItemFormProps {
  isSubmitting?: boolean
  onSubmit: (input: CreateItemInput) => void
}

export function ItemForm({ isSubmitting, onSubmit }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItemInput>({
    resolver: zodResolver(CreateItemInputSchema),
    defaultValues: { sku: '', name: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="SKU"
        placeholder="Ex.: SKU-0001"
        error={errors.sku?.message}
        {...register('sku')}
      />
      <Input
        label="Nome"
        placeholder="Nome do item"
        error={errors.name?.message}
        {...register('name')}
      />
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? 'Salvando...' : 'Adicionar item'}
      </Button>
    </form>
  )
}
