# Testing

## Unit Tests

```bash
bun run test:unit
```

Runs tests matching `*.test.ts` (excluding `*.int.test.ts`). These test service-layer logic with mocked dependencies.

## Integration Tests

```bash
bun run test:int
```

Runs tests matching `*.int.test.ts` (excluding `*.repository.int.test.ts`). These test HTTP routes end-to-end using real Elysia server instances.

Requires a running PostgreSQL instance (see [Setup](setup.md)).

## Repository Tests

```bash
bun run test:repo
```

Runs tests matching `*.repository.int.test.ts`. These test the data access layer against a real PostgreSQL database.

## All Tests

```bash
bun run test
```

Runs all tests (unit + integration + repository).

## Coverage

```bash
bun run test:coverage
```

## Test Organization

Tests are colocated with their modules:

```
src/modules/users/
├── __tests__/
│   ├── users.service.test.ts          # Unit tests
│   ├── users.routes.int.test.ts       # Integration tests
│   └── users.repository.int.test.ts   # Repository tests
```

## CI

In CI, unit tests run without a database. Integration and repository tests run with a PostgreSQL 16 service container. See [Deployment](deployment.md) for CI details.
