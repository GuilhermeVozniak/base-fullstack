# base-fullstack Backend

A RESTful API built with **Elysia** framework on **Bun** runtime, featuring authentication via **Better Auth** and **PostgreSQL** database with **Drizzle ORM**.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia](https://elysiajs.com/)
- **Database**: PostgreSQL 17 with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Validation**: [Zod](https://zod.dev/)
- **API Docs**: OpenAPI/Swagger via `@elysiajs/openapi`
- **Logging**: Structured JSON logging via [pino](https://github.com/pinojs/pino) + [@bogeychan/elysia-logger](https://github.com/bogeychan/elysia-logger)
- **Rate Limiting**: [elysia-rate-limit](https://github.com/rayriffy/elysia-rate-limit)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Git Hooks**: [Lefthook](https://github.com/evilmartians/lefthook) + [commitlint](https://commitlint.js.org/)

## Quick Start

```bash
bun install
cp .env.example .env
docker compose up -d
bun run db:migrate
bun run dev
```

Server runs at `http://localhost:3333`. API docs at `http://localhost:3333/swagger`.

## Documentation

- **[Setup](docs/setup.md)** — Prerequisites, environment variables, scripts, git hooks
- **[Architecture](docs/architecture.md)** — Project structure, plugin chain, graceful shutdown, shared types
- **[Development](docs/development.md)** — Full feature workflow, module creation, testing patterns, type safety checklist
- **[Testing](docs/testing.md)** — Unit, integration, and repository tests
- **[Deployment](docs/deployment.md)** — Docker (dev/prod), CI/CD, API documentation
