# Agent Instructions for tokenui

This is a monorepo with a TanStack Start frontend and Hono API backend.

## Project Structure

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

## Build Commands

```bash
# Frontend (port 3000)
cd apps/web && bun run dev          # Start dev server
cd apps/web && bun run build        # Production build
cd apps/web && bun run start        # Start production server

# API (port 3001)
cd apps/api && bun run dev          # Start dev server with hot reload
cd apps/api && bun run deploy       # Deploy to Cloudflare Workers

# Database
cd apps/api && bun run db:generate  # Generate migrations
cd apps/api && bun run db:migrate   # Run migrations
cd apps/api && bun run db:push      # Push schema changes
cd apps/api && bun run db:studio    # Open Drizzle Studio
```

## Lint Commands

```bash
cd apps/web && bun run lint         # Run ESLint with tanstack config
cd apps/web && bun run format       # Format with Prettier
```

## Testing

**No test framework is currently configured.** Add tests using Vitest if needed:
```bash
bun add -D vitest @testing-library/react
```

## Code Style Guidelines

### TypeScript
- **Strict mode enabled**: Always use explicit types, avoid `any`
- **Interface naming**: Use PascalCase (e.g., `User`, `Design`, `Session`)
- **Type imports**: Use `import type { Foo }` for type-only imports

### Imports
- **Path aliases**: Use `@/` for internal imports (configured in tsconfig)
  - `@/components/*` → `src/components/*`
  - `@/lib/*` → `src/lib/*`
  - `@/hooks/*` → `src/hooks/*`
- **Import order**: React → External libs → Internal (@/*) → Relative
- **No barrel files**: Import directly from source files

### Naming Conventions
- **Components**: PascalCase functions, exported (e.g., `export function LoginPage()`)
- **Hooks**: camelCase starting with `use` (e.g., `useSession`, `useMyDesigns`)
- **Types/Interfaces**: PascalCase nouns (e.g., `User`, `CreateDesignData`)
- **Query keys**: camelCase objects with functions (e.g., `designKeys.all`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: kebab-case for components, camelCase for utilities

### React Patterns
- **Function components**: Use named function exports, not arrow functions
- **Routes**: Export `Route` using `createFileRoute()` or `createRootRoute()`
- **State hooks**: Destructure at top of component (e.g., `const [email, setEmail] = useState()`)
- **Mutations**: Handle errors in mutation hooks, component shows error state
- **Client components**: Add `"use client"` directive when using hooks

### API Patterns
- **Hono routes**: Use async/await, return `c.json()` responses
- **Auth checks**: Use `auth.api.getSession({ headers: c.req.raw.headers })`
- **Error handling**: Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- **Drizzle queries**: Use `eq()`, `desc()` from `drizzle-orm`

### Data Fetching
- **React Query**: Define query keys in separate objects (`authKeys`, `designKeys`)
- **API client**: Use the `api` class from `@/lib/api/client` for HTTP requests
- **Auth client**: Use functions from `@/lib/auth-client` for Better Auth
- **Invalidation**: Clear queries on mutations with `queryClient.invalidateQueries()`

### Styling
- **Tailwind CSS**: Use utility classes exclusively
- **shadcn/ui**: Install components via CLI, customize in `components/ui/`
- **Icons**: Use `@hugeicons/react` with `HugeiconsIcon` component
- **Dark mode**: Uses CSS variables, theme toggle in components
- **cn() utility**: Use from `@/lib/utils` for conditional class merging

### Error Handling
- **API errors**: Log with `console.error()` and return user-friendly messages
- **React errors**: Handle in try/catch, show in UI with error states
- **Async errors**: Use mutation error states, don't throw in components
- **Auth errors**: Better Auth returns error objects, check `result.error`

### Database
- **Schema**: Use Drizzle ORM with PostgreSQL on Neon
- **Migrations**: Always run `bun drizzle-kit migrate` after schema changes
- **Timestamps**: Use `new Date()` in JavaScript, not SQL `now()`

### Environment Variables
- **Frontend**: Uses `VITE_` prefix for exposed variables
- **API**: Uses `process.env` directly
- **Required**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, OAuth credentials

## Key Technologies

- **Frontend**: TanStack Start (React + Vite + SSR), TanStack Router, TanStack Query
- **Backend**: Hono, Cloudflare Workers runtime (with Bun for dev)
- **Auth**: Better Auth with Drizzle adapter
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Storage**: Cloudflare R2 for images
- **UI**: shadcn/ui components, Tailwind CSS, Hugeicons
