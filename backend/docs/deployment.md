# Deployment

## Docker

### Development

```bash
docker compose up -d
```

Uses `Dockerfile` with hot reload (`--watch`) and debugger (`--inspect=0.0.0.0:9229`).

### Production

```bash
docker compose -f docker-compose.prod.yml up -d
```

Uses `Dockerfile.prod` — a multi-stage build with `oven/bun:1-slim` for a minimal production image. No watch mode, no debugger.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to `main`:

| Job                    | What it does                                  |
| ---------------------- | --------------------------------------------- |
| **Lint & Format**      | `bun run check`                               |
| **Type Check**         | `bun run typecheck`                           |
| **Unit Tests**         | `bun run test:unit`                           |
| **Integration Tests**  | `bun run test:int` + `bun run test:repo` with PostgreSQL 16 service |

The integration test job provisions a PostgreSQL 16 Alpine container with health checks.

### Action Versions

The CI uses:
- `actions/checkout@v6`
- `actions/cache@v5`
- `oven-sh/setup-bun@v2`

## API Documentation

Access the OpenAPI/Swagger documentation at `http://localhost:3333/swagger` when the server is running.
