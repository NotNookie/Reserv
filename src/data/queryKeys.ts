import type { BookingFilters, InvoiceFilters } from './services'

/** Centralized, typed query keys for React Query cache management. */
export const queryKeys = {
  customers: ['customers'] as const,
  customer: (id: string) => ['customers', id] as const,
  staff: ['staff'] as const,
  staffMember: (id: string) => ['staff', id] as const,
  resources: ['resources'] as const,
  resource: (id: string) => ['resources', id] as const,
  services: ['services'] as const,
  bookings: (filters?: BookingFilters) =>
    ['bookings', 'list', filters ?? {}] as const,
  booking: (id: string) => ['bookings', 'detail', id] as const,
  invoices: (filters?: InvoiceFilters) =>
    ['invoices', 'list', filters ?? {}] as const,
  invoice: (id: string) => ['invoices', 'detail', id] as const,
}
