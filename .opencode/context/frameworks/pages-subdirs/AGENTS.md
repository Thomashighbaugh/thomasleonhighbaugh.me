<!-- Parent: ../../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# pages

## Purpose
Application route pages and API endpoints using Astro's file-based routing. All routes are defined by the file structure within this directory.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | Homepage |
| `about.astro` | About page |
| `robots.txt.ts` | Dynamic robots.txt endpoint |
| `rss.xml.ts` | RSS feed endpoint |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `blog/` | Blog listing and individual post routes (see `blog/AGENTS.md`) |
| `projects/` | Project listing and individual project routes (see `projects/AGENTS.md`) |
| `legal/` | Legal document pages (privacy, terms) (see `legal/AGENTS.md`) |
| `search/` | Search page (see `search/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Astro file-based routing: `about.astro` → `/about`, `blog/index.astro` → `/blog`
- Dynamic routes use `[...slug].astro` for catch-all parameters
- `.ts` endpoints return non-HTML responses (robots.txt, RSS XML)
- Pages import layouts from `@layouts/` and components from `@components/`

### Common Patterns
- Each page imports a layout wrapper and passes props for title/description
- Content pages (blog, projects) use Astro content collections for data
- Dynamic slugs fetch content from `src/content/` collections

## Dependencies

### Internal
- `@layouts/` - Page layout templates
- `@components/` - Reusable components
- `@content/config` - Content collection schemas (via `astro:content`)

<!-- MANUAL: -->
