'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useCreateItem } from '@presentation/features/items/api/use-create-item'
import { useItems } from '@presentation/features/items/api/use-items'
import { ItemForm } from '@presentation/features/items/components/item-form'
import { ItemTable } from '@presentation/features/items/components/item-table'
import { Button } from '@presentation/shared/components/ui/button'
import { Drawer } from '@presentation/shared/components/ui/drawer'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Spinner } from '@presentation/shared/components/ui/spinner'

export function ItemsPage() {
  const { data: items, isLoading } = useItems()
  const createMutation = useCreateItem()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Itens</h1>
          <p className="mt-1 text-sm text-text-muted">Catálogo de itens disponíveis para ordens.</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo item
        </Button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !items || items.length === 0 ? (
          <EmptyState title="Nenhum item cadastrado" />
        ) : (
          <ItemTable items={items} />
        )}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Novo item">
        <ItemForm
          isSubmitting={createMutation.isPending}
          onSubmit={(input) =>
            createMutation.mutate(input, { onSuccess: () => setDrawerOpen(false) })
          }
        />
      </Drawer>
    </div>
  )
}
