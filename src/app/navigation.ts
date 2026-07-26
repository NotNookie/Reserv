export interface NavItem {
  to: string
  label: string
  /** Material Symbols icon name. */
  icon: string
  /** Exact match required (used for the index route). */
  end?: boolean
}

export interface NavSection {
  heading: string
  items: NavItem[]
}

/** Sidebar navigation model for the whole app. */
export const NAV_SECTIONS: NavSection[] = [
  {
    heading: 'Operations',
    items: [
      { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
      { to: '/bookings', label: 'Bookings', icon: 'event' },
      { to: '/calendar', label: 'Calendar', icon: 'calendar_month' },
      { to: '/resources', label: 'Resources', icon: 'meeting_room' },
    ],
  },
  {
    heading: 'Directory',
    items: [
      { to: '/customers', label: 'Customers', icon: 'group' },
      { to: '/staff', label: 'Staff', icon: 'badge' },
    ],
  },
  {
    heading: 'Business',
    items: [
      { to: '/billing', label: 'Billing', icon: 'payments' },
      { to: '/analytics', label: 'Analytics', icon: 'insights' },
      { to: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]
