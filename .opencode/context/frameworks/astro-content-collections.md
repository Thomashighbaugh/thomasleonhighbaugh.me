# Astro Content Collections Convention

## Schema Validation
All content collections defined in `src/content/config.ts` with Zod schemas:

- **blog**: title, summary, date, tags[], draft? (boolean)
- **projects**: title, summary, date, tags[], draft?, demoUrl?, repoUrl?
- **legal**: title, date
- **work**: company, role, dateStart, dateEnd (collection exists but no content directory yet)

## Content Organization
- Each content item is a subdirectory with `index.md`
- Images co-located alongside `index.md`
- Frontmatter must exactly match Zod schema

## Routing Pattern
- `src/pages/[collection]/[...slug].astro` for dynamic rendering
- `src/pages/[collection]/index.astro` for listing pages

## Import Pattern
- Content fetched via `getCollection('name')` and `getEntryBySlug('name', 'slug')` from `astro:content`
