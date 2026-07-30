import type { BadgeTone } from '@/components/ui'
import type { BookingStatus, InvoiceStatus, ResourceStatus } from './types'

interface StatusMeta {
  label: string
  tone: BadgeTone
}

export const BOOKING_STATUS_META: Record<BookingStatus, StatusMeta> = {
  pending: { label: 'Pending', tone: 'pending' },
  confirmed: { label: 'Confirmed', tone: 'confirmed' },
  arrived: { label: 'Arrived', tone: 'info' },
  completed: { label: 'Completed', tone: 'blue' },
  cancelled: { label: 'Cancelled', tone: 'cancelled' },
  no_show: { label: 'No-show', tone: 'neutral' },
}

export const RESOURCE_STATUS_META: Record<ResourceStatus, StatusMeta> = {
  available: { label: 'Available', tone: 'confirmed' },
  occupied: { label: 'Occupied', tone: 'pending' },
  maintenance: { label: 'Maintenance', tone: 'neutral' },
}

export const INVOICE_STATUS_META: Record<InvoiceStatus, StatusMeta> = {
  unpaid: { label: 'Unpaid', tone: 'pending' },
  paid: { label: 'Paid', tone: 'confirmed' },
  refunded: { label: 'Refunded', tone: 'purple' },
  void: { label: 'Void', tone: 'neutral' },
}
