<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# legal

## Purpose
Legal document route pages. Uses dynamic routing to render privacy policy and terms of service from the legal content collection.

## Key Files

| File | Description |
|------|-------------|
| `[...slug].astro` | Dynamic route for legal documents — renders privacy.md and terms.md |

## For AI Agents

### Working In This Directory
- `[...slug].astro` catches all legal document paths (e.g., `/legal/privacy`, `/legal/terms`)
- Legal documents are fetched from `src/content/legal/` collection
- Uses the same dynamic routing pattern as blog and projects sections

## Dependencies

### Internal
- `@layouts/ArticleTopLayout` and `ArticleBottomLayout` - Document page layouts
- `src/content/legal/` - Legal document content collection

<!-- MANUAL: -->
