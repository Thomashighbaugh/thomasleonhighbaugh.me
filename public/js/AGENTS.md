<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# js

## Purpose
Client-side JavaScript files for frontend interactivity, animations, theming, and utilities.

## Key Files

| File | Description |
|------|-------------|
| `animate.js` | Scroll-based animation trigger (adds `.show` class to `.animate` elements) |
| `bg.js` | Starfield and particle background generation for visual effects |
| `copy.js` | Clipboard copy functionality for code blocks |
| `scroll.js` | Custom scroll behavior and scroll-based interactions |
| `theme.js` | Dark/light theme toggle with localStorage persistence |

## For AI Agents

### Working In This Directory
- Scripts are loaded in Astro layouts via `<script>` tags (not module imports)
- These are vanilla JS — no bundling or TypeScript compilation
- Scripts run in the browser context and access DOM directly
- `theme.js` manages the dark mode class on `<html>` element

<!-- MANUAL: -->
