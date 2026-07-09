import type { ReactNode } from 'react'
import { AppShell } from '@presentation/shared/components/app-shell'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
