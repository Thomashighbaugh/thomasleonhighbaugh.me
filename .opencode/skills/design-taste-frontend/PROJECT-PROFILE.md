# PROJECT-PROFILE — tasteskill 2.5 for thomasleonhighbaugh.me

This file binds the upstream `tasteskill` (installed here as `design-taste-frontend`) to **this**
repository. Where it conflicts with the upstream `SKILL.md`, this file wins.

## What this project actually is

A personal portfolio and blog. Not a company marketing site, not a product landing page, not a
shop. The audience arrives from a search result, an HN thread, or a link — they are already
interested. The job of the design is to **get out of the way of the writing** while still looking
deliberate rather than templated.

Upstream is built for "the website a good company would ship." That framing is useful for the
portfolio landing page and for project pages. It is actively wrong for `/blog/<slug>/` — an article
is continuous prose, not a sequence of full-screen marketing sections.

## Stack — hard constraints

| Layer | Reality | Rule |
|---|---|---|
| Framework | Astro 5.18, static output | No React, Next, Vue, Svelte, or new framework |
| Interactivity | SolidJS islands only (`SearchBar`, `Search`, `SearchCollection`, `Counter`) | Follow the existing directives: `client:load` on `Search` (`src/pages/search/index.astro`), `client:idle` for the blog and project index search. New islands default to `client:idle` or `client:visible` |
| Styling | Tailwind 3.4, `applyBaseStyles: false` | Extend `tailwind.config.mjs`; do not add a CSS-in-JS layer or a second utility system |
| Client JS | Effectively none on content pages | **No shader runtimes, WebGL, GSAP, Framer Motion, or animation libraries.** CSS transitions/keyframes only |
| Images | `sharp` at build via `<Image>`/`<Picture>` | Do not introduce a second image pipeline |
| Deploy | Vercel, static | No SSR, no edge functions |

A visitor on a mid-range phone over 4G is the target. Anything that requires downloading a JS
animation engine is disqualified here, however good it looks in the skill's demos.

## The design system already in place — use it, do not replace it

**Type**
- `Atkinson` — body and UI, 400/700, self-hosted `.woff`, **preloaded** in `BaseHead.astro`
- `BlackHanSans` — display
- `Dimitri` — embedded as base64 in `src/styles/global.css`
- `@tailwindcss/typography` with `maxWidth: "full"`

**Colour** — deliberately restrained: `bg-white dark:bg-black`, body text `text-black/75
dark:text-white/75`. Dark mode is a class on `<html>` (`darkMode: ["class"]`), applied by
`/js/theme.js`. **Every new element needs both branches.** The site does not have a brand accent
colour; introducing a saturated accent is a design decision that needs the owner's sign-off, not an
agent's initiative.

**Motion** — `twinkle` and `meteor` keyframes, plus `rotate-45/135/225/315`. `MeteorShower.astro`
and `TwinklingStars.astro` provide the ambient layer. `prefers-reduced-motion` must suppress it —
this is a project requirement, not a suggestion.

**Component vocabulary** (`src/components/`)
`Container`, `Header` (with `.scrolled` state), `Footer`, `Drawer`, `ArrowCard` (post/project
card), `StackCard`, `SVGHero`, `BaseHead`, `JsonLd`, `ExternalLinkIcon`, `MeteorShower`,
`TwinklingStars`, plus the Solid search trio.

**Layouts** (`src/layouts/`)
`PageLayout` → `TopLayout` / `BottomLayout`, with `ArticleTopLayout` / `ArticleBottomLayout` for
article pages.

**Reuse over invention.** A new card that duplicates `ArrowCard` with different spacing is a defect.
If a layout genuinely does not exist, add it in `src/layouts/` and compose from `PageLayout`.

## Which upstream house rules apply here

| # | Upstream rule | Status in this project |
|---|---|---|
| 1 | No caption under any image | **Applies.** Article images carry no captions; credit goes in one footer line |
| 2 | Every visual renders at 1440/1024/768/390 | **Applies** |
| 3 | One section per screen; section = 1–2 screens | **Landing page only** (`index.astro`, project pages). **Overridden for articles** — a blog post is prose and its sections are headings, not screens |
| 4 | Equal left and right content edges | **Applies** |
| 5 | Hover micro-animations; no tilt/carousel/timed tabs | **Applies, with a hard override:** everything respects `prefers-reduced-motion`. Also, the site has no carousels or auto-advancing content at all — keep it that way |
| 6 | More and better real photographs | **Applies in spirit, not in payload.** Use the project's own assets (`public/`, per-post images in `src/content/blog/<slug>/`). **Do not pull this skill's stand-in photo library into the repo** — see "Assets" below |
| 7 | Real full-colour icons | **Applies.** Use `ExternalLinkIcon.astro`, `SVGHero.astro`, and the SVGs already in `public/`. Do not add a drawn icon set |
| 8 | Shader effects and scenes on tech pages | **Overridden.** This *is* a tech blog, so upstream would permit them — but the zero-JS constraint forbids shader runtimes. Implement any "moment" as CSS-only, or use the existing meteor/twinkle layer |
| 9 | Addresses: street/district only, `.example` contacts | **Not applicable.** This is a person's real site with a real contact page (`links.thomasleonhighbaugh.me`). Never invent or obscure contact details |

## Assets — why most of this skill's payload is gitignored

Upstream ships ~35 MB of stand-in photography, object renders, icon sets, and layout scenes
(`assets/photos`, `objects`, `icons`, `layout`, `scenes`, `moments`). This project **already owns**
its imagery: real photos in `public/` and per-post images beside each `index.md`.

Those six directories are therefore gitignored. The skill's `scripts/`, `references/`,
`library/`, and the smaller `assets/{ui,components,effects,backgrounds,diagrams,motion}` —
the parts that are actually instructions rather than stock imagery — remain tracked and usable.

### This copy is not managed by `npx skills`

This skill (and the five others in this folder) live in `.opencode/skills/`, which `npx skills`
does **not** touch. They were installed once, then adapted, and the adapted files are the source of
truth. `skills-lock.json` is empty and `.agents/skills/` is empty by design — there is no upstream
copy to drift from and nothing for `npx skills update` to overwrite.

**Do not run `npx skills add <repo> -y` bare in this repo.** It writes to `.agents/skills/` and
symlinks into `.claude/skills/`, which both OpenCode and this project scan — you would get a second
generic copy of the skill shadowing the adapted one. If you ever want the upstream text back for
reference, fetch it explicitly instead:

```bash
gh api repos/Leonxlnx/taste-skill/contents/skills/taste-skill/SKILL.md \
  --jq '.content' | base64 -d > /tmp/taste-skill-upstream.md
```

The stand-in imagery (~35 MB) can be recovered the same way from
`repos/Leonxlnx/taste-skill/contents/skills/taste-skill/assets/<dir>` if a task genuinely needs it —
but for this site it usually does not, because the project supplies its own photographs and icons.

## Gate — how the upstream enforcement runs in OpenCode


Upstream registers a Claude Code `Stop` hook that shells out to `scripts/gate.mjs --hook claude`.
That hook was removed from `SKILL.md`'s frontmatter because OpenCode does not read Claude skill
hooks, and this project's hook runner (`.opencode/plugins/command-hooks`) fires on file writes and
session events rather than on a Claude-style Stop. Wiring a browser-driving gate onto every session
stop would also be slow and surprising.

Run the checks explicitly instead — after a visual change, on the **built** output:

```bash
npm run build && npm run preview          # gate needs a real page, not the dev server
node .opencode/skills/design-taste-frontend/scripts/gate.mjs --page http://localhost:4321
node .opencode/skills/design-taste-frontend/scripts/consistency.mjs   # system/edge consistency
node .opencode/skills/design-taste-frontend/scripts/copy-lint.mjs     # copy tells
```

Requires Node 22+ and Chrome/Edge/Chromium on the machine. If they are absent, fall back to the
`web-design-guidelines` review rules plus a manual pass — and say which checks were skipped rather
than implying they ran.

## Division of labour with the other skills in this repo

| Question | Skill |
|---|---|
| Does this look generic / AI-made? Art direction, composition, type scale | **`design-taste-frontend`** (this one) |
| Does this violate accessibility, focus, semantics, keyboard rules? | `web-design-guidelines` |
| How fast is it? CWV, LCP, CLS | `web-perf` |
| Will this rank / will an LLM cite it? | `seo-audit`, `ai-seo` |
| Is the prose human? | global `humanizer`, `antislop-copywriting` |
| Is the UI slop? | global `antislop-ui`, `antislop-layoutmobile`, `antislop-human` |
| Upgrading an existing page to a higher standard | global `redesign-existing-projects` |

Do not restate another skill's findings as this skill's own. One report, one concern.

## Operating mode in this repo

**Review and refine, not rebuild.** The site is live and has an established identity. Default
posture: measure the current page, name the specific generic or weak decisions, propose the smallest
change that fixes them. Do not propose re-platforming, a new design system, a new colour palette, or
a "modern rewrite" unless explicitly asked. If a page is already good, say it is good.
