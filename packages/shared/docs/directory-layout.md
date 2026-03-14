# Directory Layout

## Monorepo Structure

This package lives inside the `base-fullstack` monorepo:

```
base-fullstack/
├── backend/          ← Elysia API server
├── packages/
│   └── shared/       ← this package
└── web/              ← Next.js frontend
```

## Why This Layout?

- `index.ts` re-exports the `App` type from `../../backend/src/http/server` (relative path)
- `web/tsconfig.json` maps `@base-fullstack/shared` to `../packages/shared/index.ts` (path alias)
- `web/tsconfig.json` includes `../packages/shared/**/*.ts` for type checking

This enables end-to-end type safety between backend and frontend without a build step or package registry.
