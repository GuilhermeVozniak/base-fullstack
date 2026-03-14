# Development Workflow

This guide covers the full feature development workflow — from creating a new module to shipping it with tests, types, and documentation.

## Adding a New Module

Every feature lives in `src/modules/<name>/` and follows the **layered architecture**:

```
src/modules/<name>/
├── routes.ts                    # Elysia route definitions
├── handler/
│   ├── index.ts                 # Re-exports handler + schemas
│   ├── handler.ts               # Request/response handling
│   └── schemas.ts               # Zod schemas (params, body, response)
├── service/
│   ├── index.ts                 # Re-exports service + errors + DTOs
│   ├── service.ts               # Business logic
│   ├── dtos.ts                  # Data transfer objects (DB → API shape)
│   └── errors.ts                # Domain errors (ForbiddenError, NotFoundError, etc.)
├── repository/
│   ├── index.ts                 # Re-exports repository + types
│   ├── repository.ts            # Drizzle queries
│   └── types.ts                 # Input/output types for the repository
└── __tests__/
    ├── <name>.service.test.ts           # Unit tests
    ├── <name>.routes.int.test.ts        # Integration tests (HTTP)
    └── <name>.repository.int.test.ts    # Repository tests (DB)
```

### Step-by-Step

#### 1. Define the database schema

```ts
// src/database/schema/<name>.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
```

Export it from `src/database/schema/index.ts`, then generate and run the migration:

```bash
bun run db:generate
bun run db:migrate
```

#### 2. Create the repository layer

```ts
// src/modules/posts/repository/repository.ts
import { eq } from "drizzle-orm"
import { db } from "@/database/client"
import { schema } from "@/database/schema"

export const postsRepository = {
  findById: async (id: string) => {
    const [post] = await db.select().from(schema.posts).where(eq(schema.posts.id, id))
    return post ?? null
  },
  // ...
}
```

Export types and the repository from `index.ts`.

#### 3. Create the service layer

```ts
// src/modules/posts/service/service.ts
import { postsRepository } from "@/modules/posts/repository"
import { NotFoundError } from "./errors"
import { toPostDto } from "./dtos"

export const postsService = {
  getById: async (id: string) => {
    const post = await postsRepository.findById(id)
    if (!post) throw new NotFoundError()
    return toPostDto(post)
  },
}
```

Define domain errors in `errors.ts` and DTO mappers in `dtos.ts`.

#### 4. Create the handler layer

```ts
// src/modules/posts/handler/schemas.ts
import { z } from "zod"

export const postIdParamsSchema = z.object({ id: z.string().min(1) })

export const postResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
```

```ts
// src/modules/posts/handler/handler.ts
import { NotFoundError, postsService } from "@/modules/posts/service"

export const getPostByIdHandler = async (context: Record<string, unknown>) => {
  // ... extract params, call service, handle errors with status()
}
```

#### 5. Create the routes

```ts
// src/modules/posts/routes.ts
import { Elysia } from "elysia"
import { getPostByIdHandler, postIdParamsSchema, postResponseSchema } from "@/modules/posts/handler"

export const postsRoutes = new Elysia({ name: "posts.routes" }).group("/posts", (app) =>
  app.get("/:id", getPostByIdHandler, {
    auth: true,
    detail: { description: "Get post by ID", tags: ["Posts"] },
    params: postIdParamsSchema,
    response: { 200: postResponseSchema },
  })
)
```

Register in `src/http/routes/index.ts`:

```ts
export const routes = new Elysia().use(usersRoutes).use(postsRoutes)
```

#### 6. Verify the API type propagates

After adding routes, the `App` type in `src/http/server.ts` automatically includes the new endpoints. The frontend's Eden Treaty client will gain autocomplete for the new routes without any manual type definition.

## Writing Tests

### Unit Tests (`*.test.ts`)

Test the **service layer** with mocked dependencies. Use `mockModuleWithMutableExports` to swap repository implementations per test:

```ts
import { beforeEach, describe, expect, it } from "bun:test"
import { mockModuleWithMutableExports } from "@/test/mock-module"

let findByIdImpl: (id: string) => Promise<PostRecord | null>

mockModuleWithMutableExports("@/modules/posts/repository/repository", {
  postsRepository: {
    findById: (id: string) => findByIdImpl(id),
  },
})

const { postsService, NotFoundError } = await import("@/modules/posts/service")

describe("postsService", () => {
  beforeEach(() => {
    findByIdImpl = async () => null
  })

  it("throws NotFoundError when post does not exist", async () => {
    await expect(postsService.getById("id")).rejects.toBeInstanceOf(NotFoundError)
  })
})
```

**Run**: `bun run test:unit`

### Integration Tests (`*.int.test.ts`)

Test **routes end-to-end** with a real Elysia instance and Eden Treaty client. Use `testAuthPlugin` to simulate authentication:

```ts
import { beforeEach, describe, expect, it } from "bun:test"
import { treaty } from "@elysiajs/eden"
import { Elysia } from "elysia"
import { testAuthPlugin } from "@/test/plugins/test-auth"

// Mock repository, import routes
const { postsRoutes } = await import("@/modules/posts/routes")

const createApi = (authUserId?: string) => {
  const app = new Elysia().use(testAuthPlugin).use(postsRoutes)
  return treaty(app, {
    headers: authUserId ? { authorization: `Bearer ${authUserId}` } : undefined,
  })
}

describe("posts routes", () => {
  it("GET /posts/:id returns 404 when not found", async () => {
    findByIdImpl = async () => null
    const api = createApi("user-1")
    const { status } = await api.posts({ id: "id" }).get()
    expect(status).toBe(404)
  })
})
```

**Run**: `bun run test:int`

### Repository Tests (`*.repository.int.test.ts`)

Test the **data access layer** against a real PostgreSQL database using testcontainers:

```ts
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test"
import { startPostgresContainer, stopPostgresContainer, cleanupTables, getTestDb } from "@/test/containers/postgres"

beforeAll(async () => { await startPostgresContainer() }, 120000)
afterAll(async () => { await stopPostgresContainer() })
beforeEach(async () => { await cleanupTables() })

describe("postsRepository", () => {
  it("returns null when post does not exist", async () => {
    // ...test against real DB
  })
})
```

**Run**: `bun run test:repo`

### Test Naming Convention

| File pattern | Type | What it tests | Needs DB? |
|-------------|------|---------------|-----------|
| `*.test.ts` | Unit | Service logic with mocked repos | No |
| `*.int.test.ts` (excl. repo) | Integration | HTTP routes end-to-end | No |
| `*.repository.int.test.ts` | Repository | Drizzle queries against real Postgres | Yes |

## Type Safety Checklist

When adding a new feature, ensure these type chains are intact:

1. **Zod schemas** in `handler/schemas.ts` define the source of truth for request/response shapes
2. **Route definitions** use those schemas for `params`, `body`, and `response`
3. **The `App` type** in `server.ts` automatically includes the new routes
4. **`@base-fullstack/shared`** re-exports `App` — the frontend gets new route types for free
5. **Eden Treaty** in `web/lib/api.ts` gains autocomplete for the new endpoint
6. Run `bun run typecheck` to verify the full chain

## Code Quality Gates

### Local (automatic via git hooks)

| Hook | Runs | Blocks commit/push? |
|------|------|---------------------|
| **pre-commit** | `biome check --write` on staged files + unit tests | Yes |
| **commit-msg** | commitlint (conventional commits) | Yes |
| **pre-push** | full test suite (`bun test`) | Yes |

### CI (on push/PR to main)

| Job | Command | Blocks merge? |
|-----|---------|---------------|
| Lint & Format | `bun run check` | Yes |
| Type Check | `bun run typecheck` | Yes |
| Unit Tests | `bun run test:unit` | Yes |
| Integration Tests | `bun run test:int` + `bun run test:repo` | Yes |

### Manual verification before pushing

```bash
bun run check        # lint + format
bun run typecheck    # type check
bun run test         # all tests
```

## Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add posts module
fix: handle null content in post DTO
refactor: extract post validation into schemas
test: add repository tests for posts
docs: document posts API endpoints
chore: update drizzle-kit
```

## OpenAPI Documentation

Every route automatically appears in the Swagger docs at `/swagger`. Use the `detail` property in route definitions:

```ts
.get("/:id", handler, {
  detail: {
    description: "Get post by ID",
    tags: ["Posts"],
  },
  params: postIdParamsSchema,
  response: { 200: postResponseSchema, 404: errorResponseSchema },
})
```

Zod schemas are automatically converted to OpenAPI schemas.
