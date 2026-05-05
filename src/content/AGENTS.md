<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# content

## Purpose
Astro content collections hosting all site content in Markdown/MDX format. Includes blog posts, project showcases, and legal documents with Zod schema validation.

## Key Files

| File | Description |
|------|-------------|
| `config.ts` | Content collection schemas (blog, projects, legal, work) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `blog/` | Blog post collection (22 posts) (see `blog/AGENTS.md`) |
| `projects/` | Project showcase collection (9 projects) (see `projects/AGENTS.md`) |
| `legal/` | Legal document collection (privacy, terms) (see `legal/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All content collections are defined and validated in `config.ts` with Zod schemas
- Content is written in Markdown (`.md`) with YAML frontmatter
- Frontmatter must match the schema in `config.ts` for each collection type
- The `work` collection exists in `config.ts` but has no content directory yet

### Content Schema Reference

**Blog entries:** title, summary, date, tags[], draft? (boolean)
**Projects:** title, summary, date, tags[], draft? (boolean), demoUrl?, repoUrl?
**Legal:** title, date

### Common Patterns
- Blog posts include inline images in their respective directories
- Draft posts use `draft: true` in frontmatter (hidden from production)
- Tags are used for filtering and search categorization

<!-- MANUAL: -->
