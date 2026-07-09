'use client'

import { useMemo, useState } from 'react'
import type { Order } from '@domain/entities/order'
import { useClients } from '@presentation/features/clients/api/use-clients'
import { useTransportTypes } from '@presentation/features/transport-types/api/use-transport-types'
import { useSchedulableOrders } from '@presentation/features/scheduling/api/use-schedulable-orders'
import { useSchedulingFlow } from '@presentation/features/scheduling/api/use-scheduling-flow'
import { CapacityConflictDialog } from '@presentation/features/scheduling/components/capacity-conflict-dialog'
import { PendingSchedulingTable } from '@presentation/features/scheduling/components/pending-scheduling-table'
import { ScheduledAgenda } from '@presentation/features/scheduling/components/scheduled-agenda'
import { SchedulingForm } from '@presentation/features/scheduling/components/scheduling-form'
import { Drawer } from '@presentation/shared/components/ui/drawer'
import { EmptyState } from '@presentation/shared/components/ui/empty-state'
import { Spinner } from '@presentation/shared/components/ui/spinner'

interface SchedulingTarget {
  order: Order
  mode: 'confirm' | 'reschedule'
}

export function SchedulingPage() {
  const { data: clients } = useClients()
  const { data: transportTypes } = useTransportTypes()
  const { pending, scheduledGroups, isLoading } = useSchedulableOrders()
  const { isProcessing, conflict, requestScheduling, acknowledgeConflict } = useSchedulingFlow()

  const [target, setTarget] = useState<SchedulingTarget | null>(null)

  const clientsById = useMemo(() => new Map((clients ?? []).map((c) => [c.id, c])), [clients])
  const transportTypesById = useMemo(
    () => new Map((transportTypes ?? []).map((t) => [t.id, t])),
    [transportTypes],
  )

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-text">Agendamento</h1>
        <p className="mt-1 text-sm text-text-muted">
          Confirme entregas planejadas e acompanhe a agenda das ordens já agendadas.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-text">Aguardando confirmação</h2>
            {pending.length === 0 ? (
              <EmptyState title="Nenhuma ordem planejada aguardando agendamento" />
            ) : (
              <PendingSchedulingTable
                orders={pending}
                clientsById={clientsById}
                transportTypesById={transportTypesById}
                onSchedule={(order) => setTarget({ order, mode: 'confirm' })}
              />
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-text">Agenda de entregas</h2>
            {scheduledGroups.length === 0 ? (
              <EmptyState title="Nenhuma entrega agendada" />
            ) : (
              <ScheduledAgenda
                groups={scheduledGroups}
                clientsById={clientsById}
                transportTypesById={transportTypesById}
                onReschedule={(order) => setTarget({ order, mode: 'reschedule' })}
              />
            )}
          </section>
        </>
      )}

      <Drawer
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={target?.mode === 'confirm' ? 'Confirmar agendamento' : 'Reagendar entrega'}
      >
        {target && (
          <SchedulingForm
            isSubmitting={isProcessing}
            onSubmit={(input) => {
              requestScheduling(target.order, input, target.mode)
              setTarget(null)
            }}
          />
        )}
      </Drawer>

      <CapacityConflictDialog count={conflict?.count ?? null} onResolve={acknowledgeConflict} />
    </div>
  )
}
