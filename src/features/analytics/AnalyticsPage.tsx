import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  StatCard,
} from '@/components/ui'
import { useAnalytics } from '@/data/hooks'
import type { AnalyticsOverview } from '@/data/services'
import { BOOKING_STATUS_META } from '@/data/status'
import { formatMoney } from '@/lib/format'
import { axisTick, chartColors, STATUS_FILL } from './components/chartTheme'
import { ChartTooltip } from './components/ChartTooltip'

const RANGES = [
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 },
]

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function BookingsChart({ data }: { data: AnalyticsOverview['perDay'] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={axisTick}
          tickLine={false}
          axisLine={{ stroke: chartColors.grid }}
          interval="preserveStartEnd"
          minTickGap={16}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={32}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--surface-muted)' }}
          content={<ChartTooltip />}
        />
        <Bar
          dataKey="bookings"
          name="Bookings"
          fill={chartColors.primary}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function RevenueChart({ data }: { data: AnalyticsOverview['perDay'] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={chartColors.primary}
              stopOpacity={0.25}
            />
            <stop
              offset="100%"
              stopColor={chartColors.primary}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tick={axisTick}
          tickLine={false}
          axisLine={{ stroke: chartColors.grid }}
          interval="preserveStartEnd"
          minTickGap={16}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v: number) => `$${v}`}
        />
        <Tooltip
          cursor={{ stroke: chartColors.grid }}
          content={<ChartTooltip valueFormatter={formatMoney} />}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke={chartColors.primary}
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function StatusChart({ data }: { data: AnalyticsOverview['statusMix'] }) {
  const chartData = data.map((slice) => ({
    name: BOOKING_STATUS_META[slice.status].label,
    value: slice.count,
    fill: STATUS_FILL[slice.status],
  }))

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <ResponsiveContainer width="100%" height={200} className="max-w-[220px]">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={2}
            stroke="var(--surface)"
            strokeWidth={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex flex-1 flex-col gap-1.5">
        {chartData.map((entry) => (
          <li
            key={entry.name}
            className="flex items-center gap-2 text-[13px] text-muted-foreground"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span>{entry.name}</span>
            <span className="ml-auto font-medium text-foreground">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NamedBarChart({
  data,
  emptyLabel,
}: {
  data: AnalyticsOverview['staff']
  emptyLabel: string
}) {
  if (data.length === 0) {
    return (
      <EmptyState className="border-0" icon="bar_chart" title={emptyLabel} />
    )
  }
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 40)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={96}
        />
        <Tooltip
          cursor={{ fill: 'var(--surface-muted)' }}
          content={<ChartTooltip />}
        />
        <Bar
          dataKey="count"
          name="Bookings"
          fill={chartColors.primary}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsPage() {
  const [days, setDays] = useState(7)
  const analytics = useAnalytics(days)

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Utilization, revenue, and performance."
        actions={
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            {RANGES.map((range) => (
              <Button
                key={range.days}
                size="sm"
                variant={days === range.days ? 'primary' : 'ghost'}
                onClick={() => setDays(range.days)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        }
      />

      <QueryState query={analytics} loadingLabel="Crunching numbers…">
        {(data) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Total bookings"
                value={data.totals.bookings}
                icon="event"
              />
              <StatCard
                label="Revenue collected"
                value={formatMoney(data.totals.revenue)}
                icon="payments"
              />
              <StatCard
                label="Completion rate"
                value={formatPercent(data.totals.completedRate)}
                icon="task_alt"
              />
              <StatCard
                label="No-show rate"
                value={formatPercent(data.totals.noShowRate)}
                icon="person_off"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader title="Bookings per day" />
                <CardBody>
                  <BookingsChart data={data.perDay} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Revenue per day" />
                <CardBody>
                  <RevenueChart data={data.perDay} />
                </CardBody>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader title="Booking status mix" />
                <CardBody>
                  <StatusChart data={data.statusMix} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Staff performance" />
                <CardBody>
                  <NamedBarChart
                    data={data.staff}
                    emptyLabel="No staff activity yet"
                  />
                </CardBody>
              </Card>
            </div>

            <Card>
              <CardHeader title="Resource utilization" />
              <CardBody>
                <NamedBarChart
                  data={data.resources}
                  emptyLabel="No resource activity yet"
                />
              </CardBody>
            </Card>
          </div>
        )}
      </QueryState>
    </>
  )
}
