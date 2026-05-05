<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# projects

## Purpose
Project listing and individual project route pages. Uses Astro's dynamic routing with catch-all slugs to render individual project pages from the content collection.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | Projects listing page (grid of project cards) |
| `[...slug].astro` | Dynamic route for individual project pages |

## For AI Agents

### Working In This Directory
- `[...slug].astro` catches all project paths (e.g., `/projects/my-project`)
- Projects are fetched from `src/content/projects/` collection via `getCollection('projects')`
- The slug is matched against project IDs from the content collection
- `index.astro` renders a grid of project cards with preview information

### Common Patterns
- Same dynamic routing pattern as the blog section
- Projects may have optional `demoUrl` and `repoUrl` in frontmatter
- Content fetching uses `astro:content` module

## Dependencies

### Internal
- `@layouts/ArticleTopLayout` and `ArticleBottomLayout` - Project detail layouts
- `@components/ArrowCard` - Project preview cards
- `@lib/utils` - Formatting utilities

<!-- MANUAL: -->
