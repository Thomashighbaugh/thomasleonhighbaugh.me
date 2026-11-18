---
name: web-design-guidelines
description: Review UI code in thomasleonhighbaugh.me for Web Interface Guidelines compliance — accessibility, focus states, semantic HTML, keyboard support, and the site's own dark-mode and font conventions. Use when asked to "review my UI", "check accessibility", "audit design", or "review UX" on Astro components or SolidJS islands. Rules are cached locally; no network call per review.
metadata:
  adapted-for: thomasleonhighbaugh.me
  upstream: vercel-labs/agent-skills@web-design-guidelines
  version: 1.0.0-project
---

# Web Interface Guidelines — thomasleonhighbaugh.me

Review UI code against the Vercel Web Interface Guidelines **plus this project's own conventions**,
which are stricter in a few places and non-negotiable.

## Rules source (cached — do not fetch per review)

`references/web-interface-guidelines.md` — cached copy of the upstream rule set, dated in its
header. Read it once per review. Refresh only when it is more than ~90 days old:

```bash
ax https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md --body \
  > .agents/skills/web-design-guidelines/references/web-interface-guidelines.md
```

This project's efficiency rule forbids a network round-trip on every UI review.

## What to review in this codebase

| Kind | Path | Notes |
|---|---|---|
| Astro components | `src/components/*.astro` | Static, zero JS. `Header`, `Footer`, `Container`, `Drawer`, `ArrowCard`, `StackCard`, `SVGHero`, `BaseHead`, `JsonLd`, `MeteorShower`, `TwinklingStars`, `ExternalLinkIcon` |
| SolidJS islands | `src/components/*.tsx` | `SearchBar`, `Search`, `SearchCollection`, `Counter` — the only hydrated code |
| Layouts | `src/layouts/*.astro` | `PageLayout`, `TopLayout`, `BottomLayout`, `ArticleTopLayout`, `ArticleBottomLayout` |
| Global styles | `src/styles/global.css` | `@font-face` blocks, `html`/`body`/`header` base |
| Pages | `src/pages/**/*.astro` | `index`, `about`, `404`, `blog/*`, `projects/*`, `legal/*`, `search/*` |

If no files are given, review `src/components/` and `src/layouts/` — that is where the shared
surface lives, and a defect there repeats on every page.

## Project conventions that override generic advice

1. **Dark mode is a class on `<html>`** (`darkMode: ["class"]` in `tailwind.config.mjs`). Every
   colour decision must have both branches — `bg-white dark:bg-black`,
   `text-black/75 dark:text-white/75`. A component with only light-mode classes is a defect, not a
   style preference. The class is applied by `/js/theme.js`, so do not assume `prefers-color-scheme`
   is the source of truth.
2. **Fonts are self-hosted and preloaded** — Atkinson (body, 400/700), BlackHanSans, and a
   base64-embedded `Dimitri` face in `global.css`. Never introduce a webfont `<link>`; it would
   break the preload strategy in `BaseHead.astro` and cost LCP.
3. **`prefers-reduced-motion` is mandatory for the ambient layer.** `MeteorShower.astro`,
   `TwinklingStars.astro`, and the `twinkle` / `meteor` keyframes are decorative motion that runs
   without user action. They must be suppressed under reduced-motion. This is the most likely real
   accessibility violation in the repo — check it first.
4. **Zero-JS default.** A new interactive feature is a SolidJS island with `client:visible` or
   `client:idle`, not a `<script>` tag. Inline scripts exist only for theme, scroll, animate, copy
   in `BaseHead.astro` and are pre-existing; do not add more.
5. **Tailwind utilities, not new CSS.** Extend `tailwind.config.mjs` rather than adding rules to
   `global.css`. `applyBaseStyles: false` means base styles are hand-managed — understand that
   before touching `@layer base`.
6. **`maxWidth: "full"` on prose.** Typography plugin defaults are overridden site-wide; do not
   "fix" measure by re-narrowing inside one component.

## Output format

Terse, `file:line`, highest severity first:

```
[severity] rule — file:line — what is wrong — the fix
```

Severity: `blocker` (keyboard trap, unlabelled control, invisible focus), `high` (contrast,
missing dark-mode branch, reduced-motion), `medium` (semantics, target size, heading order),
`low` (polish). Skip anything you cannot point at a line for. If the code is clean, say so — do
not pad the report.

## Boundaries

This skill reviews **compliance**. For aesthetic direction and "does this look generic", use the
`design-taste-frontend` skill. For anti-AI visual tells specifically, the global `antislop-ui`
and `antislop-human` skills cover overlap — do not duplicate their findings verbatim.
