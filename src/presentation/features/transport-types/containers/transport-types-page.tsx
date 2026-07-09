'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { TransportType } from '@domain/entities/transport-type'
import { useCreateTransportType } from '@presentation/features/transport-types/api/use-create-transport-type'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { useUpdateTransportType } from '@presentation/features/transport-types/api/use-update-transport-type'
import { TransportTypeForm } from '@presentation/features/transport-types/components/transport-type-form'
import { TransportTypeTable } from '@presentation/features/transport-types/components/transport-type-table'
import { Button } from '@presentation/shared/components/ui/button'
import { Drawer } from '@presentation/shared/components/ui/drawer'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Spinner } from '@presentation/shared/components/ui/spinner'

export function TransportTypesPage() {
  const { data, isLoading } = useTransportTypes()
  const createMutation = useCreateTransportType()
  const updateMutation = useUpdateTransportType()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<TransportType | null>(null)

  function openCreate() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(transportType: TransportType) {
    setEditing(transportType)
    setDrawerOpen(true)
  }

  function handleSubmit(input: { name: string }) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, input }, { onSuccess: () => setDrawerOpen(false) })
    } else {
      createMutation.mutate(input, { onSuccess: () => setDrawerOpen(false) })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Tipos de Transporte</h1>
          <p className="mt-1 text-sm text-text-muted">
            Cadastre os tipos de veículo usados nas entregas.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo tipo
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState title="Nenhum tipo de transporte cadastrado" />
        ) : (
          <TransportTypeTable transportTypes={data} onEdit={openEdit} />
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editing ? 'Editar tipo de transporte' : 'Novo tipo de transporte'}
      >
        <TransportTypeForm
          defaultValues={editing ? { name: editing.name } : undefined}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </div>
  )
}
