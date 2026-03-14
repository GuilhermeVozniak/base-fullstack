# Deployment

## Docker

Build from the **monorepo root** so the Dockerfile has access to `packages/shared` and `backend` types:

```bash
# From the monorepo root
docker build -f web/Dockerfile -t base-fullstack-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:3333 base-fullstack-web
```

Multi-stage build using `oven/bun:1` → `oven/bun:1-slim` with Next.js standalone output.

### Stages

1. **deps** — installs web + backend dependencies
2. **builder** — copies source (including shared types) and runs `next build`
3. **production** — minimal image with standalone output, public assets, and static files

## CI/CD

GitHub Actions workflows (`.github/workflows/`) run on push/PR to `main` when relevant paths change:

| Job              | What it does                                                  |
| ---------------- | ------------------------------------------------------------- |
| **Lint & Format**| `bun run check`                                               |
| **Type Check**   | `bun run typecheck`                                           |
| **Unit Tests**   | `bun run test`                                                |
| **Build**        | `bun run build`                                               |
| **Playwright E2E** | `bunx playwright test` (runs after Build)                   |

Since this is a monorepo, all sibling packages are available in a single checkout — no cross-repo tokens needed.

### Action Versions

The CI uses:
- `actions/checkout@v4`
- `actions/cache@v4`
- `actions/upload-artifact@v4`
- `oven-sh/setup-bun@v2`
