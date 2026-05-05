<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# blog

## Purpose
Blog listing and individual post route pages. Uses Astro's dynamic routing with catch-all slugs to render individual blog posts from the content collection.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | Blog listing page (paginated list of all posts) |
| `[...slug].astro` | Dynamic route for individual blog posts — matches any blog post slug |

## For AI Agents

### Working In This Directory
- `[...slug].astro` catches all blog post paths (e.g., `/blog/my-post-slug`)
- Blog posts are fetched from `src/content/blog/` collection via `getCollection('blog')`
- The slug is matched against post IDs from the content collection
- `index.astro` renders a paginated/scrollable list of all blog posts

### Common Patterns
- Dynamic routes destructure `Astro.params.slug` from the URL
- Content fetching uses `astro:content` module (`getCollection`, `getEntryBySlug`)
- Posts include metadata (date, tags, reading time) displayed in the article layout

## Dependencies

### Internal
- `@layouts/ArticleTopLayout` and `ArticleBottomLayout` - Article page layouts
- `@components/ArrowCard` - Post preview cards on listing page
- `@lib/utils` - Formatting utilities (formatDate, readingTime)

<!-- MANUAL: -->
