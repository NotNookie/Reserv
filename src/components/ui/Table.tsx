import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react'
import { cn } from '@/lib/cn'

/** Horizontally-scrollable wrapper so wide tables never break the layout. */
export function TableContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />
}

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn('w-full border-collapse text-[13px]', className)}
      {...props}
    />
  )
}

export function Th({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        'border-b border-border px-3 py-2 text-left text-[11px] font-semibold whitespace-nowrap text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function Td({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'border-b border-border px-3 py-2.5 align-middle',
        className,
      )}
      {...props}
    />
  )
}

/** Body row with hover affordance. */
export function Tr({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors last:[&>td]:border-b-0 hover:bg-surface-muted',
        className,
      )}
      {...props}
    />
  )
}
