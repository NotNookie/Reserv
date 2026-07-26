import { NavLink } from 'react-router-dom'
import { NAV_SECTIONS } from '@/app/navigation'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/ui'

export interface SidebarProps {
  collapsed: boolean
  /** Mobile drawer open state. */
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200',
          collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
          // Mobile: fixed drawer
          'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:w-sidebar max-md:transition-transform',
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Icon
              name="event_available"
              className="text-[18px] text-primary-foreground"
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                Reserv
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Reservation System
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading} className="mb-1">
              {!collapsed && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-wider text-subtle-foreground uppercase">
                  {section.heading}
                </p>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors',
                      collapsed && 'justify-center',
                      isActive
                        ? 'bg-brand-muted font-medium text-brand-muted-foreground'
                        : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                    )
                  }
                >
                  <Icon name={item.icon} className="text-[18px]" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
