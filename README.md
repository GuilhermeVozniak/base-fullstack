# base-fullstack

A production-ready full-stack monorepo scaffold for building type-safe web applications. Clone and start shipping.

## Stack

**Backend** — [Elysia](https://elysiajs.com/) on [Bun](https://bun.sh/) with [Drizzle ORM](https://orm.drizzle.team/) and [PostgreSQL](https://www.postgresql.org/)

**Frontend** — [Next.js 16](https://nextjs.org/) with [React 19](https://react.dev/), [TanStack Query](https://tanstack.com/query), and [Tailwind CSS 4](https://tailwindcss.com/)

**Auth** — [Better Auth](https://www.better-auth.com/) with email/password, secure sessions, and admin support

**Shared** — End-to-end type safety via [Eden Treaty](https://elysiajs.com/eden/treaty/overview) and a shared types package

## Monorepo Structure

```
base-fullstack/
├── backend/            Elysia API server
├── web/                Next.js frontend
├── packages/
│   └── shared/         Shared TypeScript types
├── .github/            CI/CD workflows
└── base-fullstack.code-workspace
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USER/base-fullstack.git
cd base-fullstack

# Start the backend
cd backend
cp .env.example .env
bun install
docker compose up -d
bun run db:migrate
bun run dev

# In a new terminal, start the frontend
cd web
bun install
bun run dev
```

The backend runs at `http://localhost:3333` and the frontend at `http://localhost:3000`.

## What's Included

### Backend

- **Elysia** HTTP framework with plugin-based architecture
- **Better Auth** with email/password, session management, and admin plugin
- **Drizzle ORM** with PostgreSQL, migrations, and seeding
- **Structured logging** via Pino with request IDs for tracing
- **Security**: CORS, CSRF protection, rate limiting, input sanitization
- **OpenAPI** auto-generated schema from auth endpoints
- **Testing**: unit tests, integration tests, and repository tests with test containers
- **Docker** setup for both development (hot reload + debugger) and production (multi-stage slim image)

### Frontend

- **Next.js 16** with App Router and standalone output for Docker
- **Eden Treaty** type-safe API client — autocomplete on every backend route
- **TanStack Query** with custom `useApiQuery` and `useApiMutation` hooks
- **Better Auth** session middleware — protects routes, redirects to login
- **Internationalization** via next-intl (English and Portuguese included)
- **UI**: Radix UI + shadcn/ui components, dark mode via next-themes
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Storybook** for component development and documentation

### Shared Types

The `@base-fullstack/shared` package provides end-to-end type safety without any runtime code:

```typescript
// web/lib/api.ts
import type { App } from "@base-fullstack/shared"
import { treaty } from "@elysiajs/eden"

export const api = treaty<App>(env.NEXT_PUBLIC_API_URL)
// Full autocomplete: api.users[":id"].get(), api.health.get(), etc.
```

Types are resolved via TypeScript path aliases — no `npm link` or build step needed.

### CI/CD

GitHub Actions workflows with path-based triggers:

**Backend CI** — lint, typecheck, unit tests, integration tests (with Postgres service)

**Web CI** — lint, typecheck, unit tests, Next.js build, Playwright E2E

Both workflows use Bun, dependency caching, and concurrency groups to cancel stale runs.

### Developer Experience

- **Biome** for linting and formatting (fast, zero-config)
- **Lefthook** git hooks: pre-commit (lint + unit tests), commit-msg (conventional commits), pre-push (full tests)
- **Commitlint** enforcing [Conventional Commits](https://www.conventionalcommits.org/)
- **Dependabot** for automated dependency updates
- **VS Code workspace** with recommended extensions and shared settings

## Scripts

### Backend

| Script | Description |
|---|---|
| `bun run dev` | Start with hot reload |
| `bun run check` | Lint + format (Biome) |
| `bun run typecheck` | TypeScript check |
| `bun run test` | Run all tests |
| `bun run test:unit` | Unit tests only |
| `bun run test:int` | Integration tests |
| `bun run test:repo` | Repository tests |
| `bun run db:generate` | Generate migration |
| `bun run db:migrate` | Apply migrations |
| `bun run db:seed` | Seed dev data |

### Frontend

| Script | Description |
|---|---|
| `bun run dev` | Start Next.js dev server |
| `bun run build` | Production build |
| `bun run check` | Lint + format (Biome) |
| `bun run typecheck` | TypeScript check |
| `bun run test` | Run unit tests |
| `bun run storybook` | Start Storybook |

## Docker

```bash
# Development (backend + postgres with hot reload)
cd backend && docker compose up

# Production (backend)
cd backend && docker compose -f docker-compose.prod.yml up

# Production (frontend) — build from monorepo root
docker build -f web/Dockerfile -t base-fullstack-web .
```

## License

MIT
