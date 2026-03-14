# @base-fullstack/shared

Shared **types-only** package for the base-fullstack project. Contains no runtime code — all exports are `type` imports that are erased at compile time.

## Exports

| Export                  | Source                       | Description                     |
| ----------------------- | ---------------------------- | ------------------------------- |
| `App`                   | `backend/src/http/server.ts` | Elysia app type for Eden Treaty |
| `ApiErrorResponse`      | `types/api.ts`               | Standard error response shape   |
| `ApiSuccessResponse<T>` | `types/api.ts`               | Standard success response shape |
| `PaginatedResponse<T>`  | `types/api.ts`               | Paginated list response shape   |

## Usage

```ts
import type { App } from "@base-fullstack/shared";
import type { ApiErrorResponse } from "@base-fullstack/shared";
```

Both repos reference this package via TypeScript path aliases — no build step or `npm install` is needed.

## Documentation

- **[Directory Layout](docs/directory-layout.md)** — Required sibling repo structure and clone instructions
- **[Type Resolution](docs/type-resolution.md)** — How types flow, tsconfig setup, environment behavior, troubleshooting
