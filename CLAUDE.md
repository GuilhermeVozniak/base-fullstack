# CLAUDE.md — base-fullstack

## Project Overview

Production-ready full-stack monorepo scaffold. Elysia (Bun) backend + Next.js 16 frontend + shared types for end-to-end type safety via Eden Treaty.

## Monorepo Layout

```
base-fullstack/
├── backend/            Elysia API (Bun runtime)
├── web/                Next.js 16 + React 19
├── packages/shared/    Shared TypeScript types (types-only, no runtime)
└── .github/            CI/CD workflows
```

## Tech Stack

- **Backend**: Elysia 1.4 on Bun, Better Auth, Drizzle ORM, PostgreSQL 17, Zod 4
- **Frontend**: Next.js 16, React 19, TanStack Query, Eden Treaty, Tailwind CSS 4, shadcn/ui
- **Shared**: TypeScript path aliases — no build step, no npm link
- **Tooling**: Biome (lint/format), Lefthook (git hooks), Commitlint (conventional commits)

## Key Architectural Patterns

### Backend Module Structure

Every feature follows handler → service → repository layering:

```
backend/src/modules/<feature>/
├── routes.ts                  Route definitions (Elysia groups)
├── handler/
│   ├── handler.ts             HTTP handler + error mapping
│   └── schemas.ts             Zod request/response schemas
├── service/
│   ├── service.ts             Business logic
│   ├── dtos.ts                Data transfer objects
│   └── errors.ts              Custom error classes
├── repository/
│   ├── repository.ts          Data access (Drizzle queries)
│   └── types.ts               Repository type definitions
└── __tests__/
    ├── handler.test.ts        Unit tests
    ├── service.int.test.ts    Integration tests
    └── repository.repository.int.test.ts  DB tests
```

### Plugin Chain (order matters)

requestId → logger → errorHandler → rateLimiter → openapi → cors → csrf → sanitize → betterAuthPlugin → routes

### End-to-End Type Safety

```
backend/src/http/server.ts  →  exports type App
packages/shared/index.ts    →  re-exports App
web/lib/api.ts              →  treaty<App>(url) creates typed client
```

The web `tsconfig.json` maps `@base-fullstack/shared` → `../packages/shared/index.ts` via path aliases.

### Authentication Flow

1. Better Auth handles `/auth/*` endpoints (email/password, sessions)
2. Backend `auth` macro validates session from cookies on protected routes
3. Frontend middleware checks `better-auth.session_token` cookie
4. CORS configured with `credentials: true` for cookie passthrough

## Coding Conventions

### Formatting (Biome)

- **Indent**: 2 spaces
- **Quotes**: double quotes
- **Semicolons**: as needed (omit when possible)
- **Line width**: 100 characters
- **Trailing commas**: ES5 style
- **Line endings**: LF

### Naming

- **Files**: `kebab-case.ts`
- **Functions/variables**: `camelCase`
- **Types/interfaces**: `PascalCase`
- **Constants**: `camelCase` or `UPPER_SNAKE_CASE` for env vars
- **DB columns**: `snake_case` (Drizzle casing config)
- **Test files**: `*.test.ts` (unit), `*.int.test.ts` (integration), `*.repository.int.test.ts` (repo)

### Commits

Conventional Commits required (enforced by commitlint):
```
feat: add user profile endpoint
fix: correct session expiry check
refactor: extract auth middleware
docs: update setup instructions
test: add integration tests for users
chore: bump dependencies
```

### Imports

- Use `@/*` path alias in both backend (`./src/*`) and web (`./*`)
- Use `@base-fullstack/shared` for shared types
- Type imports: always use `import type { ... }` for types-only imports

## Running the Project

```bash
# Backend
cd backend && bun install && docker compose up -d && bun run db:migrate && bun run dev

# Frontend
cd web && bun install && bun run dev
```

Backend: http://localhost:3333 (Swagger at /swagger)
Frontend: http://localhost:3000

## Testing

### Backend

```bash
bun run test:unit    # Unit tests (mocked dependencies)
bun run test:int     # Integration tests (real HTTP, mocked DB)
bun run test:repo    # Repository tests (real PostgreSQL via docker)
bun run test         # All tests
```

- Unit tests mock modules with `mockModuleWithMutableExports`
- Integration tests use treaty client with test auth plugin
- Repository tests use a real Postgres container (port 5433)

### Frontend

```bash
bun run test         # Vitest unit tests
bunx playwright test # E2E tests (requires dev server)
```

## Database

```bash
bun run db:generate  # Generate migration from schema changes
bun run db:migrate   # Apply pending migrations
bun run db:seed      # Seed development data
```

- Schema files: `backend/src/database/schema/`
- Migrations: `backend/src/database/migrations/`
- Always use `snake_case` for DB column names (Drizzle casing config handles mapping)

## Common Tasks

### Adding a New Backend Module

1. Create directory structure under `backend/src/modules/<name>/`
2. Define Drizzle schema in `backend/src/database/schema/<name>.ts`
3. Export schema from `backend/src/database/schema/index.ts`
4. Create repository → service → handler → routes
5. Register routes in `backend/src/http/routes/index.ts`
6. Generate migration: `bun run db:generate`
7. The `App` type auto-updates — frontend gets new routes for free

### Adding a New Frontend Page

1. Create route in `web/app/<path>/page.tsx`
2. Add translations in `web/messages/en.json` and `web/messages/pt.json`
3. Use `useApiQuery`/`useApiMutation` hooks for API calls
4. Protect route by default (middleware handles auth redirect)

### Adding UI Components

Use shadcn/ui CLI: `bunx shadcn@latest add <component>`
Components go in `web/components/ui/`

## Environment Variables

### Backend (.env)

```
BETTER_AUTH_URL=http://localhost:3333
BETTER_AUTH_SECRET=<random-secret>
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=base-fullstack
POSTGRES_USER=base-fullstack
POSTGRES_PASSWORD=base-fullstack_password
PORT=3333
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## CI/CD

Two workflows triggered by path changes:
- `backend-ci.yml`: lint → typecheck → unit tests → integration tests (Postgres service)
- `web-ci.yml`: lint → typecheck → unit tests → build → Playwright E2E

## Do NOT

- Import runtime code from `@base-fullstack/shared` (types only, erased at compile time)
- Skip the handler → service → repository layering
- Use `any` without justification (Biome warns)
- Commit `.env` files (only `.env.example`)
- Use `npm` or `yarn` (this project uses `bun` exclusively)
- Modify migration files after they've been applied
