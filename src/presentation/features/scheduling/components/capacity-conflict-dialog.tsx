import { useEffect, useRef } from 'react'
import { ConfirmDialog } from '@presentation/shared/components/ui/confirm-dialog'

interface CapacityConflictDialogProps {
  count: number | null
  onResolve: (proceed: boolean) => void
}

export function CapacityConflictDialog({ count, onResolve }: CapacityConflictDialogProps) {
  const resolvedRef = useRef(false)

  useEffect(() => {
    if (count !== null) resolvedRef.current = false
  }, [count])

  function resolve(proceed: boolean) {
    if (resolvedRef.current) return
    resolvedRef.current = true
    onResolve(proceed)
  }

  return (
    <ConfirmDialog
      open={count !== null}
      onOpenChange={(open) => {
        if (!open) resolve(false)
      }}
      title="Capacidade da janela excedida"
      description={`Já existem ${count} entregas agendadas para essa mesma janela de horário. Deseja confirmar mesmo assim?`}
      confirmLabel="Confirmar mesmo assim"
      variant="danger"
      onConfirm={() => resolve(true)}
    />
  )
}
