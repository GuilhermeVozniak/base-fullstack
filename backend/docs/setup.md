# Setup

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Getting Started

```bash
# Install dependencies
bun install

# Copy environment file and configure
cp .env.example .env

# Start database
docker compose up -d

# Run migrations
bun run db:migrate

# Seed the database (optional, for development)
bun run db:seed

# Start development server
bun run dev
```

The server will be running at `http://localhost:3333`.

## Environment Variables

| Variable              | Description                          | Default                 |
| --------------------- | ------------------------------------ | ----------------------- |
| `PORT`                | Server port                          | `3333`                  |
| `BETTER_AUTH_URL`     | Base URL of the app (for auth)       | —                       |
| `BETTER_AUTH_SECRET`  | Secret key for Better Auth           | —                       |
| `POSTGRES_HOST`       | PostgreSQL host                      | `localhost`             |
| `POSTGRES_PORT`       | PostgreSQL port                      | `5433`                  |
| `POSTGRES_DB`         | Database name                        | `base-fullstack`        |
| `POSTGRES_USER`       | Database user                        | `base-fullstack`        |
| `POSTGRES_PASSWORD`   | Database password                    | —                       |
| `CORS_ORIGIN`         | Allowed CORS origin                  | `http://localhost:3000` |

All variables are validated at startup via Zod in `src/env.ts`. See `.env.example` for reference.

## Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `bun run dev`           | Start development server with hot reload |
| `bun run lint`          | Lint source files with Biome             |
| `bun run format`        | Format source files with Biome           |
| `bun run check`         | Lint + format checks with Biome          |
| `bun run typecheck`     | TypeScript type checking                 |
| `bun run test`          | Run all tests                            |
| `bun run test:unit`     | Run unit tests only                      |
| `bun run test:int`      | Run integration tests                    |
| `bun run test:repo`     | Run repository tests                     |
| `bun run test:coverage` | Run tests with coverage reporting        |
| `bun run db:generate`   | Generate migration from schema changes   |
| `bun run db:migrate`    | Apply pending migrations                 |
| `bun run db:seed`       | Seed the database with dev data          |

## Git Hooks

This project uses **Lefthook** to run checks before commits/pushes.

- **pre-commit**
  - Runs `biome check --write` on staged files and re-stages any auto-fixes
  - Runs unit tests (`bun run test:unit`)
- **commit-msg**
  - Enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint
- **pre-push**
  - Runs the full test suite (`bun run test`)

Hooks are installed automatically on `bun install` via the `postinstall` script.
