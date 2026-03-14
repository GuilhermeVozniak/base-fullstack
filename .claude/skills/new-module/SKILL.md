---
name: new-module
description: Scaffold a new backend feature module with handler, service, repository, routes, schemas, DTOs, errors, and tests following the project's layered architecture.
allowed-tools: Read, Write, Edit, Bash(bun *), Glob, Grep
argument-hint: <module-name>
---

# Scaffold a New Backend Module

Create a new backend module named `$ARGUMENTS` following the project's layered architecture.

## Steps

1. **Read the existing users module** to understand the exact patterns:
   - `backend/src/modules/users/routes.ts`
   - `backend/src/modules/users/handler/handler.ts`
   - `backend/src/modules/users/handler/schemas.ts`
   - `backend/src/modules/users/service/service.ts`
   - `backend/src/modules/users/service/dtos.ts`
   - `backend/src/modules/users/service/errors.ts`
   - `backend/src/modules/users/repository/repository.ts`
   - `backend/src/modules/users/repository/types.ts`

2. **Create the module directory structure**:
   ```
   backend/src/modules/$ARGUMENTS/
   ├── routes.ts
   ├── handler/
   │   ├── handler.ts
   │   └── schemas.ts
   ├── service/
   │   ├── service.ts
   │   ├── dtos.ts
   │   └── errors.ts
   ├── repository/
   │   ├── repository.ts
   │   └── types.ts
   └── __tests__/
       ├── handler.test.ts
       ├── service.int.test.ts
       └── repository.repository.int.test.ts
   ```

3. **Create the Drizzle schema** in `backend/src/database/schema/$ARGUMENTS.ts` with:
   - UUIDv7 primary key
   - `createdAt` and `updatedAt` timestamps
   - Relations if applicable
   - Export from `backend/src/database/schema/index.ts`

4. **Create all module files** following the exact patterns from the users module:
   - Routes: Elysia group with `auth: true` macro, OpenAPI detail tags
   - Handler: Error mapping to HTTP status codes using match/case
   - Schemas: Zod schemas for request params, body, and response
   - Service: Business logic with custom error classes
   - DTOs: Type-safe data transfer objects (exclude sensitive fields)
   - Repository: Drizzle queries with proper typing

5. **Register the routes** in `backend/src/http/routes/index.ts`

6. **Generate migration**: Run `bun run db:generate` from the backend directory

7. **Verify**: Run `bun run typecheck` from the backend directory
