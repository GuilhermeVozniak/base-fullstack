---
name: new-page
description: Scaffold a new Next.js page with translations, API integration, and proper auth protection following the project conventions.
allowed-tools: Read, Write, Edit, Bash(bun *), Glob, Grep
argument-hint: <page-path>
---

# Scaffold a New Frontend Page

Create a new Next.js page at route `/$ARGUMENTS`.

## Steps

1. **Read existing patterns** to match conventions:
   - `web/app/layout.tsx` (providers, fonts)
   - `web/middleware.ts` (auth protection rules)
   - `web/lib/api.ts` (Eden Treaty client)
   - `web/lib/hooks/use-api-query.ts` (query hook)
   - `web/messages/en.json` (i18n structure)

2. **Create the page file** at `web/app/$ARGUMENTS/page.tsx`:
   - Use `"use client"` if it needs interactivity
   - Import translations with `useTranslations`
   - Use `useApiQuery` or `useApiMutation` for API calls
   - Follow existing component patterns (shadcn/ui + Tailwind)

3. **Add translations** in both:
   - `web/messages/en.json`
   - `web/messages/pt.json`

4. **Update middleware** in `web/middleware.ts` if the page should be public:
   - Add the path to the `publicPaths` array
   - By default, all pages require authentication

5. **Create any needed components** in `web/components/`:
   - Use shadcn/ui base components
   - Use CVA (class-variance-authority) for variants
   - Use Tailwind utility classes (no custom CSS)

6. **Verify**: Run `bun run typecheck` from the web directory
