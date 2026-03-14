# Stage 1: Install dependencies
FROM oven/bun:1 AS deps
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile

# Install backend deps for type resolution
WORKDIR /app/backend
COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
# Build context should be the monorepo root so that @base-fullstack/shared
# and backend types are available for full type safety.
FROM oven/bun:1 AS builder
WORKDIR /app

COPY --from=deps /app/web/node_modules ./web/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY packages/ ./packages/
COPY backend/src/ ./backend/src/
COPY web/ ./web/

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/web
RUN bun run build

# Stage 3: Production image
FROM oven/bun:1-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
