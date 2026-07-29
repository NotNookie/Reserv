import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { NotFoundPage } from './NotFoundPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { BookingsPage } from '@/features/bookings/BookingsPage'
import { BookingDetailPage } from '@/features/bookings/BookingDetailPage'
import { CalendarPage } from '@/features/calendar/CalendarPage'
import { ResourcesPage } from '@/features/resources/ResourcesPage'
import { CustomersPage } from '@/features/customers/CustomersPage'
import { CustomerDetailPage } from '@/features/customers/CustomerDetailPage'
import { StaffPage } from '@/features/staff/StaffPage'
import { StaffDetailPage } from '@/features/staff/StaffDetailPage'
import { BillingPage } from '@/features/billing/BillingPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'bookings/:id', element: <BookingDetailPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'staff/:id', element: <StaffDetailPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
