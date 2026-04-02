import {
  CommandLineIcon,
  Clock01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"

export interface NavItem {
  id: string
  label: string
  icon?: typeof StarIcon
  hasArrow?: boolean
  href?: string
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export interface Skill {
  id: string
  name: string
  owner: string
  repo: string
  installs: string
  variant: "audit" | "layout" | "skills" | "search" | "command" | "pattern"
  description: string
}

export interface Category {
  name: string
  count: number
}

export interface SidebarItem {
  icon: typeof StarIcon
  label: string
  active: boolean
}

export const sidebarItems: SidebarItem[] = [
  { icon: StarIcon, label: "Featured", active: true },
  { icon: Clock01Icon, label: "Newest", active: false },
  { icon: StarIcon, label: "Best of the Week", active: false },
  { icon: CommandLineIcon, label: "Themes", active: false },
]

export const categories: Category[] = [
  { name: "Marketing Blocks", count: 10 },
  { name: "Announcements", count: 10 },
  { name: "Backgrounds", count: 33 },
  { name: "Borders", count: 12 },
  { name: "Calls to Action", count: 34 },
  { name: "Clients", count: 16 },
  { name: "Comparisons", count: 6 },
  { name: "Docks", count: 6 },
  { name: "Features", count: 36 },
  { name: "Footers", count: 14 },
  { name: "Heroes", count: 73 },
  { name: "Hooks", count: 31 },
  { name: "Images", count: 26 },
  { name: "Maps", count: 2 },
]

export const skills: Skill[] = [
  {
    id: "1",
    name: "background-paths",
    owner: "vercel-labs",
    repo: "skills",
    installs: "753.1K",
    variant: "pattern",
    description: "Animated flowing line backgrounds",
  },
  {
    id: "2",
    name: "ai-command-palette",
    owner: "vercel-labs",
    repo: "agent-skills",
    installs: "256.6K",
    variant: "command",
    description: "Command palette with AI integration",
  },
  {
    id: "3",
    name: "falling-pattern",
    owner: "anthropics",
    repo: "skills",
    installs: "211.9K",
    variant: "pattern",
    description: "Dotted matrix falling animation",
  },
  {
    id: "4",
    name: "spotlight-search",
    owner: "stripe",
    repo: "agent-skills",
    installs: "189.2K",
    variant: "search",
    description: "Spotlight-style search interface",
  },
  {
    id: "5",
    name: "hero-morph",
    owner: "github",
    repo: "skills",
    installs: "167.8K",
    variant: "layout",
    description: "Morphing hero section transitions",
  },
  {
    id: "6",
    name: "gradient-mesh",
    owner: "prisma",
    repo: "skills",
    installs: "143.5K",
    variant: "audit",
    description: "Animated gradient mesh backgrounds",
  },
]

