# base-fullstack Web

The frontend for base-fullstack, built with **Next.js 16** and **React 19**.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **State Management**: [TanStack React Query](https://tanstack.com/query/latest) for server state
- **URL State**: [nuqs](https://nuqs.47ng.com/) for type-safe URL search params
- **Server Actions**: [next-safe-action](https://next-safe-action.dev/) for type-safe server actions with Zod validation
- **Forms**: [react-hook-form](https://react-hook-form.com/) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers) (Zod)
- **API Client**: [Eden Treaty](https://elysiajs.com/eden/treaty/overview) (end-to-end type-safe HTTP client)
- **Env Validation**: [@t3-oss/env-nextjs](https://env.t3.gg/) for build-time environment validation
- **i18n**: [next-intl](https://next-intl.dev/) (en/pt)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- **Toasts**: [sonner](https://sonner.emilkowal.dev/)
- **Analytics**: [Plausible](https://plausible.io/) (opt-in via env var)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Git Hooks**: [Lefthook](https://github.com/evilmartians/lefthook) + [commitlint](https://commitlint.js.org/)

## Quick Start

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). See [Setup](docs/setup.md) for details.

## Documentation

- **[Setup](docs/setup.md)** — Prerequisites, directory layout, environment variables, scripts, git hooks
- **[Architecture](docs/architecture.md)** — Project structure, Eden Treaty API client, security, i18n
- **[Development](docs/development.md)** — Full feature workflow, API consumption, components, testing, type safety checklist
- **[Testing](docs/testing.md)** — Unit tests, E2E (Playwright), Storybook
- **[Deployment](docs/deployment.md)** — Docker, CI/CD
