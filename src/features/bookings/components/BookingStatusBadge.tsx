import { Badge } from '@/components/ui'
import { BOOKING_STATUS_META } from '@/data/status'
import type { BookingStatus } from '@/data/types'

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS_META[status]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}
