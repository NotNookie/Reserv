export { customerService } from './customerService'
export { staffService } from './staffService'
export { resourceService } from './resourceService'
export { serviceCatalog } from './serviceCatalog'
export {
  bookingService,
  BookingConflictError,
  type BookingFilters,
  type AvailabilityQuery,
  type AvailabilityResult,
} from './bookingService'
export { invoiceService, type InvoiceFilters } from './invoiceService'
export {
  analyticsService,
  type AnalyticsOverview,
  type DayPoint,
  type StatusSlice,
  type NamedCount,
} from './analyticsService'
