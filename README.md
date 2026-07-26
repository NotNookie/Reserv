# Reserv

A generic, domain-neutral **reservation & booking management system**, built as a
production-grade single-page app.

## Tech stack

- **Vite + React 19 + TypeScript** (strict)
- **Tailwind CSS v4** with a semantic design-token theme (light + dark)
- **react-router** for routing, **TanStack React Query** for server state
- **Async service/repository layer** over mock data — swappable for a real API
  with no component rewrites
- **Vitest + React Testing Library** for tests

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build        |
| `npm run test`      | Run the test suite (watch)          |
| `npm run test:run`  | Run the test suite once             |
| `npm run typecheck` | Type-check without emitting         |
| `npm run lint`      | Lint the project                    |
| `npm run format`    | Format with Prettier                |

## Features

- **Dashboard** — daily KPIs and today's schedule
- **Bookings** — filterable list, detail view, and create/edit with
  double-booking prevention
- **Calendar** — day view across resources
- **Resources** — availability and workload management

See [PLAN.md](PLAN.md) for the full architecture and phased roadmap.
