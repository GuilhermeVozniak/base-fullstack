# Setup

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Backend API running (see `backend/` in the monorepo root)

## Monorepo Layout

This project is part of the `base-fullstack` monorepo:

```
base-fullstack/
├── backend/          ← Elysia API server
├── packages/
│   └── shared/       ← Shared TypeScript types
└── web/              ← this package (Next.js frontend)
```

The `@base-fullstack/shared` package provides end-to-end type safety between the backend Elysia API and the frontend Eden Treaty client. It uses TypeScript path aliases — no `npm install` needed.

### How Type Resolution Works

The web's `tsconfig.json` is configured to:

1. Map `@base-fullstack/shared` → `../packages/shared/index.ts` (path alias)
2. Map `@/*` → `./*` with fallback to `../backend/src/*` (resolves backend's path aliases)
3. Map `elysia` → `../backend/node_modules/elysia/dist/` (unifies Elysia types across repos)
4. Include `../packages/shared/**/*.ts` in the compilation scope

This allows `tsc` to follow the type chain: `web → shared → backend` without a build step.

## Getting Started

```bash
# Install dependencies
bun install

# Copy environment file and configure
cp .env.example .env.local

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable                       | Description                           | Default                 |
| ------------------------------ | ------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`          | Backend API URL                       | `http://localhost:3333` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domain (optional) | —                       |
| `NEXT_PUBLIC_PLAUSIBLE_URL`    | Plausible instance URL (optional)     | `https://plausible.io`  |

Environment variables are validated at build time via `@t3-oss/env-nextjs` in `lib/env.ts`. See `.env.example` for reference.

## Scripts

| Script                    | Description                             |
| ------------------------- | --------------------------------------- |
| `bun run dev`             | Start development server                |
| `bun run build`           | Build for production                    |
| `bun run start`           | Start production server                 |
| `bun run lint`            | Lint with Biome                         |
| `bun run lint:fix`        | Lint and auto-fix with Biome            |
| `bun run format`          | Format with Biome                       |
| `bun run check`           | Full Biome check (lint + format)        |
| `bun run typecheck`       | TypeScript type checking                |
| `bun run test`            | Run unit tests (bun test)               |
| `bun run test:coverage`   | Run tests with coverage reporting       |
| `bun run storybook`       | Start Storybook dev server on port 6006 |
| `bun run build-storybook` | Build static Storybook                  |

## Git Hooks

This project uses **Lefthook** for pre-commit and commit-msg hooks.

- **pre-commit** — runs `biome check --write` on staged files and re-stages fixes
- **commit-msg** — enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint

Hooks are installed automatically on `bun install` via the `postinstall` script.
