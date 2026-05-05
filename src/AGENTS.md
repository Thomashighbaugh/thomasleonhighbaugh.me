<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# src

## Purpose
Application source code for the Astro portfolio and blog site. Contains components, pages, content collections, layouts, styles, and utility functions.

## Key Files

| File | Description |
|------|-------------|
| `consts.ts` | Global constants: site metadata, navigation links, social links |
| `types.ts` | TypeScript interfaces and types (Page, Site, Links, Socials) |
| `env.d.ts` | Astro type references for `.astro` files |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components (Astro + SolidJS) (see `components/AGENTS.md`) |
| `layouts/` | Page layout templates (see `layouts/AGENTS.md`) |
| `pages/` | Route pages and API endpoints (see `pages/AGENTS.md`) |
| `content/` | Astro content collections: blog, projects, legal (see `content/AGENTS.md`) |
| `lib/` | Utility functions (see `lib/AGENTS.md`) |
| `styles/` | Global CSS with Tailwind directives (see `styles/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All files under `src/` use the `@/` import alias (e.g., `@components/`, `@lib/`)
- Content collections are defined in `src/content/config.ts` with Zod schemas
- Pages use Astro file-based routing under `src/pages/`

### Common Patterns
- Components in `components/` are either `.astro` (static/server) or `.tsx` (SolidJS interactive)
- Layouts follow a top/bottom split pattern for article pages
- Content is authored in Markdown/MDX in `content/` subdirectories

## Dependencies

### Internal
- `public/` - Static assets (fonts, JS, images)

### External
- Astro, SolidJS, Tailwind CSS, Fuse.js, clsx, tailwind-merge

<!-- MANUAL: -->
