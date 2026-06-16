<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-16 -->

# components

## Purpose
Reusable UI components for the portfolio and blog site. Includes both static Astro components (`.astro`) and interactive SolidJS islands (`.tsx`).

## Key Files

| File | Description |
|------|-------------|
| `ArrowCard.tsx` | SolidJS card component for blog/project entries with arrow link |
| `BaseHead.astro` | HTML `<head>` metadata, SEO tags, and social sharing |
| `Container.astro` | Width-constrained layout wrapper |
| `Counter.tsx` | SolidJS interactive counter component |
| `Drawer.astro` | Mobile navigation drawer/menu |
| `ExternalLinkIcon.astro` | External link indicator icon |
| `Footer.astro` | Site footer with links and credits |
| `Header.astro` | Site header with navigation |
| `MeteorShower.astro` | Animated meteor shower background effect |
| `Search.tsx` | SolidJS search component with Fuse.js integration |
| `SearchBar.tsx` | SolidJS search input bar |
| `SearchCollection.tsx` | SolidJS search results collection display |
| `StackCard.astro` | Technology stack display card |
| `SVGHero.astro` | SVG hero/banner section |
| `TwinklingStars.astro` | Animated twinkling stars background effect |

## For AI Agents

### Working In This Directory
- `.astro` files are Astro components (server-rendered by default)
- `.tsx` files are SolidJS interactive components (client islands)
- SolidJS components use `use:client` directive when used in Astro pages
- All components are imported via the `@components/` alias

### Common Patterns
- Props defined via Astro `---` frontmatter or TypeScript `type Props`
- SolidJS components use signals (`createSignal`) for state management
- Tailwind utility classes used for styling throughout
- Animated effects (MeteorShower, TwinklingStars) use CSS animations from `tailwind.config.mjs`

## Dependencies

### Internal
- `@lib/utils` - Utility functions (formatDate, truncateText)

### External
- SolidJS 1.9 - Interactive component runtime
- Fuse.js 7.1 - Client-side search (used by Search components)
- clsx + tailwind-merge - Class name management

<!-- MANUAL: -->
