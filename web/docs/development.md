# Development Workflow

This guide covers the full feature development workflow on the frontend — from creating new pages and components to leveraging the full type-safe API client, testing, and shipping.

## Consuming Backend APIs

The core advantage of this setup is **end-to-end type safety** from the backend Elysia routes all the way to the frontend React components — with zero manual type definitions.

### How It Works

1. A backend developer adds a new route with Zod schemas in `backend/src/modules/<name>/`
2. The `App` type in `backend/src/http/server.ts` automatically includes the new route
3. `@base-fullstack/shared` re-exports `App` — no changes needed
4. Eden Treaty in `web/lib/api.ts` gains **autocomplete** for the new endpoint
5. You get full type inference for params, body, and response — no manual types

### Using the API Client

```ts
import { api } from "@/lib/api"

// Fully typed — IDE autocomplete for routes, params, and responses
const { data, error, status } = await api.posts({ id: "123" }).get()

// POST with body — body shape is inferred from the backend Zod schema
const { data } = await api.posts.index.post({
  title: "Hello",
  content: "World",
})
```

### React Query Hooks

Wrap API calls with the custom hooks for caching, loading states, and error handling:

```ts
// For queries (GET)
import { useApiQuery } from "@/lib/hooks/use-api-query"

export function PostDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useApiQuery(
    ["posts", id],
    () => api.posts({ id }).get()
  )

  if (isLoading) return <Skeleton />
  if (error) return <ErrorBoundary error={error} />
  return <PostCard post={data} />
}
```

```ts
// For mutations (POST, PATCH, DELETE)
import { useApiMutation } from "@/lib/hooks/use-api-mutation"

export function CreatePostForm() {
  const { mutate, isPending } = useApiMutation(
    (input: { title: string; content: string }) => api.posts.index.post(input)
  )

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      mutate({ title: "New Post", content: "Content" })
    }}>
      {/* ... */}
    </form>
  )
}
```

### Server Actions

For mutations that need server-side validation or session access, use `next-safe-action`:

```ts
// actions/create-post.ts
"use server"

import { actionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
})

export const createPost = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    // Call backend API or perform server-side logic
    const { data, error } = await api.posts.index.post(parsedInput)
    if (error) throw new Error(error.message)
    return data
  })
```

## Adding a New Page

Next.js App Router uses file-based routing:

```
app/
├── posts/
│   ├── page.tsx              # /posts (list page)
│   ├── loading.tsx           # Suspense fallback
│   ├── error.tsx             # Error boundary
│   └── [id]/
│       ├── page.tsx          # /posts/:id (detail page)
│       ├── loading.tsx
│       └── error.tsx
```

### Page Conventions

1. **Server Components by default** — fetch data on the server when possible
2. **`loading.tsx`** — always provide a skeleton/loading state
3. **`error.tsx`** — always provide an error boundary with retry
4. **Metadata** — use `createMetadata()` from `@/lib/metadata` for SEO

```ts
// app/posts/page.tsx
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Posts",
  description: "Browse all posts",
})

export default async function PostsPage() {
  // Server-side data fetching
  const { data } = await api.posts.index.get()
  return <PostList posts={data} />
}
```

## Adding Components

### UI Components (shadcn/ui)

```bash
bunx shadcn@latest add dialog
```

This adds pre-built, accessible components to `components/ui/`. Customize styling via Tailwind classes.

### Feature Components

Place feature-specific components alongside their pages or in a shared location:

```
components/
├── ui/               # shadcn/ui primitives (button, card, input, etc.)
├── posts/            # Feature components
│   ├── post-card.tsx
│   ├── post-form.tsx
│   └── post-list.tsx
├── providers/        # Context providers
└── analytics.tsx     # Shared utilities
```

### Styling Conventions

- Use **Tailwind CSS** classes directly — no CSS modules
- Use `cn()` from `@/lib/utils` to merge conditional classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("p-4 rounded-lg", isActive && "bg-primary text-primary-foreground")} />
```

- Use **CSS variables** for theming (defined in `app/globals.css`)
- Use **cva** (class-variance-authority) for component variants — already used by shadcn/ui `Button`

## Writing Tests

### Unit Tests

Test utility functions and component rendering. Files go in `__tests__/`:

```ts
// __tests__/lib/my-util.test.ts
import { describe, expect, test } from "bun:test"
import { myUtil } from "@/lib/my-util"

describe("myUtil", () => {
  test("does something", () => {
    expect(myUtil("input")).toBe("expected")
  })
})
```

### Component Tests

Use React Testing Library with happy-dom (configured in `test/setup.ts`):

```tsx
// __tests__/components/post-card.test.tsx
import { describe, expect, test } from "bun:test"
import { render, screen } from "@testing-library/react"
import { PostCard } from "@/components/posts/post-card"

describe("PostCard", () => {
  test("renders post title", () => {
    render(<PostCard post={{ id: "1", title: "Hello" }} />)
    expect(screen.getByText("Hello")).toBeDefined()
  })
})
```

### E2E Tests

Test critical user flows with Playwright. Files go in `e2e/`:

```ts
// e2e/posts.spec.ts
import { expect, test } from "@playwright/test"

test("user can view posts page", async ({ page }) => {
  await page.goto("/posts")
  await expect(page.locator("h1")).toContainText("Posts")
})
```

Run: `bunx playwright test`

### Test Naming Convention

| Location | Runner | What it tests |
|----------|--------|---------------|
| `__tests__/**/*.test.ts(x)` | `bun test` | Utils, components, hooks |
| `e2e/**/*.spec.ts` | `playwright test` | Full user flows in a browser |
| `stories/**/*.stories.tsx` | Storybook | Visual component documentation |

## Internationalization

All user-facing text should use `next-intl`:

```tsx
import { useTranslations } from "next-intl"

export function PostCard() {
  const t = useTranslations("Posts")
  return <h2>{t("title")}</h2>
}
```

Add translations to both locale files:

```json
// messages/en.json
{ "Posts": { "title": "Posts" } }

// messages/pt.json
{ "Posts": { "title": "Publicações" } }
```

## Type Safety Checklist

When building a new feature, verify:

- [ ] Backend route has Zod schemas for params, body, and response
- [ ] `bun run typecheck` passes in both `web/` and `backend/`
- [ ] Eden Treaty client has autocomplete for the new endpoint (check `api.<route>`)
- [ ] React Query hooks use proper query keys for cache invalidation
- [ ] Server actions use `next-safe-action` with Zod validation
- [ ] Environment variables (if any) are added to `lib/env.ts` and `.env.example`

## Code Quality Gates

### Local (automatic via git hooks)

| Hook | Runs | Blocks commit? |
|------|------|----------------|
| **pre-commit** | `biome check --write` on staged files | Yes |
| **commit-msg** | commitlint (conventional commits) | Yes |

### CI (on push/PR to main)

| Job | Command | What it catches |
|-----|---------|-----------------|
| Lint & Format | `bun run check` | Style issues, import order |
| Type Check | `bun run typecheck` | Type errors across web + shared + backend |
| Unit Tests | `bun run test` | Broken utils, components |
| Build | `bun run build` | Build errors, missing env vars |
| E2E | `bunx playwright test` | Broken user flows |

### Manual verification before pushing

```bash
bun run check        # lint + format
bun run typecheck    # full type chain (web → shared → backend)
bun run test         # unit + component tests
bun run build        # production build
```

## Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add posts list page
fix: handle empty state on posts page
refactor: extract post card into shared component
test: add post card component tests
style: adjust post card spacing
docs: document posts feature
chore: update next-intl
```

## Adding Environment Variables

1. Add the variable to `.env.example`
2. Add validation in `lib/env.ts`:

```ts
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3333"),
    NEXT_PUBLIC_NEW_VAR: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_NEW_VAR: process.env.NEXT_PUBLIC_NEW_VAR,
  },
})
```

3. Use `env.NEXT_PUBLIC_NEW_VAR` — never access `process.env` directly
4. Update `docs/setup.md` environment variables table
