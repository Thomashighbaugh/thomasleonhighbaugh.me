---
name: ai-seo
description: Make thomasleonhighbaugh.me content discoverable and citable by LLMs and AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews). Use when asked about AI SEO, AEO, GEO, llms.txt, agent readiness, AI citations, or why an LLM answers a question without crediting the post. Binds to this site's Astro static output, content collections, and existing JSON-LD. Organic only — no listicle farming or citation bait.
metadata:
  adapted-for: thomasleonhighbaugh.me
  upstream: coreyhaines31/marketingskills@ai-seo
  version: 2.10.1-project
---

# AI Search Optimization — thomasleonhighbaugh.me

Getting this site's writing cited in AI answers. The constraint that makes the rest work: an LLM
cites a page because **one passage plainly and completely answers the question**, not because the
page is shaped like SEO content. Structure for extractability, write for the reader.

## Why this site is a natural AEO target

The blog's subject matter *is* the thing people ask assistants about — LLM tooling, prompt
engineering, agent orchestration, Linux, editor workflows. A post like `intro-prompt-engineering`
or `llm-harnesses-opencode` is exactly the kind of page an assistant should retrieve and name.
That is a real advantage, and it is also a responsibility: a confidently wrong post gets
paraphrased without attribution and becomes model folklore.

## Current state — verified

| Property | Status | Where |
|---|---|---|
| Static server-rendered HTML | ✅ everything | Astro, no client hydration except search islands |
| JSON-LD present | ✅ `BlogPosting`, person, site | `src/components/JsonLd.astro`, used in `blog/[...slug].astro`, `index.astro`, `projects/[...slug].astro` |
| Clean, parseable prose | ✅ Markdown → HTML, semantic headings | `src/content/blog/*/index.md` |
| `robots.txt` | ✅ `User-agent: * / Allow: /` + sitemap | `src/pages/robots.txt.ts` |
| `llms.txt` | ❌ absent | — (natural `src/pages/llms.txt.ts` route, same pattern as `robots.txt.ts`) |
| `llms-full.txt` | ❌ absent | — |
| Per-post `og:image` | ❌ one shared default | `BaseHead.astro` |
| `dateModified` in schema | ❌ absent | `blog/[...slug].astro` |
| Feed | ✅ RSS, blog + projects | `src/pages/rss.xml.ts` |

`robots.txt` currently allows every crawler including AI training and answer-engine fetchers. That
is a **decision, not an oversight** — treat it as one. If it is ever flipped to disallow, it must
be flipped deliberately, per-bot, with the tradeoff stated (training access vs. citation
visibility are different things; blocking one does not block the other).

## What to do, in leverage order

1. **`llms.txt`** — add `src/pages/llms.txt.ts` mirroring `robots.txt.ts`. It should list site
   identity, the canonical origin, the blog index, the four tag clusters once those exist, and a
   short per-post list: title, absolute URL, summary. Generate it from `getCollection("blog")` so
   it never rots. Filter drafts (see the `seo-audit` skill — the collection is unfiltered today).
2. **`llms-full.txt`** — same route pattern, full post bodies concatenated, gated behind a
   `?full` decision on size. Only worth it while the corpus is small (it is: ~29 posts).
3. **Answer-shaped opening.** Every post's first 2–3 sentences should answer the title question
   outright, without preamble. This is the single highest-value writing habit for citation, and it
   also makes the post better for humans. Enforceable as a review note, not a keyword rule.
4. **Definition and comparison blocks, where genuine.** If a post compares two tools, a real
   table beats prose for extraction. If it defines a term, one sentence beginning "X is …". Only
   where the content actually is a comparison or a definition — a fabricated comparison table to
   catch queries is forced SEO and it reads as such.
5. **Schema depth.** Add `image`, `url`, `mainEntityOfPage`, `dateModified` to `BlogPosting`. Cheap,
   safe, and most consumers use at least `image`.
6. **Attribution-worthy facts.** Specific version numbers, concrete commands, real file paths,
   measured results. Vague posts get paraphrased into nothing; specific posts get quoted.

## What not to do here

- **No `llms.txt` keyword padding**, no "Top 10 tools" listicles the author would not write, no
  FAQ blocks bolted onto posts that have no questions.
- **No `FAQPage` schema on invented FAQs.** Google has narrowed rich-result eligibility and a
  fabricated FAQ is both ineffective and a credibility cost.
- **Do not block AI crawlers "for safety"** without a stated reason. For a personal blog whose
  value is being credited, training and citation access are usually worth more than the
  marginal scraping cost.
- **Do not chase `format-volatility`.** The upstream reference describes engines cycling between
  listicles and long-form. A personal blog should not chase that cycle; it should be right.

## Measurement honesty

AI referral attribution is genuinely unreliable, and the upstream skill says so at length
(`references/ai-attribution.md`). On this site, treat as signal: branded-search lift, direct
traffic to a specific post, and inbound mentions. Treat as noise: `referrer` strings from
ChatGPT. Do not build a dashboard that pretends otherwise.

## Deeper references (upstream, retained)

Read one when the question needs it — do not load the whole set:

- `references/agent-readiness.md` — can an agent fetch and parse the site at all
- `references/content-patterns.md` — definition / comparison / FAQ shapes that extract well
- `references/content-types.md` — which page types get cited for which query families
- `references/platform-ranking-factors.md` — how ChatGPT, Perplexity, AI Overviews differ
- `references/citations-vs-recommendations.md` — cited but not recommended, and why
- `references/answer-accuracy.md` — when a model states something wrong about the site
- `references/okf.md` — Open Knowledge Format bundles
- `references/ai-attribution.md` — what is measurable and what is not

Skip `linkedin-ai-citations.md`, `youtube-ai-citations.md`, `multilingual-and-commerce.md` — no
LinkedIn publishing, no video channel, no commerce or locales on this site.
