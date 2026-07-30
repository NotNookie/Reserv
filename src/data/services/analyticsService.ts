import { getDb } from '../store'
import type { BookingStatus } from '../types'
import { delay } from './util'

export interface DayPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string
  /** Short label for the axis, e.g. "Mon 28". */
  label: string
  bookings: number
  revenue: number
}

export interface StatusSlice {
  status: BookingStatus
  count: number
}

export interface NamedCount {
  name: string
  count: number
}

export interface AnalyticsOverview {
  totals: {
    bookings: number
    revenue: number
    completedRate: number
    noShowRate: number
  }
  perDay: DayPoint[]
  statusMix: StatusSlice[]
  staff: NamedCount[]
  resources: NamedCount[]
}

function isoDay(d: Date): string {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString().slice(0, 10)
}

function dayLabel(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
  }).format(d)
}

export const analyticsService = {
  /**
   * Aggregate metrics over a rolling window centred on today
   * (`days` before through `days` after).
   */
  async overview(days = 7): Promise<AnalyticsOverview> {
    await delay()
    const db = getDb()

    // Build the per-day skeleton.
    const perDayMap = new Map<string, DayPoint>()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let offset = -days; offset <= days; offset++) {
      const d = new Date(today)
      d.setDate(d.getDate() + offset)
      const key = isoDay(d)
      perDayMap.set(key, {
        date: key,
        label: dayLabel(d),
        bookings: 0,
        revenue: 0,
      })
    }

    // Bookings → per-day counts + status mix + totals.
    const statusCounts = new Map<BookingStatus, number>()
    let completed = 0
    let noShow = 0
    for (const b of db.bookings) {
      statusCounts.set(b.status, (statusCounts.get(b.status) ?? 0) + 1)
      if (b.status === 'completed') completed++
      if (b.status === 'no_show') noShow++
      const key = b.startAt.slice(0, 10)
      const point = perDayMap.get(key)
      if (point && b.status !== 'cancelled') point.bookings++
    }

    // Paid invoices → per-day revenue.
    for (const inv of db.invoices) {
      if (inv.status !== 'paid') continue
      const key = (inv.paidAt ?? inv.issuedAt).slice(0, 10)
      const point = perDayMap.get(key)
      if (point) point.revenue += inv.amount
    }

    const totalBookings = db.bookings.length

    // Staff performance: completed bookings per active/known staff.
    const staffCounts = new Map<string, number>()
    for (const b of db.bookings) {
      if (!b.staffId) continue
      if (b.status === 'cancelled' || b.status === 'no_show') continue
      staffCounts.set(b.staffId, (staffCounts.get(b.staffId) ?? 0) + 1)
    }
    const staff: NamedCount[] = db.staff
      .map((s) => ({ name: s.name, count: staffCounts.get(s.id) ?? 0 }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count)

    // Resource utilization: bookings per resource.
    const resourceCounts = new Map<string, number>()
    for (const b of db.bookings) {
      if (b.status === 'cancelled') continue
      for (const rid of b.resourceIds) {
        resourceCounts.set(rid, (resourceCounts.get(rid) ?? 0) + 1)
      }
    }
    const resources: NamedCount[] = db.resources
      .map((r) => ({ name: r.name, count: resourceCounts.get(r.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)

    const statusMix: StatusSlice[] = [...statusCounts.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count)

    const revenue = db.invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0)

    return {
      totals: {
        bookings: totalBookings,
        revenue,
        completedRate: totalBookings ? completed / totalBookings : 0,
        noShowRate: totalBookings ? noShow / totalBookings : 0,
      },
      perDay: [...perDayMap.values()],
      statusMix,
      staff,
      resources,
    }
  },
}
