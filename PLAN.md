# Reserv — Implementation Plan

> **Reserv** is a generic, domain-neutral reservation & booking management system.
> Built as a production-grade React SPA. This document is the single source of truth
> for scope, architecture, and phased delivery.

---

## 1. Product overview

Reserv manages the full lifecycle of resource bookings for any business that
schedules customers into time slots and physical resources (rooms, stations, equipment).

**Core domain entities**

| Entity                           | Meaning                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Booking** (a.k.a. Reservation) | A customer reserved into a resource for a time range, with a status.                                         |
| **Customer**                     | The person the booking is for (was "Patient").                                                               |
| **Staff**                        | Team member assigned to / performing the booking (was "Physician").                                          |
| **Resource**                     | Bookable room / station / unit (was "Room").                                                                 |
| **Invoice / Payment**            | Billing attached to a booking.                                                                               |
| **Service**                      | Catalog of bookable offerings (duration, price). **In scope** — every major booking product centers on this. |

**Booking shape (research-backed):**

- A booking references **one customer**, **one service**, an **optional staff** member, and a time range.
- Resources are linked via a **`booking → resources` junction** so a booking can hold multiple resources later without a breaking change (hotel-system pattern), even though the UI starts single-resource.
- Scheduled `startAt`/`endAt` are stored **separately** from actual `checkInAt`/`checkOutAt` (occupancy vs. reservation — hotel pattern; also powers the "Arrived/check-in" flow in the dashboard).
- **Statuses:** `Pending → Confirmed → Arrived → Completed`, plus `Cancelled` and `NoShow` (modeled on Cal.com's `PENDING/ACCEPTED/CANCELLED/REJECTED` + hotel occupancy states).

Vocabulary is **truly generic** — no vertical-specific terms baked into the core.

---

## 2. Modules

| Module         | Route                          | Primary reference                      | Notes                                                        |
| -------------- | ------------------------------ | -------------------------------------- | ------------------------------------------------------------ |
| Dashboard      | `/`                            | `final_integrated_dashboard`           | KPIs, today's bookings, quick actions                        |
| Bookings       | `/bookings`                    | `booking_request_list`                 | List, filter, statuses (confirmed/pending/cancelled/arrived) |
| Booking detail | `/bookings/:id`                | `reservation_detail_view`              | Full record + actions                                        |
| Calendar       | `/calendar`                    | `scheduling_calendar`                  | Day/week scheduling grid                                     |
| Resources      | `/resources`                   | `final_room_management_view`           | Room/resource status & workload                              |
| Customers      | `/customers`, `/customers/:id` | `spa.html` patients                    | List + detail record                                         |
| Staff          | `/staff`, `/staff/:id`         | staff performance screens              | Directory + profile                                          |
| Billing        | `/billing`                     | `spa.html` payments                    | Invoices & payments                                          |
| Analytics      | `/analytics`                   | throughput / staff performance reports | Utilization, throughput, staff perf (charts)                 |
| Settings       | `/settings`                    | `spa.html` settings                    | App/business config                                          |

**Dropped (medical-specific):** Labs, Medicines, Diagnostics, HMO, Promissory notes.
`spa.html` is retained only as a styling/interaction-pattern reference.

---

## 3. Tech stack

| Concern         | Choice                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build/Framework | Vite + React 19 + TypeScript (strict)                                                                                                                         |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`)                                                                                                                         |
| Design tokens   | Ported from `clinical_precision/DESIGN.md` into the Tailwind theme (CSS variables); light + dark                                                              |
| Routing         | `react-router-dom` (data router)                                                                                                                              |
| Data            | Mock only, behind an **async service/repository layer** (Promises, latency sim, loading/error states) — swappable for a real API with zero component rewrites |
| Server state    | `@tanstack/react-query` for fetching/caching/loading/error (pairs with the async service layer)                                                               |
| Icons           | Material Symbols Outlined                                                                                                                                     |
| Fonts           | Inter (UI) + Courier Prime (mono/codes)                                                                                                                       |
| Charts          | `recharts` (Analytics only)                                                                                                                                   |
| Testing         | Vitest + React Testing Library + `@testing-library/jest-dom`                                                                                                  |
| Formatting/Lint | Prettier + existing ESLint (typescript-eslint)                                                                                                                |

---

## 4. Project structure

```
src/
  main.tsx                    # bootstraps router + providers
  app/
    App.tsx                   # <RouterProvider>
    router.tsx                # route definitions
    providers.tsx             # QueryClient, Theme, ErrorBoundary
  styles/
    theme.css                 # Tailwind import + design tokens (CSS vars)
  components/
    ui/                       # primitives: Button, Badge, Card, StatCard,
                              # Table, Modal, Drawer, Input, Select, FormField,
                              # Toast, Spinner, EmptyState, Icon
    layout/                   # AppShell, Sidebar, Topbar, PageHeader
  lib/
    cn.ts                     # class-merge helper
    format.ts                 # date/money/initials helpers
    query.ts                  # queryClient config
  data/
    types.ts                  # domain types (Booking, Customer, Staff, Resource…)
    mock/                     # seed datasets
    services/                 # bookingService, customerService, … (async repos)
  features/
    dashboard/  bookings/  calendar/  resources/
    customers/  staff/  billing/  analytics/  settings/
      # each: components/, hooks/, <Feature>Page.tsx, __tests__/
  test/
    setup.ts                  # RTL/vitest setup
```

**Conventions**

- Path aliases: `@/` → `src/` (tsconfig + vite).
- Each feature owns its pages, hooks, and tests (feature-first, not layer-first).
- Services return typed Promises; components consume them via React Query hooks.
- All interactive UI is keyboard-accessible with proper ARIA; focus rings per design tokens.
- Error boundaries at app + route level; every async view has loading + error + empty states.

---

## 5. Phased delivery

Each phase is independently reviewable and leaves the app in a working state.

### Phase 0 — Foundation

- Remove Vite template artifacts (counter, demo assets).
- Install & configure Tailwind v4, react-router, react-query, prettier, vitest + RTL.
- Path aliases, strict TS, prettier config, test setup.
- Port `DESIGN.md` tokens → `theme.css` (colors, typography, radii, spacing, status palette, dark mode).
- Build **AppShell**: Sidebar (with collapse), Topbar, content region, theme toggle.
- Build **UI kit**: Button, Badge, Card, StatCard, Table, Modal, Input, Select, FormField, Toast, Spinner, EmptyState, Icon — each with a smoke test.
- App-level ErrorBoundary + 404 route.

### Phase 1 — Reservations/ops core (highest-value, most-polished designs)

- Domain types + mock seeds + services for Booking, Customer(lite), Staff(lite), Resource.
- **Dashboard**, **Bookings list**, **Booking detail**, **Calendar**, **Resources**.
- React Query hooks; loading/error/empty states; status badges; filters.

### Phase 2 — Customers & Staff

- Customers list + detail; Staff directory + profile.
- Full mock services; cross-links from bookings.

### Phase 3 — Billing

- Invoices & payments list; payment status; link to bookings/customers.

### Phase 4 — Analytics

- `recharts` reports: utilization, throughput, staff performance.
- Settings page.

### Phase 5 — Polish & hardening

- Responsive: tablet (collapsed 56px sidebar), mobile reflow + bottom nav.
- Accessibility audit (keyboard, ARIA, contrast), focus management in modals.
- Test coverage for key flows (create/edit booking, filter, navigation).
- Empty/loading/error polish; toasts; final visual QA vs. Stitch screens.

---

## 6. Definition of done (per feature)

- Typed end-to-end (no `any`); passes `tsc` strict + ESLint + Prettier.
- Loading, error, and empty states implemented.
- Keyboard accessible; visible focus; correct ARIA roles/labels.
- Light + dark mode correct.
- Tests: UI primitives unit-tested; feature has at least one interaction test.
- Matches the reference design within reason (tokens, spacing, states).

---

## 7. Open/assumed defaults (change anytime)

- Product name: **Reserv**; sidebar subtitle "Reservation System" (adjustable).
- Truly generic vocabulary (no vertical lock-in).
- **Booking model, times, statuses, availability rules:** see §1 (research-backed defaults).
- **No auth** in the mock (single operator). Role-based dashboards are a realistic later extension, not built now.
- Availability enforced in the service layer (just-in-time no-overlap check per resource/staff).

## 8. Reference systems studied

Defaults above are grounded in how established products model reservations, not guesses:

- **Cal.com** (open-source) — booking status lifecycle and event-type/service model.
- **Acuity / SimplyBook.me** — service catalog, intake forms, recurring bookings, payments.
- **Calendly** — availability rules, time-zone handling, slot-based scheduling.
- **Hotel reservation data models** — multi-resource reservations via junction table, status-per-resource, and separation of scheduled reservation from actual occupancy (check-in/check-out); double-booking prevention via just-in-time availability validation.

Sources:

- https://github.com/calcom/cal.com/blob/main/packages/prisma/schema.prisma
- https://cal.com/blog/calendly-vs-acuity-a-comparative-guide-to-scheduling-tools
- https://www.red-gate.com/blog/designing-a-data-model-for-a-hotel-room-booking-system/
- https://bytebytego.com/courses/system-design-interview/hotel-reservation-system
