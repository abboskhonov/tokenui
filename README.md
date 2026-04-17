# TasteUI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack](https://img.shields.io/badge/TanStack-FF4154?logo=react&logoColor=white)](https://tanstack.com/)

> Design system skills marketplace for AI coding agents

TasteUI is a platform for discovering and installing design system skills to your coding agents. It provides a CLI tool, a web interface, and an API for managing and sharing design patterns, components, and styling guidelines.

```
████████╗ █████╗ ███████╗████████╗███████╗██╗   ██╗██╗
╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██║   ██║██║
   ██║   ███████║███████╗   ██║   █████╗  ██║   ██║██║
   ██║   ██╔══██║╚════██║   ██║   ██╔══╝  ██║   ██║██║
   ██║   ██║  ██║███████║   ██║   ███████╗╚██████╔╝██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝
```

## Quick Start

### CLI Installation

```bash
npx tasteui.dev
```

### Browse and Install Skills

```bash
# List available design skills
npx tasteui.dev list

# Install a skill to your project
npx tasteui.dev add <owner>/<skill-name>
```

## Repository Structure

This is a monorepo with the following applications:

```
tasteui/
├── apps/
│   ├── web/          # TanStack Start frontend (port 3000)
│   ├── api/          # Hono API backend (port 3001)
│   └── cli/          # Command-line interface
├── .agents/          # Agent instructions and skills
└── docs/             # Documentation
```

### Apps Overview

| App | Stack | Description |
|-----|-------|-------------|
| `apps/web` | TanStack Start, React, TypeScript, shadcn/ui | Web interface for browsing and managing skills |
| `apps/api` | Hono, Cloudflare Workers, Drizzle ORM | REST API and backend services |
| `apps/cli` | Node.js, @clack/prompts | Command-line tool for installing skills |

## Development

### Prerequisites

- [Bun](https://bun.sh/) runtime
- PostgreSQL database (Neon recommended)
- Cloudflare R2 bucket (for storage)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/tasteui.git
cd tasteui

# Install dependencies
bun install

# Environment variables
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# Database setup
cd apps/api && bun run db:migrate
```

### Running Locally

```bash
# Terminal 1 - Start the API
cd apps/api && bun run dev

# Terminal 2 - Start the Web frontend
cd apps/web && bun run dev

# The web app will be at http://localhost:3000
# The API will be at http://localhost:3001
```

### Building for Production

```bash
# Web frontend
cd apps/web && bun run build

# API (Cloudflare Workers)
cd apps/api && bun run deploy

# CLI
cd apps/cli && bun run build
```

## Tech Stack

### Frontend
- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Hugeicons](https://hugeicons.com/)

### Backend
- **Framework**: [Hono](https://hono.dev/)
- **Runtime**: Cloudflare Workers
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Storage**: Cloudflare R2

### CLI
- **Framework**: Node.js + TypeScript
- **Prompts**: [@clack/prompts](https://github.com/bombshell-dev/clack)
- **Package**: Published to npm as `tasteui.dev`

## API Endpoints

The API provides the following public endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List all public skills |
| GET | `/api/skills/:owner/:slug` | Get skill by owner and slug |
| GET | `/api/skills/:slug` | Get skill by slug |

## Skills Directory

Skills are installed to `.agents/skills/` in your project:

```
your-project/
└── .agents/
    └── skills/
        └── minimalism/
            └── SKILL.md
```

This location is recognized by major AI coding agents including Claude Code, Cursor, and OpenCode.

## Database Schema

The API uses PostgreSQL with the following main entities:

- **Users** - Authentication and profiles
- **Skills** - Design system skill definitions
- **Skill Versions** - Versioned skill releases
- **Categories** - Skill categorization

## Scripts Reference

### Web (apps/web)

```bash
bun run dev         # Development server (port 3000)
bun run build       # Production build
bun run preview     # Preview built app
bun run test        # Run Vitest tests
bun run lint        # ESLint
bun run format      # Prettier
bun run typecheck   # TypeScript check
```

### API (apps/api)

```bash
bun run dev         # Development server (port 3001)
bun run deploy      # Deploy to Cloudflare Workers
bun run db:generate # Generate Drizzle migrations
bun run db:migrate  # Run migrations
bun run db:push     # Push schema directly
bun run db:studio   # Drizzle Studio
```

### CLI (apps/cli)

```bash
bun run dev         # Run CLI in development mode
bun run build       # Build CLI for distribution
bun run typecheck   # TypeScript check
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [skills.sh](https://skills.sh) and the open agent skills ecosystem
- Built with [TanStack](https://tanstack.com/), [Hono](https://hono.dev/), and [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Hugeicons](https://hugeicons.com/)

## Support

- 📧 Email: support@tasteui.dev
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/tasteui/issues)
- 📖 Docs: [https://docs.tasteui.dev](https://docs.tasteui.dev)

---

Made with ❤️ by the TasteUI team
