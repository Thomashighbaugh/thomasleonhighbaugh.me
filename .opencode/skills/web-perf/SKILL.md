---
name: web-perf
description: Measure and improve loading and interaction performance for thomasleonhighbaugh.me — Core Web Vitals, LCP, CLS, and Lighthouse scores on a static Astro site deployed to Vercel. Use when asked about page speed, CWV, slow hero images, font loading, bundle size, or a Lighthouse regression. Knows this site's actual performance profile (zero client JS, preloaded self-hosted fonts, sharp image pipeline, Vercel Speed Insights).
metadata:
  adapted-for: thomasleonhighbaugh.me
  upstream: cloudflare/skills@web-perf
  version: project
---

# Web Performance — thomasleonhighbaugh.me

A static Astro site with **no client-side JavaScript on content pages**. That shapes everything:
the classic JS-bundle advice is mostly irrelevant here, and the real levers are images, fonts, and
layout stability.

## Actual performance profile

| Property | Reality | Consequence |
|---|---|---|
| Client JS on blog/project pages | **none** — only `/js/theme.js`, `/js/scroll.js`, `/js/animate.js`, `/js/copy.js` as small inline/deferred scripts from `BaseHead.astro` | TBT and INP are near-zero; do not chase bundle splitting |
| Hydrated islands | `SearchBar`, `Search`, `SearchCollection`, `Counter` (SolidJS) | Only the search page ships framework code |
| Fonts | Self-hosted `.woff`/`.woff2`, **preloaded** in `BaseHead.astro`, `font-display: swap` in `global.css`, `Dimitri` embedded as base64 | Fonts are usually *not* the LCP bottleneck; do not add more faces or webfont `<link>`s |
| Images | `sharp` at build; `<Image>`/`<Picture>` in content; build log shows ~13 images optimized per run | **LCP is almost always a hero image** |
| Delivery | Vercel — brotli, HTTP/2, global CDN, immutable `/_astro/*` hashes | No compression or cache-header work needed |
| RUM | `@vercel/speed-insights` mounted in `PageLayout.astro` | Real-user CWV lives in the Vercel dashboard, not in this repo |
| Ambient motion | `MeteorShower`, `TwinklingStars`, `twinkle`/`meteor` keyframes | Can cost paint on low-end mobile; must respect `prefers-reduced-motion` |

## Measure before changing anything

1. **Real users first.** Vercel dashboard → Speed Insights. Field data beats lab data. If field LCP
   is already < 2.5 s at p75, there is nothing to fix — say so and stop.
2. **Lab, on the built output, never the dev server.** `npm run build && npm run preview`, then
   Lighthouse against `http://localhost:4321`:
   ```bash
   npx lighthouse http://localhost:4321 --preset=desktop --view
   npx lighthouse http://localhost:4321 --form-factor=mobile --throttling.cpuSlowdownMultiplier=4
   ```
   The dev server does not minify, does not hash, and does not preload the same way — measuring it
   produces fake problems.
3. **Per-route, not site-wide.** Measure `/` , one blog post, `/blog`, `/search`. `/search` is the
   only route with meaningful JS and is expected to score differently.

## Lever order for this site

1. **Hero / first-contentful image.** This is the LCP element on most pages. Prefer a correctly
   sized AVIF/WebP through `<Image>`, explicit `width`/`height`, `loading="eager"` +
   `fetchpriority="high"` on the LCP image only. The build already compresses aggressively
   (`vice` 5.2 MB → 446 KB); further gains come from dimension and format, not from more
   compression.
2. **`loading="lazy"` on everything below the fold.** Cheap, safe, and the default mistake is
   omitting it.
3. **`width`/`height` on every image.** CLS is the most plausible real defect here — article
   layouts with unconstrained images will shift. Reserve space.
4. **Verify reduced-motion for the ambient layer.** Not strictly a perf metric, but decorative
   animation that ignores the preference is both an a11y and a battery problem.
5. **Search page only:** check the Solid island is `client:visible`/`client:idle`, not
   `client:load`, if it is not needed above the fold.

## Do not spend effort on

- **Code splitting / tree shaking** — there is nothing to split on content pages.
- **Critical CSS inlining** — a single small stylesheet, CDN-served and hashed; inlining trades a
  cacheable asset for uncacheable HTML.
- **Third-party script deferral** — the only third party is Vercel Speed Insights (tiny, already
  async).
- **Service workers / PWA** — no offline requirement.
- **Preconnect / dns-prefetch** — everything is same-origin.

## Reporting

Quantify, and refuse to inflate. Format:

```
[route] metric: value → target threshold — cause — specific change — expected saving
```

State explicitly which numbers came from field data and which from lab. If a change is worth 0 ms,
label it "note only" rather than presenting it as a finding. When the site is already fast — and on
the metrics that matter for a static blog it usually is — the honest report says so.

## Reference

`references/perf.md` (upstream, retained) covers general CWV mechanics and tooling. Current
thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, all at p75. Confirm against
<https://web.dev/articles/vitals> before quoting numbers in a report; thresholds change.
