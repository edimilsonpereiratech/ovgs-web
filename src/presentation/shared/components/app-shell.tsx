import type { ReactNode } from 'react'
import { Sidebar } from '@presentation/shared/components/sidebar'
import { ToastContainer } from '@presentation/shared/components/toast-container'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <ToastContainer />
    </div>
  )
}
