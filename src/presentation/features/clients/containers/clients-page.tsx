'use client'

import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Client } from '@domain/entities/client'
import { useCreateClient } from '@presentation/features/clients/api/use-create-client'
import { useClients } from '@presentation/features/clients/api/use-clients'
import { useUpdateClient } from '@presentation/features/clients/api/use-update-client'
import { ClientForm } from '@presentation/features/clients/components/client-form'
import { ClientTable } from '@presentation/features/clients/components/client-table'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { Button } from '@presentation/shared/components/ui/button'
import { Drawer } from '@presentation/shared/components/ui/drawer'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Spinner } from '@presentation/shared/components/ui/spinner'

export function ClientsPage() {
  const { data: clients, isLoading } = useClients()
  const { data: transportTypes } = useTransportTypes()
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)

  const transportTypesById = useMemo(
    () => new Map((transportTypes ?? []).map((type) => [type.id, type])),
    [transportTypes],
  )

  function openCreate() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(client: Client) {
    setEditing(client)
    setDrawerOpen(true)
  }

  function handleSubmit(input: {
    name: string
    document: string
    authorizedTransportTypeIds: string[]
  }) {
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
          <h1 className="text-2xl font-semibold text-text">Clientes</h1>
          <p className="mt-1 text-sm text-text-muted">
            Gerencie clientes e os tipos de transporte que cada um pode utilizar.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !clients || clients.length === 0 ? (
          <EmptyState title="Nenhum cliente cadastrado" />
        ) : (
          <ClientTable
            clients={clients}
            transportTypesById={transportTypesById}
            onEdit={openEdit}
          />
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editing ? 'Editar cliente' : 'Novo cliente'}
      >
        <ClientForm
          transportTypes={transportTypes ?? []}
          defaultValues={
            editing
              ? {
                  name: editing.name,
                  document: editing.document,
                  authorizedTransportTypeIds: editing.authorizedTransportTypeIds,
                }
              : undefined
          }
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </div>
  )
}
