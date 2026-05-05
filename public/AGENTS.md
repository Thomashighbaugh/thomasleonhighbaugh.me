<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# public

## Purpose
Static assets served at the root URL path. Contains fonts, client-side JavaScript, images, SVGs, and configuration files for search engines and social sharing.

## Key Files

| File | Description |
|------|-------------|
| `favicon.svg` | Browser tab icon |
| `robots.txt` | Search engine crawling rules |
| `brand.svg` | Brand logo SVG |
| `social.svg` | Social sharing image graphic |
| `stack.svg` | Technology stack illustration |
| `ui.svg` | UI illustration |
| `planet.png` | Decorative planet image |
| `open-graph.jpg` | Open Graph social preview image |
| `copy.svg` | Copy icon SVG |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `fonts/` | Web fonts (Atkinson, BlackHanSans) (see `fonts/AGENTS.md`) |
| `js/` | Client-side JavaScript files (see `js/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Files in `public/` are served at the root path (e.g., `/favicon.svg`, `/fonts/atkinson-regular.woff`)
- Static assets are referenced directly in HTML/CSS without a `public/` prefix
- SVG files should be optimized for web use

<!-- MANUAL: -->
