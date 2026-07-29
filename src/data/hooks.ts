import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import {
  bookingService,
  customerService,
  resourceService,
  serviceCatalog,
  staffService,
  type BookingFilters,
} from './services'
import type {
  BookingStatus,
  CreateBookingInput,
  ResourceStatus,
  UpdateBookingInput,
} from './types'

/* ----------------------------- Entity queries ---------------------------- */

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers,
    queryFn: () => customerService.list(),
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => customerService.getById(id),
    enabled: Boolean(id),
  })
}

export function useStaff() {
  return useQuery({
    queryKey: queryKeys.staff,
    queryFn: () => staffService.list(),
  })
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: queryKeys.staffMember(id),
    queryFn: () => staffService.getById(id),
    enabled: Boolean(id),
  })
}

export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources,
    queryFn: () => resourceService.list(),
  })
}

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: () => serviceCatalog.list(),
  })
}

/* ---------------------------- Booking queries ---------------------------- */

export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: queryKeys.bookings(filters),
    queryFn: () => bookingService.list(filters),
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => bookingService.getById(id),
    enabled: Boolean(id),
  })
}

/* --------------------------- Booking mutations --------------------------- */

function useInvalidateBookings() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['bookings'] })
    void qc.invalidateQueries({ queryKey: queryKeys.resources })
  }
}

export function useCreateBooking() {
  const invalidate = useInvalidateBookings()
  return useMutation({
    mutationFn: (input: CreateBookingInput) => bookingService.create(input),
    onSuccess: invalidate,
  })
}

export function useUpdateBooking() {
  const invalidate = useInvalidateBookings()
  return useMutation({
    mutationFn: (args: { id: string; input: UpdateBookingInput }) =>
      bookingService.update(args.id, args.input),
    onSuccess: invalidate,
  })
}

export function useSetBookingStatus() {
  const invalidate = useInvalidateBookings()
  return useMutation({
    mutationFn: (args: { id: string; status: BookingStatus }) =>
      bookingService.setStatus(args.id, args.status),
    onSuccess: invalidate,
  })
}

export function useUpdateResourceStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { id: string; status: ResourceStatus }) =>
      resourceService.updateStatus(args.id, args.status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.resources })
    },
  })
}
