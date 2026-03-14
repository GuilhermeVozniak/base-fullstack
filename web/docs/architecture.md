# Architecture

## Project Structure

```
app/
├── globals.css            # Tailwind + CSS variables
├── layout.tsx             # Root layout (providers, theme, toaster)
├── page.tsx               # Home page
├── not-found.tsx          # Custom 404 page
├── error.tsx              # App-level error page with retry
├── loading.tsx            # Suspense fallback with skeletons
└── opengraph-image.tsx    # Dynamic OG image generation

components/
├── analytics.tsx          # Plausible analytics (opt-in)
├── error-boundary.tsx     # React error boundary with retry
├── theme-toggle.tsx       # Dark/light/system theme toggle
├── providers/
│   ├── query-provider.tsx # TanStack React Query provider
│   └── theme-provider.tsx # next-themes provider
└── ui/                    # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── form.tsx           # react-hook-form integration
    ├── input.tsx
    ├── label.tsx
    ├── skeleton.tsx
    └── sonner.tsx         # Toast notifications

lib/
├── api.ts                 # Eden Treaty client (typed API)
├── env.ts                 # t3-env environment validation
├── metadata.ts            # SEO metadata utility (createMetadata)
├── safe-action.ts         # next-safe-action client
├── utils.ts               # cn() helper for Tailwind classes
└── hooks/
    ├── use-api-query.ts   # React Query + Eden Treaty query hook
    └── use-api-mutation.ts # React Query + Eden Treaty mutation hook

i18n/
└── request.ts             # next-intl request config

messages/
├── en.json                # English translations
└── pt.json                # Portuguese translations

middleware.ts              # Auth redirects (public/protected routes)

__tests__/                 # Unit tests (bun test + React Testing Library)
e2e/                       # Playwright E2E tests
stories/                   # Storybook stories
.storybook/                # Storybook config (Vite-based)
```

## API Client (Eden Treaty)

The frontend uses [Eden Treaty](https://elysiajs.com/eden/treaty/overview) for end-to-end type safety with the backend Elysia API. Types are shared via the `@base-fullstack/shared` package (`packages/shared/`).

```ts
import { api } from "@/lib/api";

// Fully typed — autocomplete for routes, params, and responses
const { data } = await api.users({ id: "123" }).get();
```

Custom hooks wrap React Query + Eden for consistent error handling:

```ts
import { useApiQuery } from "@/lib/hooks/use-api-query";

const { data, isLoading } = useApiQuery(["users", id], () =>
  api.users({ id }).get(),
);
```

### How It Works

1. `@base-fullstack/shared` exports the `App` type from the backend's Elysia server
2. `lib/api.ts` passes `App` to `treaty<App>()` from `@elysiajs/eden`
3. Eden infers all routes, request shapes, and response types from `App`
4. Custom hooks (`use-api-query`, `use-api-mutation`) wrap React Query with Eden calls

## Security

- **Security Headers** — `next.config.ts` adds HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy to all responses
- **Auth Middleware** — `middleware.ts` redirects unauthenticated users to `/login` for protected routes
- **Env Validation** — `lib/env.ts` validates environment variables at build time via `@t3-oss/env-nextjs`
- **Server Actions** — `next-safe-action` enforces Zod validation on all server actions

## Internationalization

Uses [next-intl](https://next-intl.dev/) with two locales:

- `messages/en.json` — English
- `messages/pt.json` — Portuguese

The locale is resolved per-request in `i18n/request.ts`.
