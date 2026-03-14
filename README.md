<p align="center">
  <img src="docs/assets/hero.png" alt="base-fullstack" width="100%" />
</p>

<h1 align="center">base-fullstack</h1>

<p align="center">
  <strong>A production-ready full-stack monorepo scaffold for type-safe web apps.</strong><br/>
  Clone it. Ship it.
</p>

<p align="center">
  <a href="https://github.com/GuilhermeVozniak/base-fullstack/actions"><img src="https://github.com/GuilhermeVozniak/base-fullstack/actions/workflows/backend-ci.yml/badge.svg" alt="Backend CI" /></a>
  <a href="https://github.com/GuilhermeVozniak/base-fullstack/actions"><img src="https://github.com/GuilhermeVozniak/base-fullstack/actions/workflows/web-ci.yml/badge.svg" alt="Web CI" /></a>
  <a href="https://github.com/GuilhermeVozniak/base-fullstack/blob/main/LICENSE"><img src="https://img.shields.io/github/license/GuilhermeVozniak/base-fullstack" alt="License" /></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#stack">Stack</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#scripts">Scripts</a> &bull;
  <a href="#docker">Docker</a> &bull;
  <a href="#claude-code-integration">Claude Code</a>
</p>

---

## Stack

| Layer | Tech |
|---|---|
| **Runtime** | [Bun](https://bun.sh/) |
| **Backend** | [Elysia](https://elysiajs.com/) &middot; [Drizzle ORM](https://orm.drizzle.team/) &middot; [PostgreSQL 17](https://www.postgresql.org/) &middot; [Zod 4](https://zod.dev/) |
| **Frontend** | [Next.js 16](https://nextjs.org/) &middot; [React 19](https://react.dev/) &middot; [TanStack Query](https://tanstack.com/query) &middot; [Tailwind CSS 4](https://tailwindcss.com/) &middot; [shadcn/ui](https://ui.shadcn.com/) |
| **Auth** | [Better Auth](https://www.better-auth.com/) — email/password, sessions, admin |
| **Type Safety** | [Eden Treaty](https://elysiajs.com/eden/treaty/overview) — end-to-end types, zero codegen |
| **Tooling** | [Biome](https://biomejs.dev/) &middot; [Lefthook](https://github.com/evilmartians/lefthook) &middot; [Commitlint](https://commitlint.js.org/) &middot; [Playwright](https://playwright.dev/) &middot; [Storybook](https://storybook.js.org/) |
| **AI** | [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — CLAUDE.md, skills, agents, GitHub Action |

## Quick Start

```bash
git clone https://github.com/GuilhermeVozniak/base-fullstack.git
cd base-fullstack

# Backend
cd backend
cp .env.example .env
bun install
docker compose up -d
bun run db:migrate
bun run dev                # http://localhost:3333  (Swagger at /swagger)

# Frontend (new terminal)
cd web
bun install
bun run dev                # http://localhost:3000
```

## Architecture

```
base-fullstack/
├── backend/                 Elysia API server
│   ├── src/
│   │   ├── modules/         Feature modules (handler → service → repository)
│   │   ├── http/            Server, plugins, routes
│   │   ├── database/        Drizzle schema & migrations
│   │   └── auth.ts          Better Auth config
│   ├── docker-compose.yml   Dev (Postgres + hot reload)
│   └── Dockerfile           Production multi-stage build
│
├── web/                     Next.js 16 frontend
│   ├── app/                 App Router pages
│   ├── components/          shadcn/ui + custom components
│   ├── lib/                 API client, hooks, utilities
│   ├── messages/            i18n (en, pt)
│   ├── e2e/                 Playwright tests
│   └── Dockerfile           Production build (monorepo-aware)
│
├── packages/shared/         Shared TypeScript types (zero runtime)
│
├── .claude/                 Claude Code agents, skills & settings
├── .github/                 CI/CD workflows + Claude Code Action
└── CLAUDE.md                Project instructions for Claude
```

### End-to-End Type Safety

```
Backend (Elysia)  ──exports──▶  @base-fullstack/shared  ──imports──▶  Frontend (Eden Treaty)
     App type                      re-exports App                      treaty<App>(url)
```

```typescript
// One line gives you full autocomplete on every backend route
export const api = treaty<App>(env.NEXT_PUBLIC_API_URL)

api.users[":id"].get()     // typed params, typed response
api.health.get()           // no codegen, no build step
```

### Backend Module Pattern

Every feature follows a clean layered architecture:

```
modules/<feature>/
├── routes.ts           Elysia route definitions
├── handler/            HTTP handlers + Zod schemas
├── service/            Business logic + DTOs + custom errors
├── repository/         Drizzle queries + types
└── __tests__/          Unit, integration & repository tests
```

### Security

CORS + CSRF origin validation + rate limiting (100 req/60s) + input sanitization + secure HTTP-only session cookies + request ID tracing.

## Scripts

### Backend (`cd backend`)

| Script | What it does |
|---|---|
| `bun run dev` | Start with hot reload |
| `bun run check` | Biome lint + format |
| `bun run typecheck` | TypeScript check |
| `bun run test` | All tests |
| `bun run test:unit` | Unit tests (mocked) |
| `bun run test:int` | Integration tests (real HTTP) |
| `bun run test:repo` | Repository tests (real Postgres) |
| `bun run db:generate` | Generate Drizzle migration |
| `bun run db:migrate` | Apply migrations |
| `bun run db:seed` | Seed dev data |

### Frontend (`cd web`)

| Script | What it does |
|---|---|
| `bun run dev` | Next.js dev server |
| `bun run build` | Production build |
| `bun run check` | Biome lint + format |
| `bun run typecheck` | TypeScript check |
| `bun run test` | Vitest unit tests |
| `bun run storybook` | Storybook on :6006 |
| `bunx playwright test` | E2E tests |

## Docker

```bash
# Development — backend + Postgres with hot reload
cd backend && docker compose up

# Production — backend
cd backend && docker compose -f docker-compose.prod.yml up

# Production — frontend (build from monorepo root for type access)
docker build -f web/Dockerfile -t base-fullstack-web .
```

## CI/CD

GitHub Actions with **path-based triggers** — only runs what changed:

| Workflow | Jobs | Trigger |
|---|---|---|
| **Backend CI** | Lint, typecheck, unit tests, integration tests (Postgres service) | `backend/**`, `packages/**` |
| **Web CI** | Lint, typecheck, unit tests, build, Playwright E2E | `web/**`, `packages/**` |
| **Claude Code** | AI-powered PR review via `@claude` mention | PRs, issues, comments |

Dependabot keeps dependencies fresh with weekly PRs grouped by type.

## Claude Code Integration

This repo is fully set up for [Claude Code](https://docs.anthropic.com/en/docs/claude-code):

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project context, conventions, architecture — Claude reads this first |
| `.claude/settings.json` | Permissions (allowed/denied tools) |
| `.claude/skills/new-module/` | Scaffold a backend module with one command |
| `.claude/skills/new-page/` | Scaffold a frontend page with i18n |
| `.claude/skills/db-migration/` | Create Drizzle migrations safely |
| `.claude/agents/code-reviewer.md` | Automated code review agent |
| `.claude/agents/test-runner.md` | Run and report test results |
| `.mcp.json` | MCP servers (Postgres, GitHub) |
| `.github/workflows/claude.yml` | GitHub Action — mention `@claude` on any PR |

### Setup

1. Add `ANTHROPIC_API_KEY` to your repo secrets
2. Mention `@claude` on any PR or issue to get AI-powered reviews
3. Use `/new-module users` or `/new-page dashboard` in Claude Code CLI

## License

[MIT](LICENSE) — fork it, ship it, make it yours.
