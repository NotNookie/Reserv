import { createContext, use } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  /** Auto-dismiss delay in ms. Defaults to 4000. */
  duration?: number
}

export interface ToastContextValue {
  show: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = use(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
