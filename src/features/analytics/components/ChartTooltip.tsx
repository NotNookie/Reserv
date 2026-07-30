interface TooltipEntry {
  name?: string | number
  value?: string | number
  color?: string
  payload?: { fill?: string }
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  valueFormatter?: (value: number) => string
}

/** Token-styled replacement for the default recharts tooltip. */
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs shadow-md">
      {label != null && (
        <p className="mb-1 font-semibold text-foreground">{label}</p>
      )}
      {payload.map((entry, i) => {
        const swatch = entry.color ?? entry.payload?.fill
        const value =
          typeof entry.value === 'number' && valueFormatter
            ? valueFormatter(entry.value)
            : entry.value
        return (
          <div
            key={i}
            className="flex items-center gap-2 text-muted-foreground"
          >
            {swatch && (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: swatch }}
              />
            )}
            {entry.name != null && <span>{entry.name}</span>}
            <span className="ml-auto pl-3 font-medium text-foreground">
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
