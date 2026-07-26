import { useMemo, useState } from 'react'
import {
  Button,
  FormField,
  Input,
  Modal,
  Select,
  useToast,
} from '@/components/ui'
import {
  useCreateBooking,
  useCustomers,
  useResources,
  useServices,
  useStaff,
  useUpdateBooking,
} from '@/data/hooks'
import { BookingConflictError } from '@/data/services'
import type { BookingStatus, BookingWithRelations } from '@/data/types'
import { BOOKING_STATUSES } from '@/data/types'
import { BOOKING_STATUS_META } from '@/data/status'
import {
  addMinutes,
  fromLocalInputValue,
  toLocalInputValue,
} from '@/lib/datetime'
import { formatTime } from '@/lib/format'

export interface BookingFormModalProps {
  open: boolean
  onClose: () => void
  /** Provided when editing an existing booking. */
  booking?: BookingWithRelations
  /** Prefill the start time (e.g. from a calendar slot click). */
  initialStart?: string
  onSaved?: (booking: BookingWithRelations) => void
}

interface FormState {
  customerId: string
  serviceId: string
  staffId: string
  resourceId: string
  start: string
  status: BookingStatus
  notes: string
}

function buildInitialState(
  booking: BookingWithRelations | undefined,
  initialStart: string | undefined,
): FormState {
  return {
    customerId: booking?.customerId ?? '',
    serviceId: booking?.serviceId ?? '',
    staffId: booking?.staffId ?? '',
    resourceId: booking?.resourceIds[0] ?? '',
    start: toLocalInputValue(
      booking?.startAt ?? initialStart ?? new Date().toISOString(),
    ),
    status: booking?.status ?? 'pending',
    notes: booking?.notes ?? '',
  }
}

export function BookingFormModal({
  open,
  onClose,
  booking,
  initialStart,
  onSaved,
}: BookingFormModalProps) {
  const isEdit = Boolean(booking)
  const { show } = useToast()
  const customers = useCustomers()
  const services = useServices()
  const staff = useStaff()
  const resources = useResources()
  const createBooking = useCreateBooking()
  const updateBooking = useUpdateBooking()

  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(booking, initialStart),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedService = services.data?.find((s) => s.id === form.serviceId)
  const endPreview = useMemo(() => {
    if (!form.start || !selectedService) return null
    const startIso = fromLocalInputValue(form.start)
    return addMinutes(startIso, selectedService.durationMinutes)
  }, [form.start, selectedService])

  const isSaving = createBooking.isPending || updateBooking.isPending

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.customerId) next.customerId = 'Select a customer'
    if (!form.serviceId) next.serviceId = 'Select a service'
    if (!form.resourceId) next.resourceId = 'Select a resource'
    if (!form.start) next.start = 'Choose a start time'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate() || !selectedService) return

    const startAt = fromLocalInputValue(form.start)
    const endAt = addMinutes(startAt, selectedService.durationMinutes)
    const payload = {
      customerId: form.customerId,
      serviceId: form.serviceId,
      staffId: form.staffId || undefined,
      resourceIds: [form.resourceId],
      startAt,
      endAt,
      status: form.status,
      notes: form.notes || undefined,
    }

    try {
      const saved =
        isEdit && booking
          ? await updateBooking.mutateAsync({ id: booking.id, input: payload })
          : await createBooking.mutateAsync(payload)
      show({
        tone: 'success',
        title: isEdit ? 'Booking updated' : 'Booking created',
        description: `${saved.customer.name} · ${saved.service.name}`,
      })
      onSaved?.(saved)
      onClose()
    } catch (error) {
      if (error instanceof BookingConflictError) {
        setErrors({ start: 'This slot conflicts with an existing booking.' })
        show({
          tone: 'error',
          title: 'Scheduling conflict',
          description: 'The resource or staff member is already booked.',
        })
      } else {
        show({
          tone: 'error',
          title: 'Could not save booking',
          description:
            error instanceof Error ? error.message : 'Unexpected error.',
        })
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit booking' : 'New booking'}
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon="check"
            loading={isSaving}
            onClick={(e) => void handleSubmit(e)}
          >
            {isEdit ? 'Save changes' : 'Create booking'}
          </Button>
        </>
      }
    >
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <FormField label="Customer" required error={errors.customerId}>
          <Select
            value={form.customerId}
            onChange={(e) => set('customerId', e.target.value)}
          >
            <option value="">Select customer…</option>
            {customers.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Service" required error={errors.serviceId}>
          <Select
            value={form.serviceId}
            onChange={(e) => set('serviceId', e.target.value)}
          >
            <option value="">Select service…</option>
            {services.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.durationMinutes}m
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Resource" required error={errors.resourceId}>
          <Select
            value={form.resourceId}
            onChange={(e) => set('resourceId', e.target.value)}
          >
            <option value="">Select resource…</option>
            {resources.data?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Staff (optional)">
          <Select
            value={form.staffId}
            onChange={(e) => set('staffId', e.target.value)}
          >
            <option value="">Unassigned</option>
            {staff.data
              ?.filter((s) => s.active)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </Select>
        </FormField>

        <FormField
          label="Start"
          required
          error={errors.start}
          hint={
            endPreview
              ? `Ends at ${formatTime(endPreview)}`
              : 'Pick a service to compute the end time'
          }
        >
          <Input
            type="datetime-local"
            value={form.start}
            onChange={(e) => set('start', e.target.value)}
          />
        </FormField>

        <FormField label="Status">
          <Select
            value={form.status}
            onChange={(e) => set('status', e.target.value as BookingStatus)}
          >
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {BOOKING_STATUS_META[s].label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Notes" className="sm:col-span-2">
          <Input
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Optional notes…"
          />
        </FormField>
      </form>
    </Modal>
  )
}
