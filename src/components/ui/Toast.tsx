import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import {
  ToastContext,
  type Toast,
  type ToastOptions,
  type ToastTone,
  type ToastContextValue,
} from './toast-context'

const toneConfig: Record<ToastTone, { icon: string; className: string }> = {
  success: { icon: 'check_circle', className: 'text-status-confirmed' },
  error: { icon: 'error', className: 'text-status-cancelled' },
  info: { icon: 'info', className: 'text-accent-blue' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    ({ title, description, tone = 'info', duration = 4000 }: ToastOptions) => {
      const id = ++counter.current
      setToasts((prev) => [...prev, { id, title, description, tone }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(() => ({ show }), [show])

  return (
    <ToastContext value={value}>
      {children}
      {createPortal(
        <div
          className="fixed right-4 bottom-4 z-60 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
          role="region"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((toast) => {
            const config = toneConfig[toast.tone]
            return (
              <div
                key={toast.id}
                role="status"
                className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3 shadow-lg"
              >
                <Icon
                  name={config.icon}
                  className={cn('text-[20px]', config.className)}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="rounded p-0.5 text-subtle-foreground transition-colors hover:text-foreground"
                >
                  <Icon name="close" className="text-base" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext>
  )
}
