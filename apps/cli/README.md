```
████████╗ █████╗ ███████╗████████╗███████╗██╗   ██╗██╗
╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██║   ██║██║
   ██║   ███████║███████╗   ██║   █████╗  ██║   ██║██║
   ██║   ██╔══██║╚════██║   ██║   ██╔══╝  ██║   ██║██║
   ██║   ██║  ██║███████║   ██║   ███████╗╚██████╔╝██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝
```

Command-line interface for installing design system skills to your coding agents.

## Installation

```bash
npx tasteui.dev
```

## Usage

```bash
# Show help with beautiful banner
npx tasteui.dev

# List available design skills
npx tasteui.dev list

# Install a skill
npx tasteui.dev add <owner>/<skill-name>

# Configure API endpoint (optional)
npx tasteui.dev config
```

## Quick Start

```bash
# Browse and install skills interactively
npx tasteui.dev list

# Or install directly by name
npx tasteui.dev add jane/minimalism
npx tasteui.dev add alex/glassmorphism
```

## No Authentication Required

The CLI works out of the box without any configuration:

- **`tasteui list`** - Browse public design skills (no auth needed)
- **`tasteui add <owner>/<skill>`** - Install skills (no auth needed)

## How Installation Works

When you run `tasteui add <owner>/<skill>`, the CLI will:

1. **Fetch** the skill from the TasteUI API
2. **Install** to `./.agents/skills/<skill-name>/`

### Installation Flow

```bash
$ tasteui add jane/minimalism

✓ Found: Minimalism by jane

Skill Details:
  Name: Minimalism
  Author: jane
  Category: design-system
  Description: Clean, minimal design system

Will install to: ./.agents/skills/

◆ Install this skill?
│ ● Yes / ○ No

✓ Installed 1 file(s) to ./.agents/skills/minimalism/

The skill is now available in your coding agents!
```

## Installation Directory Structure

Skills are installed **per-project** in the universal `.agents/skills` folder:

```
your-project/
└── .agents/
    └── skills/
        └── minimalism/
            └── SKILL.md          # ← Design system documentation
```

This location is recognized by all major AI coding agents (OpenCode, Claude Code, Cursor, etc.)

## Configuration (Optional)

The CLI stores optional configuration in `~/.config/tasteui/config.yaml`:

```yaml
apiUrl: https://api.tasteui.dev
```

Run `tasteui config` to customize the API URL.

## API Integration

The CLI connects to your Hono API backend. Required public endpoints:

- `GET /api/skills` - Returns an array of design skills
- `GET /api/skills/:owner/:slug` - Returns a single skill by owner username and slug
- `GET /api/skills/:slug` - Returns a single skill by slug (fallback)

## Development

```bash
cd apps/cli
bun install
bun run dev        # Run in development mode
bun run build      # Build for distribution
bun run typecheck  # Type check
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `list` | Browse public design skills with interactive selection |
| `add <owner>/<skill>` | Install a skill to `.agents/skills/` |
| `config` | Configure API endpoint and optional settings |
| `--help` | Show help message |
| `--version` | Show version number |

## Key Features

- ✅ **Universal location** - Installs to `.agents/skills/` (works with all agents)
- ✅ **Project-only** - No global installation
- ✅ **GitHub-style format** - `owner/slug` identifier
- ✅ **No auth required** - Works out of the box
- ✅ **Interactive prompts** - Beautiful CLI with `@clack/prompts`

## Inspired By

- [skills.sh](https://skills.sh) - The open agent skills ecosystem
- [vercel-labs/skills](https://github.com/vercel-labs/skills) - Vercel's skills CLI
- [typeui.sh](https://typeui.sh) - Design system skills for agentic tools

## License

MIT
