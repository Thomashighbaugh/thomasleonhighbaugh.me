---
name: seo-audit
description: Audit organic SEO for thomasleonhighbaugh.me — the Astro portfolio and blog. Use when asked to review meta tags, canonicals, structured data, sitemap/RSS correctness, internal linking, or why a post is not ranking. Audits against the site's real surfaces (BaseHead.astro, JsonLd.astro, content collections, robots.txt.ts, rss.xml.ts). Not for keyword-stuffing or traffic-bait tactics — this site is a personal blog and forced SEO would damage it.
metadata:
  adapted-for: thomasleonhighbaugh.me
  upstream: coreyhaines31/marketingskills@seo-audit
  version: 2.2.2-project
---

# SEO Audit — thomasleonhighbaugh.me

Audit organic search health for a personal portfolio + blog. The bar is not traffic volume; it is
**being found by the right person for a query you actually answer**. Forced optimization —
keyword-dense intros, invented headings, "SEO paragraphs" — is a failure mode here, not a goal.

## The site, precisely

| Fact | Value |
|---|---|
| Canonical origin | `https://thomasleonhighbaugh.me` (set once in `astro.config.mjs` → `site`) |
| Framework | Astro 5.18, static output, deployed on Vercel |
| Rendering | Zero client JS by default; SolidJS islands only for search (`SearchBar`, `Search`, `SearchCollection`) |
| Content | `src/content/blog/`, `src/content/projects/`, `src/content/legal/`, `src/content/work/` — each post is `index.md` in its own directory |
| Frontmatter | `title`, `summary`, `date`, `tags`, optional `draft` (`src/content/config.ts`) |
| Tag model | Exactly 1–2 canonical clusters: `AI`, `Linux`, `Development`, `Philosophy`. See `.opencode/rules/blog-frontmatter.md` — these are **conceptual clusters, not keywords** |

## Where SEO actually lives in this codebase

Read these before making any claim. Do not audit from memory of the rendered page.

| Surface | File | What it controls |
|---|---|---|
| Head metadata | `src/components/BaseHead.astro` | `<title>`, description, canonical, `og:*`, `twitter:*`, font preloads, sitemap + RSS `<link>` |
| Wrapper | `src/layouts/PageLayout.astro` | Composes `${title} \| Thomas Leon Highbaugh` and imports Speed Insights |
| Structured data | `src/components/JsonLd.astro` | Emits one `application/ld+json` block per call |
| Article schema | `src/pages/blog/[...slug].astro` | `BlogPosting` with `headline`, `description`, `datePublished`, `author` |
| Home schema | `src/pages/index.astro` | Two `JsonLd` blocks (person / site) |
| Project schema | `src/pages/projects/[...slug].astro` | `BlogPosting` reuse |
| Crawl rules | `src/pages/robots.txt.ts` | Generated `robots.txt`, references `sitemap-index.xml` |
| Sitemap | `astro.config.mjs` → `sitemap()` | Emits `sitemap-index.xml` from built routes |
| Feed | `src/pages/rss.xml.ts` | Blog + projects feed |

## Known gaps in this codebase (verify before reporting; fix, don't just note)

These are real, read from source. Re-check each — they may have been fixed.

1. **Drafts are not filtered anywhere.** `src/pages/blog/[...slug].astro` calls
   `getCollection("blog")` with no `!post.data.draft` filter, so `getStaticPaths` **builds** draft
   pages. `sitemap()` then indexes them, and `src/pages/rss.xml.ts` publishes them. Only
   `src/pages/blog/index.astro` filters drafts. A draft post is therefore live, indexed, and in
   the feed while invisible from the index. Fix at `getStaticPaths` + RSS, not in the sitemap
   config.
2. **`og:type` is hardcoded `website`** in `BaseHead.astro`, including on blog posts. Articles
   should emit `article`, plus `article:published_time` and `article:author`. This changes how
   links unfurl on every social platform and in some aggregators.
3. **No `twitter:site` / `twitter:creator`.** Cards will not attribute the account.
4. **Single shared `og:image`** (`/open-graph.jpg`) unless a caller passes `image`. Post-specific
   social cards are the highest-leverage cheap win on a writing site.
5. **`BlogPosting` omits `image`, `url`, and `mainEntityOfPage`.** The most reliably consumed
   properties after headline and date are missing.
6. **No pagination or tag archive routes.** Tag clusters exist in frontmatter but render nowhere,
   so the `AI` / `Linux` / `Development` / `Philosophy` groupings earn no internal links. On a
   blog this is the biggest structural SEO miss — it is also the most natural one to fix, because
   tag hubs are genuinely useful to readers.

## Audit procedure

1. **Baseline from the built output, not the dev server.** `npm run build`, then inspect `dist/`.
   Confirm `sitemap-index.xml`, a sample `dist/blog/<slug>/index.html` `<head>`, and `robots.txt`.
2. **Crawl-shape check.** Every indexable URL is in the sitemap; every sitemap URL returns 200;
   no draft or legal page leaks. Legal pages (`/legal/*`) should be `noindex` — check whether
   they are.
3. **Per-post head** — for three posts (new, old, one with an image): title length and uniqueness,
   description present and derived from `summary`, canonical absolute and correct, `og:*` complete,
   `twitter:*` complete, JSON-LD parses (`JSON.parse` the script body).
4. **Structured data validity.** Validate `BlogPosting` against the schema.org vocabulary, not a
   linter's opinion. Required: `headline`, `datePublished`, `author`. Recommended: `image`, `url`,
   `mainEntityOfPage`, `dateModified`.
5. **Internal linking.** Does any post link to another post? Do tag clusters form hubs? A blog
   with 29 posts and no cross-links is leaking most of its authority.
6. **Core Web Vitals** — hand off to the `web-perf` skill. Do not guess numbers here; this site
   preloads fonts and ships ~no client JS, so LCP is normally the hero image, not JS.
7. **Content-level, last.** Only after the mechanics: is the title the phrase someone would
   actually search, and does the first paragraph answer it? Judge by whether the post earns the
   click, never by keyword density.

## Technical notes specific to this stack

- **JSON-LD is server-rendered** via `set:html` in `JsonLd.astro`. It **will** appear in raw HTML
  and in `ax`/`curl` output — unlike CMS-injected schema. Verify with `ax <url> --body` or by
  grepping `dist/`. Do not use a browser-only detector to conclude schema is missing.
- **`legacy.collections: true`** is set in `astro.config.mjs`. Content entry `slug` values and
  collection behaviour follow the legacy API. Do not "modernize" to `glob()` loaders as an SEO
  fix — that is a refactor with its own risk.
- **Astro escapes into static HTML**, so there is no hydration-time meta rewriting. If a tag is
  absent from `dist/`, it is absent for every crawler. There is no client-side rescue.
- **Vercel** serves compression and HTTP/2 automatically. Do not add compression plugins.
- **`@vercel/speed-insights`** is mounted in `PageLayout.astro`. Real-user CWV data lives in the
  Vercel dashboard, not in this repo.

## Reporting format

Terse, evidence-first, `file:line` anchored:

```
[severity] finding — file:line — why it costs rankings or clicks — one-line fix
```

Severity: `critical` (drafts indexed, broken canonical, schema invalid), `high` (missing
article og:type, no internal links), `medium` (missing twitter:creator, thin descriptions),
`low` (cosmetic metadata polish). Lead with what actually moves the needle; if the mechanics are
already sound, say so plainly instead of manufacturing findings.

## Deeper references

Upstream material retained alongside this skill — read only what the finding needs:

- `references/title-tags.md` — title rewriting without clickbait
- `references/ai-writing-detection.md` — detecting machine-written prose; pairs with the
  `humanizer` and `antislop-copywriting` skills
- `references/rankings-push.md` — moving a stuck page, honest levers only
- `references/international-seo.md` — only relevant if the site ever adds locales (it has none)

Ignore `references/local-seo*.md` — this site has no local-business surface.
