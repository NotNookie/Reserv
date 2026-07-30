import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NAV_SECTIONS } from '@/app/navigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const ALL_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)

function usePageTitle(pathname: string): string {
  return useMemo(() => {
    // Prefer the most specific matching nav item.
    const match = ALL_ITEMS.filter((item) =>
      item.end ? pathname === item.to : pathname.startsWith(item.to),
    ).sort((a, b) => b.to.length - a.to.length)[0]
    return match?.label ?? 'Reserv'
  }, [pathname])
}

/** Persistent application shell: sidebar + topbar + routed content. */
export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const title = usePageTitle(pathname)

  return (
    <div className="flex h-svh overflow-hidden">
      <a
        href="#main-content"
        className="sr-only z-70 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-5"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
