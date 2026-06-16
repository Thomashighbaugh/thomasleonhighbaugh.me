<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-16 -->

# styles

## Purpose
Global CSS styles including Tailwind CSS directives, custom font faces, and base layer styles.

## Key Files

| File | Description |
|------|-------------|
| `global.css` | Tailwind directives, `@font-face` declarations (Atkinson, Dimitri), CSS variables, and utility layer styles |

## For AI Agents

### Working In This Directory
- `global.css` is imported in the root layout and applies globally
- Tailwind base/components/utilities layers are explicitly included (`@tailwind base`, etc.)
- Custom fonts are declared via `@font-face` in the `@layer base` block
- `applyBaseStyles: false` in `astro.config.mjs` disables automatic Tailwind base injection (this file handles it)
- CSS variables are defined in `:root` for theme configuration

### Common Patterns
- Atkinson font is the primary sans-serif font (loaded via `/public/fonts/`)
- Dimitri font is embedded as a base64 woff2 for inline loading
- No CSS modules or scoped styles — all styling via Tailwind utility classes

<!-- MANUAL: -->
