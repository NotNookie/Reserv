import { useMemo } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import { Badge, Card, CardBody, Icon, Select, useToast } from '@/components/ui'
import {
  useBookings,
  useResources,
  useUpdateResourceStatus,
} from '@/data/hooks'
import { RESOURCE_STATUS_META } from '@/data/status'
import type {
  BookingWithRelations,
  Resource,
  ResourceStatus,
} from '@/data/types'
import { dayBounds } from '@/lib/datetime'

const RESOURCE_ICON: Record<Resource['kind'], string> = {
  room: 'meeting_room',
  station: 'chair',
  unit: 'apartment',
}

const STATUSES: ResourceStatus[] = ['available', 'occupied', 'maintenance']

function ResourceCard({
  resource,
  todayCount,
}: {
  resource: Resource
  todayCount: number
}) {
  const { show } = useToast()
  const updateStatus = useUpdateResourceStatus()
  const meta = RESOURCE_STATUS_META[resource.status]

  async function onStatusChange(status: ResourceStatus) {
    try {
      await updateStatus.mutateAsync({ id: resource.id, status })
      show({ tone: 'success', title: `${resource.name} → ${status}` })
    } catch (error) {
      show({
        tone: 'error',
        title: 'Could not update resource',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-surface-muted">
              <Icon
                name={RESOURCE_ICON[resource.kind]}
                className="text-[20px] text-muted-foreground"
              />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {resource.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {resource.kind} · {resource.location ?? 'Unassigned'}
              </p>
            </div>
          </div>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="group" className="text-[16px]" />
            Capacity {resource.capacity}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="event" className="text-[16px]" />
            {todayCount} today
          </span>
        </div>

        <Select
          aria-label={`Set status for ${resource.name}`}
          value={resource.status}
          disabled={updateStatus.isPending}
          onChange={(e) =>
            void onStatusChange(e.target.value as ResourceStatus)
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {RESOURCE_STATUS_META[s].label}
            </option>
          ))}
        </Select>
      </CardBody>
    </Card>
  )
}

export function ResourcesPage() {
  const resources = useResources()
  const today = useMemo(() => dayBounds(new Date()), [])
  const bookings = useBookings({ from: today.from, to: today.to })

  function countToday(
    resourceId: string,
    rows: BookingWithRelations[],
  ): number {
    return rows.filter(
      (b) => b.resourceIds.includes(resourceId) && b.status !== 'cancelled',
    ).length
  }

  return (
    <>
      <PageHeader
        title="Resources"
        description="Rooms and bookable resources with availability."
      />
      <QueryState query={resources} loadingLabel="Loading resources…">
        {(list) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                todayCount={countToday(resource.id, bookings.data ?? [])}
              />
            ))}
          </div>
        )}
      </QueryState>
    </>
  )
}
