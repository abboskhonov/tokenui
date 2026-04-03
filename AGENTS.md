# Agent Instructions for tokenui

This repository is a monorepo with a TanStack Start frontend and a Hono API backend.
These notes are for agentic coding work in this repo and should be kept current.

## Repo Layout

```
apps/web/          # TanStack Start frontend (port 3000)
  src/
    routes/        # File-based TanStack Router routes
    components/    # React components
      ui/          # shadcn/ui components
    features/      # Feature-based modules
    lib/           # Utilities, API clients, queries
    hooks/         # Custom React hooks
    styles.css     # Tailwind + global styles
apps/api/          # Hono API backend (port 3001)
  src/
    app.ts         # Hono app with routes
    index.ts       # Server entry
    auth/          # Better Auth configuration
    db/            # Drizzle ORM schema and connection
    storage/       # R2 storage utilities
  drizzle/         # Database migrations
```

## Build And Run

```bash
# Frontend
cd apps/web && bun run dev       # Vite dev server on port 3000
cd apps/web && bun run build     # Production build
cd apps/web && bun run preview   # Preview built app

# API
cd apps/api && bun run dev       # Hono dev server on port 3001
cd apps/api && bun run deploy    # Cloudflare Workers deploy

# Database
cd apps/api && bun run db:generate  # Generate Drizzle migrations
cd apps/api && bun run db:migrate   # Apply migrations
cd apps/api && bun run db:push      # Push schema changes directly
cd apps/api && bun run db:studio    # Open Drizzle Studio
cd apps/api && bun run db:backfill  # Run data backfill script
```

## Lint, Format, Typecheck

```bash
cd apps/web && bun run lint       # ESLint
cd apps/web && bun run format     # Prettier write mode
cd apps/web && bun run typecheck  # TypeScript no-emit check
```

## Testing

The active test runner is Vitest in `apps/web`.

```bash
cd apps/web && bun run test                 # Run all tests once
cd apps/web && bun run test -- path/to.test.tsx  # Run a single test file
cd apps/web && bun run test -- -t "name"    # Run tests matching a name
cd apps/web && bun run test -- path/to.test.tsx:42  # Run the test at a line
```

If you need DOM testing helpers, use `@testing-library/react` and `jsdom`.
There is no separate backend test script defined in `apps/api` right now.

## Code Style

### TypeScript
- Prefer explicit types in exported surfaces and avoid `any` unless unavoidable.
- Use `import type` for type-only imports.
- Keep interfaces and type aliases in PascalCase.
- Prefer small, focused types over broad union-heavy models.

### Imports
- Use `@/` aliases for internal imports.
- `@/components/*` maps to `src/components/*`.
- `@/lib/*` maps to `src/lib/*`.
- `@/hooks/*` maps to `src/hooks/*`.
- Order imports as React, external packages, internal `@/*`, then relative imports.
- Import directly from source files; avoid barrel files unless there is a clear reason.

### Naming
- Components: named PascalCase function exports, not anonymous defaults.
- Hooks: camelCase starting with `use`.
- Query key objects: camelCase, e.g. `designKeys.all`.
- Constants: `UPPER_SNAKE_CASE` for true constants.
- Files: kebab-case for components, camelCase for utilities.

### React
- Prefer named function components.
- Export `Route` from `createFileRoute()` / `createRootRoute()` route files.
- Keep state hooks near the top of the component body.
- Handle async and mutation errors in the mutation/query layer where practical.
- Use `use client` only where hooks require client execution.

### API
- Use async/await in Hono handlers and return `c.json()` responses.
- Fetch sessions with `auth.api.getSession({ headers: c.req.raw.headers })`.
- Return proper HTTP status codes: 400, 401, 403, 404, 500.
- Use Drizzle helpers like `eq()` and `desc()` instead of raw SQL when possible.

### Data Fetching
- Keep React Query keys in dedicated objects.
- Use `api` from `@/lib/api/client` for HTTP calls.
- Use `@/lib/auth-client` for Better Auth client calls.
- Invalidate queries after mutations with `queryClient.invalidateQueries()`.

### Styling
- Use Tailwind utility classes exclusively.
- Prefer shadcn/ui components in `components/ui/` and customize there.
- Use `@hugeicons/react` with `HugeiconsIcon` for icons.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Preserve the existing CSS-variable-based dark mode approach.

### Error Handling
- Log server-side failures with `console.error()` and return user-friendly messages.
- Surface client-side async errors in component state.
- Do not throw from components for routine request failures.
- Check Better Auth result objects for `result.error` before assuming success.

### Database
- Use Drizzle ORM with PostgreSQL on Neon.
- Run `bun run db:migrate` after schema changes when migrations are needed.
- Use `new Date()` in JavaScript instead of SQL `now()` for timestamps.

### Environment Variables
- Frontend env vars must use the `VITE_` prefix.
- API env vars are read from `process.env`.
- Common required values include `DATABASE_URL`, `BETTER_AUTH_SECRET`, and OAuth credentials.

## Practical Rules

- Keep changes minimal and aligned with the existing architecture.
- Prefer small refactors over introducing new abstractions.
- Do not add backward-compatibility code unless there is a concrete need.
- Do not revert or overwrite user changes outside the scope of the task.
- Verify behavior with the smallest relevant command before widening the scope.

## Current Tooling Notes

- Frontend: TanStack Start, TanStack Router, TanStack Query, Vite, React 19 canary.
- Backend: Hono, Cloudflare Workers runtime, Bun for local dev.
- Auth: Better Auth with Drizzle adapter.
- UI: shadcn/ui, Tailwind CSS, Hugeicons.
- Storage: Cloudflare R2.

## Rules Files

- No `.cursor/rules/` files were present in this repository at the time of writing.
- No `.cursorrules` file was present in this repository at the time of writing.
- No `.github/copilot-instructions.md` file was present in this repository at the time of writing.
