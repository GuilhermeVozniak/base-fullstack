# Testing

## Unit Tests

```bash
bun run test
```

Uses **bun test** with [happy-dom](https://github.com/nicedayfor/happy-dom) for DOM simulation and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component testing.

Test files live in `__tests__/` and are configured via `bunfig.toml`:

- **Preload**: `test/setup.ts` registers happy-dom globals (`document`, `window`, `navigator`)
- **Root**: `./__tests__` (excludes `e2e/` from `bun test`)

### Coverage

```bash
bun run test:coverage
```

## E2E Tests

```bash
# Install browsers (first time only)
bunx playwright install --with-deps chromium

# Run tests
bunx playwright test
```

Uses [Playwright](https://playwright.dev/) with a smoke test suite. See `playwright.config.ts` for configuration.

E2E tests live in `e2e/` and run separately from unit tests (via `bunx playwright test`, not `bun test`).

## Storybook

```bash
bun run storybook
```

[Storybook](https://storybook.js.org/) runs on `http://localhost:6006` with the Vite-based `@storybook/nextjs-vite` framework. Tailwind CSS styles are loaded via `globals.css` in the preview config.

Stories live in `stories/`.
