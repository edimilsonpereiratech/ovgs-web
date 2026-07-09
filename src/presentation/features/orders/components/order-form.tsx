'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { Client } from '@domain/entities/client'
import type { Item } from '@domain/entities/item'
import { CreateOrderInputSchema, type CreateOrderInput } from '@domain/entities/order'
import type { TransportType } from '@domain/entities/transport-type'
import { OrderItemRows } from '@presentation/features/orders/components/order-item-rows'
import { Button } from '@presentation/shared/components/ui/button'
import { Select } from '@presentation/shared/components/ui/select'
import { Textarea } from '@presentation/shared/components/ui/textarea'

interface OrderFormProps {
  clients: Client[]
  transportTypes: TransportType[]
  items: Item[]
  isSubmitting?: boolean
  onSubmit: (input: CreateOrderInput) => void
}

export function OrderForm({
  clients,
  transportTypes,
  items,
  isSubmitting,
  onSubmit,
}: OrderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(CreateOrderInputSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? '',
      transportTypeId: '',
      items: [{ itemId: items[0]?.id ?? '', quantity: 1 }],
      observations: '',
    },
  })

  const selectedClientId = useWatch({ control, name: 'clientId' })

  const authorizedTransportTypes = useMemo(() => {
    const client = clients.find((candidate) => candidate.id === selectedClientId)
    if (!client) return []
    return transportTypes.filter((type) => client.authorizedTransportTypeIds.includes(type.id))
  }, [clients, transportTypes, selectedClientId])

  useEffect(() => {
    setValue('transportTypeId', authorizedTransportTypes[0]?.id ?? '')
  }, [authorizedTransportTypes, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Select label="Cliente" error={errors.clientId?.message} {...register('clientId')}>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </Select>

      <Select
        label="Tipo de transporte"
        error={errors.transportTypeId?.message}
        disabled={authorizedTransportTypes.length === 0}
        {...register('transportTypeId')}
      >
        {authorizedTransportTypes.length === 0 && (
          <option value="">Nenhum transporte autorizado</option>
        )}
        {authorizedTransportTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </Select>

      <OrderItemRows control={control} register={register} items={items} errors={errors} />

      <Textarea
        label="Observações"
        placeholder="Instruções adicionais para a entrega (opcional)"
        error={errors.observations?.message}
        {...register('observations')}
      />

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? 'Criando ordem...' : 'Criar ordem de venda'}
      </Button>
    </form>
  )
}
