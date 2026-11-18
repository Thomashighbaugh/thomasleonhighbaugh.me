---
name: astro
description: Build with Astro in thomasleonhighbaugh.me — the specific configuration, aliases, content collections, layouts and build pipeline this project actually uses. Use when adding a page, component, collection, integration or route; when a build or type error originates in Astro; or when asked how content collections, static paths, image handling or deployment work here. Prefer this over generic Astro advice; it records the project's real deviations from defaults.
metadata:
  adapted-for: thomasleonhighbaugh.me
  upstream: astrolicious/agent-skills@astro
  version: 0.0.1-project
---

# Astro in thomasleonhighbaugh.me

Astro 5.18, static output, Vercel. Read this before touching `astro.config.mjs`, adding a route, or
debugging a collection type error — this project deviates from Astro defaults in four ways that
generic advice gets wrong.

## Configuration, as it actually is

```js
// astro.config.mjs
site: "https://thomasleonhighbaugh.me"
legacy: { collections: true }        // ← deviation 1
integrations: [
  mdx(),
  sitemap(),
  solidJs(),
  tailwind({ applyBaseStyles: false })  // ← deviation 2
]
```

- **`legacy.collections: true`** — content uses the legacy API. Entry `slug` is derived from the
  directory path (`src/content/blog/my-post/index.md` → `my-post`), and `getCollection` /
  `getEntry` behave per legacy semantics. Do **not** migrate to `glob()` loaders as a drive-by
  change; it rewrites every `getStaticPaths` and every `slug` consumer at once.
- **`applyBaseStyles: false`** — Tailwind does not inject `@tailwind base`. `src/styles/global.css`
  imports the layers itself and owns `@layer base`. Adding preflight expectations will not hold.
- **No adapter.** Output is fully static. There are no server endpoints, no `prerender = false`,
  and adding one requires an adapter plus a deploy change. `src/pages/robots.txt.ts` and
  `rss.xml.ts` are **static** endpoints returning `Response` — that pattern works without an adapter.
- **`site` is load-bearing**, not decorative: `BaseHead.astro` builds canonicals from `Astro.site`,
  `rss.xml.ts` reads `context.site`, and `robots.txt.ts` reads `import.meta.env.SITE`.

## Path aliases — two places, one truth

`tsconfig.json` defines a wildcard: `"@*": ["src/*"]`. So `@components/Header.astro` →
`src/components/Header.astro`, and `@consts` → `src/consts.ts`.

`vitest.config.ts` **cannot** read tsconfig paths and therefore re-declares a subset explicitly
(`@`, `@components`, `@lib`, `@test`, `@consts`, `@types`, `@layouts`).

**Consequence:** a new top-level directory used in tests needs an alias in **both** files, or it
resolves in `npm run build` and fails in `npm test`. This has bitten the project before. Import
style throughout the codebase is `@components/...`, `@layouts/...`, `@consts` — match it.

## Collections

Schema lives in `src/content/config.ts`:

| Collection | Fields |
|---|---|
| `blog` | `title`, `summary`, `date` (coerced), `tags: string[]`, `draft?` |
| `projects` | as blog + `demoUrl?`, `repoUrl?` |
| `work` | `company`, `role`, `dateStart`, `dateEnd` (union date \| string) |
| `legal` | `title`, `date` |

Every entry is a directory with `index.md` and its images beside it. There is no `description`
field in the schema even though `BaseHead` accepts one — the page passes `summary` instead. If you
add a field, update `src/content/config.ts` **and** `.opencode/rules/blog-frontmatter.md`, or the
rule and the schema will disagree.

**Draft handling is inconsistent** — `src/pages/blog/index.astro` filters `!post.data.draft`;
`src/pages/blog/[...slug].astro` and `src/pages/rss.xml.ts` do not, so a draft becomes a built,
sitemapped, feed-published page. Verify before assuming drafts are private. Details in the
`seo-audit` skill.

## Routing

| Route | File | Pattern |
|---|---|---|
| `/blog/<slug>/` | `src/pages/blog/[...slug].astro` | `getStaticPaths` over `getCollection("blog")` |
| `/projects/<slug>/` | `src/pages/projects/[...slug].astro` | same, over `projects` |
| `/rss.xml` | `src/pages/rss.xml.ts` | static endpoint |
| `/robots.txt` | `src/pages/robots.txt.ts` | static endpoint |
| `/search` | `src/pages/search/` | SolidJS island |

Rest params (`[...slug]`) with a `getStaticPaths` that returns `params.slug` **without** a trailing
slash produce `/blog/post/` once `trailingSlash` defaults apply — verify generated URLs in `dist/`
rather than assuming.

## Layouts and composition

```
PageLayout          <html>, BaseHead, Header, Drawer, main, Footer, SpeedInsights
├── TopLayout       top region wrapper
├── BottomLayout    bottom region wrapper
└── Article*Layout  article-specific top/bottom for blog + project pages
```

`PageLayout` composes `<title>` as `${title} | Thomas Leon Highbaugh`. Do not append the site name
at call sites — it will double.

## Styling

Tailwind 3.4, `darkMode: ["class"]`, typography plugin, `fontFamily.sans = Atkinson`. Custom
`twinkle` / `meteor` keyframes and the `45/135/225/315` rotate values already exist — reuse them
instead of redefining. Visual work should follow the `design-taste-frontend` skill and the
project's `web-design-guidelines` review rules.

## Images

`sharp` is a dependency; use Astro's `<Image>` / `<Picture>` for content images so the build emits
optimized WebP. The build log already shows 13 images optimized per run (e.g. `vice` 5.2 MB →
446 KB). Do not add a second image pipeline; `.opencode/tools/optimize-images.mjs` exists for
batch work outside the build.

## Commands

| Task | Command |
|---|---|
| Dev | `npm run dev` (`dev:network` for LAN) |
| Type-check + build | `npm run build` — runs `astro check` **then** `astro build` |
| Preview built site | `npm run preview` |
| Add integration | `npm run astro -- add <integration>` then **re-run dev/build** (types regenerate) |
| Regenerate types only | `npm run astro -- sync` |

`.astro/` and `dist/` are gitignored. After adding a collection or integration, `astro sync` is
what makes `astro:content` types appear — a red squiggle that survives a restart usually means
sync was not run.

## Common failure modes here

1. **`astro check` fails but `tsc` passes** — Astro's checker validates `.astro` frontmatter
   separately. `npm run build` runs both; use it, not `tsc` alone.
2. **Missing `getStaticPaths`** — a rest-param route without it fails the build, not the dev
   server. Always build before claiming a route works.
3. **Solid island renders blank** — check the `client:*` directive is present and
   `jsxImportSource: "solid-js"` is still set in `tsconfig.json`. React-style hydration will
   silently do nothing.
4. **Types resolve in editor, fail in Vitest** — the alias gap above.

Consult <https://docs.astro.build> for framework API that is not covered here; this file records
only what is project-specific.
