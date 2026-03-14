# Type Resolution

## How Types Flow

```
web/lib/api.ts
  └─ import type { App } from "@base-fullstack/shared"
       └─ web/tsconfig.json resolves @base-fullstack/shared → ../packages/shared/index.ts
            └─ export type { App } from "../../backend/src/http/server"
                 └─ Elysia<...> app type with all routes, plugins, and schemas
```

Eden Treaty uses the `App` type to infer all routes, request shapes, and response types at compile time.

## TypeScript Configuration

### Shared Package (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": "../../backend",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["index.ts", "../../backend/src/**/*.ts"]
}
```

- `baseUrl` points to the backend so `@/*` aliases resolve correctly
- `include` covers backend source for type resolution

### Web (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*", "../backend/src/*"],
      "@base-fullstack/shared": ["../packages/shared/index.ts"],
      "elysia": ["../backend/node_modules/elysia/dist/index.d.ts"],
      "elysia/*": ["../backend/node_modules/elysia/dist/*"]
    }
  },
  "include": ["...", "../packages/shared/**/*.ts"]
}
```

Key path mappings:

- **`@/*` fallback** — `./*` resolves web imports, `../backend/src/*` resolves backend's `@/` aliases when `tsc` follows types into backend source
- **`elysia` redirect** — Both repos resolve Elysia from the same physical copy (backend's `node_modules`), preventing nominal type mismatches from private class properties
- **`@base-fullstack/shared`** — Maps to the shared package's entry point

## Environment Behavior

| Environment      | Types Available? | Notes                                                             |
| ---------------- | ---------------- | ----------------------------------------------------------------- |
| **Local dev**    | ✅               | All packages available in the monorepo                            |
| **CI**           | ✅               | Single checkout gets everything                                   |
| **Docker build** | ✅               | Build context is monorepo root, all types available               |
| **Production**   | N/A              | No types at runtime — `import type` is erased                     |

## Common Issues

### `Cannot find module '@/auth'` in typecheck

The web's `tsc` is following types into backend source but can't resolve backend's `@/` path aliases. Ensure `tsconfig.json` has `"../backend/src/*"` as a fallback for `@/*`.

### Elysia type mismatch (`private property 'dependencies'`)

The backend and web have separate `elysia` packages in their `node_modules`. Since Elysia uses private class properties, TypeScript treats them as nominally different. Ensure `tsconfig.json` maps `elysia` and `elysia/*` to the backend's copy.

### CI type resolution

Since this is a monorepo, all packages are available in a single checkout. No cross-repo tokens or special CI setup is needed — `actions/checkout@v4` gets everything.
