import { useTheme } from '@/context/theme-context'
import { Icon } from '@/components/ui'

export interface TopbarProps {
  title: string
  onToggleSidebar: () => void
  onOpenMobileNav: () => void
}

export function Topbar({
  title,
  onToggleSidebar,
  onOpenMobileNav,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2.5 md:px-5">
      <div className="flex items-center gap-2">
        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground md:inline-flex"
        >
          <Icon name="menu_open" className="text-[20px]" />
        </button>
        {/* Drawer toggle (mobile) */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
        >
          <Icon name="menu" className="text-[20px]" />
        </button>
        <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <Icon
            name={theme === 'dark' ? 'light_mode' : 'dark_mode'}
            className="text-[20px]"
          />
        </button>
        <div
          className="flex size-8 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-foreground"
          title="Account"
        >
          RS
        </div>
      </div>
    </header>
  )
}
