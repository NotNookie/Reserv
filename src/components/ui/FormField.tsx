import { useId, type ReactElement, cloneElement } from 'react'
import { cn } from '@/lib/cn'

export interface FormFieldProps {
  label: string
  /** A single form control (Input, Select, textarea, …). */
  children: ReactElement<{
    id?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }>
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

/**
 * Labelled form control wrapper. Wires up `id`/`htmlFor` and
 * `aria-describedby` for hints and errors automatically.
 */
export function FormField({
  label,
  children,
  hint,
  error,
  required,
  className,
}: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-status-cancelled">*</span>}
      </label>
      {cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      {error ? (
        <p id={errorId} className="text-[11px] text-status-cancelled">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[11px] text-subtle-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
