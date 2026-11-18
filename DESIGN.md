---
name: thomasleonhighbaugh.me
description: Monochrome personal portfolio and blog with a single fixed SVG mark and animated starfield.
colors:
  paper: "#ffffff"
  ink: "#000000"
  body-light: "rgba(0, 0, 0, 0.75)"
  body-dark: "rgba(255, 255, 255, 0.75)"
  hairline-light: "rgba(0, 0, 0, 0.15)"
  hairline-dark: "rgba(255, 255, 255, 0.20)"
  hero-charcoal: "#292A31"
  hero-stroke: "#37383F"
  hero-shadow: "#2d2d2d"
  mark-ice: "#94e4ff"
  mark-blue: "#0badff"
  mark-deep: "#0872A8"
  mark-magenta: "#f31941"
  mark-yellow: "#feee70"
  mark-pale: "#e9efff"
  mark-shadow: "#222222aa"
typography:
  display:
    fontFamily: "BlackHanSans, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0em"
  heading:
    fontFamily: "BlackHanSans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0em"
  nav:
    fontFamily: "BlackHanSans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0em"
  body:
    fontFamily: "Atkinson, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-small:
    fontFamily: "Atkinson, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  mark:
    fontFamily: "Dimitri, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "48px"
components:
  nav-link:
    textColor: "{colors.body-light}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    padding: "0px 12px"
    size: "32px"
  nav-link-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    padding: "0px 12px"
    size: "32px"
  entry-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-light}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "16px"
  entry-card-hover:
    backgroundColor: "{colors.hairline-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  tag-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-light}"
    typography: "{typography.body-small}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  header-scrolled:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-light}"
    typography: "{typography.nav}"
    padding: "0px 0px"
  callout-border:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.body-light}"
    rounded: "{rounded.none}"
    padding: "16px"
---

# Design System — thomasleonhighbaugh.me

## Overview

A monochrome editorial page with one chromatic object on it. Everything that is not the
hero mark is black, white, or an opacity step between them: no accent color, no brand hue,
no gradient text. Hierarchy is carried entirely by typeface, weight, scale, and opacity —
which is why the two type systems have to stay distinct and why any new color is an
identity decision rather than a styling one.

The site reads as a printed broadside in dark mode and as a clean sheet of paper in light
mode. Dark is the mode the identity was designed in; light is the mode that has to keep
working.

Two surfaces behave differently and should be judged differently:

- **Home** is a single viewport: an animated background, the SVG mark, and the name. Nothing
  else. It is a title card, and it is meant to be one.
- **Everything else** (About, Blog, Projects, Search, article pages) is a scrolling document
  on a 1024 px measure, with a fixed translucent header and a plain footer.

## Colors

The palette is a two-value system plus one photographic exception.

| Role | Light | Dark |
|---|---|---|
| Background | `#ffffff` | `#000000` |
| Body text | `rgba(0,0,0,0.75)` | `rgba(255,255,255,0.75)` |
| Emphasized text | `#000000` | `#ffffff` |
| Hairline / border | `rgba(0,0,0,0.15)` | `rgba(255,255,255,0.20)` |

`html` carries `color-scheme: light` and flips to `dark` under `.dark`. Both values are
declared as real background colors, not inherited, so the page cannot flash through a
third surface.

**The mark is the only saturated color on the site.** `SVGHero.astro` defines three
gradients — an ice-to-blue vertical wash (`#94e4ff` → `#0badff` → `#0872A8`), a magenta and
yellow horizontal sweep (`#e9efff` → `#f31941` → `#feee70`), and a near-transparent pale
overlay — inside a blob outlined with `#222222aa` at 2 px. These values live in the
component and are not design tokens to be reused elsewhere. Do not sample the mark's blue
for a link color, and do not add a fourth gradient.

Opacity is the only way to build a tint here. A "muted" surface is `black/5` or `white/10`,
never a gray hex and never a warm neutral.

### Light mode is a parity target, not a fallback

The site is built dark-first and the home page is pinned dark in `public/js/theme.js`
(`if (isHome) return "dark"`), so the impact mark is always presented on black. Light mode
is what every interior page falls back to when the visitor's system or stored preference is
light — which is the common case for the people most likely to be evaluating the site.

The failure mode to watch for is a **sign flip**: choosing a *lighter* gray for the light
theme than for the dark one. Against white, lighter means less contrast; the intent
("muted") is achieved by going darker, not lighter. Every contrast defect found on this site
came from that one mistake.

| Slot | Wrong (light) | Measured | Right | Measured |
|---|---|---|---|---|
| Muted label | `neutral-500` | 4.74:1 | `black/75` | 10.37:1 |
| Secondary control | `neutral-400` | 2.52:1 | `black/75` | 10.37:1 |
| Card border | `neutral-200` | 1.26:1 | `black/15` | — visible hairline |
| Placeholder | `neutral-400` on `black/5` | 2.25:1 | `black/60` | 5.53:1 |

The rule: **use the `black/N` ↔ `white/N` pairs, and pick N so that the light value is at
least as strong as the dark value.** Where a value is chosen independently for each mode,
check the pair, not the mode.

Article body copy is the one sanctioned exception: it inherits the Tailwind typography
plugin's own gray scale (`gray-700`/`gray-900` on light, inverted on dark) rather than the
opacity steps. Those values are design, not drift, and a `detect` pass reports them as
`design-system-color` advisories — expected noise, not a defect to chase.

## Typography

Two families, self-hosted, with a strict division of labor:

- **BlackHanSans** — headings `h1`–`h6`, the page heading utility, navigation links, and
  everything inside `header` and `footer`. A heavy condensed display face with a small
  x-height and a distinctly flat, poster-like tone.
- **Atkinson** — all body copy, list text, card summaries, and prose. A humanist sans with
  high legibility at small sizes, chosen for exactly that.

The hero name is BlackHanSans at `text-6xl` (3.75 rem), weight 600, drawn twice: one copy
absolute-positioned in `#292A31` with a `2px 2px 0 #2d2d2d` text shadow, one relative copy
in white stroked at `2.5px #37383F` with `paint-order: stroke`. That double-draw is the
site's one typographic flourish and it belongs to the name only.

Prose pages use the Tailwind typography plugin with `max-w-full`; the measure is therefore
set by the containing layout, not by a `65ch` rule. Keep line length honest by keeping the
container honest.

`Dimitri` is a base64-embedded display face used for exactly two text nodes: the "TLH"
initials inside the SVG mark. It is not available for page copy. It is inline-embedded
precisely so the mark renders on first paint with no extra request.

## Layout

- **Home**: `h-screen` with `html, body { height: 100vh; overflow: hidden }`. Content is a
  centered flex column: mark, then name, 32 px apart.
- **Documents**: `max-w-screen-lg` (1024 px), `p-5` (20 px) gutter, `mt-16` to clear the
  fixed 64 px header, `pb-16` before the footer.
- **Header**: fixed, `h-16`, full width, inside a `Container size="xl"`. Logo left, centered
  nav on `md` and up, theme and menu controls right. Transparent at rest; `bg-white/75`
  (dark: `bg-black/50`) with `backdrop-blur-sm` once scrolled.
- **Footer**: absolute on the home page so it sits above the full-viewport hero; static on
  every other page.
- **Breakpoints**: default Tailwind. The one meaningful jump is `md`, where the centered nav
  appears and the drawer disappears. Two-column layouts on About are `lg:grid-cols-2`.

The home hero is the fragile layout in this system. The mark is a fixed 55 rem (880 px)
square, the gap is 32 px, and the name adds roughly 60 px — about 972 px total inside a
viewport clipped at `100vh`. On a 900 px laptop viewport that overflows in both directions
with no way to scroll. Any change here is a fit calculation, not a taste call.

## Elevation & Depth

There are no shadows in this system except one: the `2px 2px 0` offset on the hero name's
under-copy, which is a print-style drop, not a material elevation.

Depth comes from two other mechanisms:

1. **Opacity steps** — `black/5` hover, `black/15` hairline, `black/75` body.
2. **Backdrop blur on the header when scrolled** — `backdrop-blur-sm` plus `saturate-200`
   over a translucent ground. It reads as the page sliding under glass.

Do not introduce `shadow-*`, `drop-shadow-*`, or layered card elevation. A card is a border
and a radius; a raised surface is a translucent fill.

## Shapes

- `rounded` (4 px) — navigation links, small controls.
- `rounded-lg` (8 px) — entry cards, content blocks.
- `rounded-full` — tag chips and collection pills.
- `rounded-none` — section callouts on About, which are drawn with a 1 px border only.

Borders are always 1 px and always a low-opacity hairline. The mark is the one organic
shape in the system: a blob with a 2 px stroke, deliberately inconsistent with the rest of
the geometry. That contrast is intentional; do not round page elements to match it.

## Components

**Navigation link** — BlackHanSans 14 px, 32 px tall, 12 px horizontal padding, 4 px radius.
Inactive is body opacity; active is inverted (black ground, white text; in dark mode the
inverse) with the same radius.

**Entry card** (`ArrowCard.tsx`) — the shared representation of a blog post or project. A
flex row inside a 1 px hairline border, 8 px radius, 16 px padding: date (uppercase, small),
optional type pill, title at semibold in full-contrast text, two-line-clamped summary, and
tag chips. No image, no thumbnail, no metrics. Hover raises the ground by one opacity step
and darkens the title. It is the same component for both collections, differing only in the
optional pill.

**Tag chip** — full-radius, 1 px hairline, 14 px text, `2px 8px`. Never filled, never
colored.

**Header** — see Layout. Note that its typeface, not its size, is what makes it read as
navigation.

**Callout section** (About page) — a bordered block at `lg:border-black/50`, 16 px padding,
holding a title row with a "see all" link and a list of entry cards.

**The mark** (`SVGHero.astro`) — 200×200 `viewBox` rendered at 880 px square. Three
gradients, a stroked path that rotates continuously via SMIL `animateTransform` at a 6 s
indefinite loop, and two `Dimitri` text nodes reading "TLH". Fixed size, fixed internals.

## Do's and Don'ts

**Do**

- Build hierarchy from typeface, weight, scale, and opacity. Those four are enough.
- Keep the two families separate: BlackHanSans never sets a paragraph, Atkinson never sets
  a navigation item.
- Use `black/N` and `white/N` for every tint. State the opacity, not a hex.
- Compose around the mark at its 55 rem size and fix overflow in the wrapper.
- Verify both themes on every change; the identity was designed in dark mode and the light
  mode is where contrast regressions hide.
- Keep the home page a title card. If content has to be added there, add it below the fold
  on a scrollable page rather than compressing the hero.

**Don't**

- Don't modify `SVGHero.astro` — gradients, `animateTransform`, the two `Dimitri` text
  nodes, the `viewBox`, and the `w-[55rem] h-[55rem]` box are the mark.
- Don't add an accent color, a brand hue, or a gradient outside the SVG.
- Don't sample the mark's blue for links, borders, or hover states.
- Don't add `shadow-*`, card elevation stacks, or glassmorphism beyond the scrolled header.
- Don't set body copy below `/75` opacity, or small text below that on the dark ground.
- Don't pick a *lighter* gray for the light theme than for the dark theme. That is the sign
  flip that produced every contrast defect in this system. Muted in light mode means darker.
- Don't introduce a `neutral-*` / `gray-*` ramp for text, borders, or icons — the two files
  that did (`StackCard`, `SearchBar`/`SearchCollection`) drifted one step the wrong way in
  light mode. Use `black/N` ↔ `white/N`. Neutral surfaces (the mobile drawer) are the only
  sanctioned exception.
- Don't introduce a third typeface. `Dimitri` is for the mark only.
- Don't replace the animated background with a static image or a CSS gradient to make the
  hero easier to fit.
- Don't use `h-screen` with `overflow: hidden` on a page that has content taller than the
  viewport — the home page is the sole exception, and it is currently the reason the hero
  clips on short screens.
