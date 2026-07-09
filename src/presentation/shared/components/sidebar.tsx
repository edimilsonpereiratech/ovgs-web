'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Boxes,
  CalendarClock,
  History,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Truck,
  Users,
} from 'lucide-react'
import { cn } from '@lib/cn'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { toggleSidebar } from '@store/slices/ui.slice'
import { ThemeToggle } from '@presentation/shared/components/theme-toggle'

const NAV_ITEMS = [
  { href: '/monitoramento', label: 'Monitoramento', icon: LayoutDashboard },
  { href: '/ordens', label: 'Ordens de Venda', icon: Package },
  { href: '/agendamento', label: 'Agendamento', icon: CalendarClock },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/tipos-transporte', label: 'Tipos de Transporte', icon: Truck },
  { href: '/itens', label: 'Itens', icon: Boxes },
  { href: '/auditoria', label: 'Auditoria', icon: History },
]

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const dispatch = useAppDispatch()

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-surface transition-[width]',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && <span className="text-lg font-semibold text-text">OVGS</span>}
        <button
          onClick={() => dispatch(toggleSidebar())}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="rounded-md p-1.5 text-text-muted hover:bg-surface-alt"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-muted hover:bg-surface-alt hover:text-text',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <ThemeToggle collapsed={collapsed} />
      </div>
    </aside>
  )
}
