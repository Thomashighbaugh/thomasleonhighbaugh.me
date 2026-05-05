<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# fonts

## Purpose
Web font files served statically for the site's typography system.

## Key Files

| File | Description |
|------|-------------|
| `atkinson-regular.woff` | Atkinson Hyperlegible regular weight (primary sans-serif font) |
| `atkinson-bold.woff` | Atkinson Hyperlegible bold weight |
| `BlackHanSans-Regular.woff2` | Black Han Sans decorative Korean font |

## For AI Agents

### Working In This Directory
- Fonts are loaded via `@font-face` in `src/styles/global.css`
- Referenced from CSS as `/fonts/atkinson-regular.woff` (root-relative path)
- Atkinson is the primary body text font configured in `tailwind.config.mjs`
- BlackHanSans is used for decorative/display text

<!-- MANUAL: -->
