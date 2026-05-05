<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# layouts

## Purpose
Page layout templates that wrap page content with shared structure (header, footer, navigation). Uses a top/bottom split pattern where article and standard pages have different layout combinations.

## Key Files

| File | Description |
|------|-------------|
| `TopLayout.astro` | Top portion of standard page layouts (header, nav) |
| `BottomLayout.astro` | Bottom portion of standard page layouts (footer, scripts) |
| `ArticleTopLayout.astro` | Top portion of article/blog page layouts |
| `ArticleBottomLayout.astro` | Bottom portion of article/blog page layouts |
| `PageLayout.astro` | Combined full page layout wrapper |

## For AI Agents

### Working In This Directory
- Layouts use a split pattern (Top/Bottom) to allow fine-grained content control
- `PageLayout.astro` combines Top and Bottom for simple pages
- Article layouts include additional metadata display (dates, tags)
- Layouts set `<title>` and `<meta>` tags via props

### Common Patterns
- Slot-based content insertion via Astro `<slot />`
- Props passed from pages to control title, description, and active nav state
- BaseHead component included in top layouts for SEO metadata

## Dependencies

### Internal
- `@components/BaseHead.astro` - SEO head metadata
- `@components/Header.astro` - Site navigation header
- `@components/Footer.astro` - Site footer
- `@consts` - Site configuration constants

<!-- MANUAL: -->
