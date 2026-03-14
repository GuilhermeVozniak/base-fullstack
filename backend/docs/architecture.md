# Architecture

## Project Structure

```
src/
├── auth.ts              # Better Auth configuration
├── env.ts               # Environment validation (Zod)
├── index.ts             # Entry point + graceful shutdown
├── database/
│   ├── client.ts        # Database connection
│   ├── seed.ts          # Database seeding (drizzle-seed)
│   ├── schema/          # Database schema definitions
│   └── migrations/      # Drizzle migrations
├── http/
│   ├── server.ts        # Elysia server setup + App type export
│   ├── responses.ts     # Shared response schemas
│   ├── routes/
│   │   ├── index.ts     # Route aggregation
│   │   └── health.ts    # GET /health endpoint
│   └── plugins/
│       ├── better-auth.ts   # Auth session/user macro
│       ├── request-id.ts    # X-Request-Id header (UUIDv7)
│       ├── logger.ts        # Pino structured logging
│       ├── error-handler.ts # Custom error handler with request ID
│       ├── rate-limit.ts    # Per-user/IP rate limiters
│       ├── csrf.ts          # CSRF origin validation
│       └── sanitize.ts      # HTML/XSS input sanitization
└── modules/
    └── users/           # Users module
        ├── routes.ts
        ├── handler/
        ├── service/
        └── repository/
```

## Layered Architecture

The backend follows a **modular layered architecture**:

1. **Routes** — HTTP endpoint definitions with validation schemas
2. **Handlers** — Request/response handling
3. **Services** — Business logic layer
4. **Repositories** — Data access layer (Drizzle queries)

Each module (`src/modules/<name>/`) contains its own routes, handler, service, and repository layers.

## Elysia Plugin Chain

Plugins are applied in this order in `server.ts`:

1. **Request ID** — assigns `X-Request-Id` header (UUIDv7) to every request; propagated if sent by upstream proxy
2. **Logger** (`pino`) — structured request/response logging with request ID
3. **Error Handler** — catches all errors and logs them as structured JSON with context (path, method, request ID, stack trace in dev)
4. **Rate Limiter** — 100 req/min per user (session token) or IP; `strictRateLimiter` at 10 req/min for sensitive routes
5. **OpenAPI** — Swagger documentation at `/swagger`
6. **CORS** — origin restricted to `CORS_ORIGIN` env var
7. **CSRF** — validates `Origin` header on mutation requests matches `CORS_ORIGIN`
8. **Sanitize** — strips HTML/XSS vectors from request bodies
9. **Better Auth** — authentication plugin with session/user macro
10. **Routes** — application routes

## Graceful Shutdown

The entry point (`src/index.ts`) handles `SIGTERM` and `SIGINT` signals for clean Docker container stops. The server is stopped gracefully before the process exits.

## Health Check

`GET /health` returns `{ status: "ok", timestamp: "..." }` and is used by Docker Compose for container health monitoring.

## Database Seeding

```bash
bun run db:seed
```

Seeds 10 sample users using [`drizzle-seed`](https://orm.drizzle.team/docs/seed-overview). Useful for local development.

## Shared Types

The `App` type is exported from `src/http/server.ts` and re-exported by the `@base-fullstack/shared` package (`packages/shared/`). This enables end-to-end type safety with the frontend's Eden Treaty client.
