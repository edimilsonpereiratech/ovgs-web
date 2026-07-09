'use client'

import { Toast } from '@presentation/shared/components/ui/toast'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { dismissNotification } from '@store/slices/notifications.slice'

export function ToastContainer() {
  const notifications = useAppSelector((state) => state.notifications.items)
  const dispatch = useAppDispatch()

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          variant={notification.variant}
          message={notification.message}
          onDismiss={() => dispatch(dismissNotification(notification.id))}
        />
      ))}
    </div>
  )
}
