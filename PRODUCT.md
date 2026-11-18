# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, in the order they actually arrive:

1. **Hiring managers and recruiters** scanning for a role fit. They arrive from a resume
   link, a LinkedIn profile, or a cold search of the name. They give the home page roughly
   thirty seconds before deciding whether to read further, and they are looking for a job
   title, evidence of shipped work, and a way to make contact. They read project pages and
   the About page; they rarely read more than one blog post.
2. **Working engineers** arriving from Hacker News, a search result, or a link inside a
   post. They come for one specific argument or technique and judge the writing, not the
   author's career.
3. **People who already know the author** — colleagues, collaborators, correspondents —
   checking what has been published lately.

Anyone may land directly on a blog post from an external link, so every post has to stand
alone without the home page as context.

## Product Purpose

A personal portfolio and blog for Thomas Leon Highbaugh: a place to show worked-on
projects, publish long-form technical and philosophical writing in a distinctive voice, and
give hiring managers enough signal to start a conversation.

Success is a manager finding a role, a project they want to ask about, and a contact route
within the first screen and a half — and an engineer arriving from a forum finding the post
they were promised.

## Positioning

The writing is the differentiator. Most developer portfolios show a grid of screenshots and
a skills bar; this one carries twenty-nine essays that take positions and defend them, on
Linux, LLM tooling, init systems, and the craft of software. The visual identity is
deliberately unlike a resume template: a monochrome page with an animated SVG mark, and no
"professional" accent color anywhere.

A neighboring portfolio could copy the layout. It could not truthfully copy the archive.

## Operating Context

- Static site, built with Astro 5 and deployed to Vercel. Zero client JavaScript except
  for explicitly-hydrated SolidJS islands (search, and the mobile drawer).
- Content is authored in Markdown/MDX in `src/content/{blog,projects,legal,work}/` and
  committed to the repository. There is no CMS, no database, and no server at runtime.
- Build runs `astro check && astro build`; 46 routes currently, plus a sitemap and an RSS
  feed that are both derived at build time.
- Images are pre-optimized to WebP by a prebuild script and live beside each post's
  `index.md`.
- Dark mode is a `class` strategy on `<html>`, default light, with the animated
  particle/star background swapping on the same key.
- The site is evaluated in a browser at phone width, laptop width, and on a projector at a
  talk — all three matter.

## Capabilities and Constraints

**Confirmed functionality**

- Home (`/`), About (`/about`), Blog index (`/blog`), Blog post (`/blog/<slug>`), Projects
  index (`/projects`), Project page (`/projects/<slug>`), Search (`/search`), RSS
  (`/rss.xml`), sitemap, `llms.txt`, and a `robots.txt` endpoint.
- Content collections: `blog` (29 published posts), `projects` (9), `legal`, `work`, each
  validated by a Zod schema in `src/content/config.ts`. Blog and projects both carry
  `draft?: boolean`; drafts are filtered out of routes, sitemap, and RSS.
- Client-side search over all entries via Fuse.js, hydrated as a SolidJS island.
- Post and project frontmatter carries `title`, `summary`, `date`, `tags` (1–2 values from
  `AI`, `Linux`, `Development`, `Philosophy`), optional `description` and images.

**Constraints**

- No backend, no form submission endpoint, no analytics beyond Vercel's own. Anything that
  needs a server is out of scope unless explicitly added.
- Tag vocabulary is closed at four values. Do not expand it casually.
- The SVG hero in `src/components/SVGHero.astro` is pinned. Its gradients, its
  `animateTransform` rotation, its two `Dimitri` "TLH" text nodes, its `viewBox`, and its
  `w-[55rem] h-[55rem]` sizing box are the mark's definition, not decoration. Layout around
  it may change; its internals may not.
- Body copy renders at `text-black/75` on white (≈ #404040, ~10.4:1) and `text-white/75` on
  black (≈ #BFBFBF, ~11.4:1). Those are the only two text tints the codebase uses, and both
  clear AA comfortably — so new text should not be set lighter than `/75`.

**Explicitly undecided**

- Whether project cards should carry a thumbnail. The schema has no image field for
  projects today.
- Whether a contact email should be published on the site, or whether the external links
  page remains the only route.
- Whether the home page should carry a role line and navigation, or stay name-only.

## Brand Commitments

These are binding. They came from the person, not from a design heuristic.

- **The name.** "Thomas Leon Highbaugh" is set as the hero, and the mark is the initials
  "TLH" in the `Dimitri` display face, rendered inside the SVG.
- **Strict monochrome.** Black, white, and opacity steps between them. No accent color, no
  brand hue, no gradient text outside the SVG. The only saturated color in the system is
  the mark itself: an ice-to-blue blob with magenta and yellow highlights that rotate.
- **Dark-first, light-parity.** Dark is the intended presentation; the home page is pinned
  dark so the mark is always seen on black. Light mode is not a fallback: every interior
  surface must be correct in both, and light-mode muted values are chosen *darker*, never
  lighter, than their dark-mode counterparts.
- **The animated background.** Light mode runs drifting particles; dark mode runs stars,
  twinkling stars, and meteors. It is the thing visitors remember.
- **The voice.** First person, opinionated, blunt, occasionally profane, never corporate.
  Register lives in `.opencode/rules/blog-writing-style.md`. Do not sand it down.
- **BlackHanSans** for headings, navigation, header, and footer; **Atkinson** for body.
  Both already loaded and self-hosted.

## Evidence on Hand

- 29 published blog posts, several of them long-form arguments rather than tutorials.
- 9 project entries with summaries, dates, tags, and optional demo/repository URLs.
- A resume hosted at `https://resume.thomasleonhighbaugh.me`.
- A links page at `https://links.thomasleonhighbaugh.me` that aggregates social profiles.
- About-page prose describing the author's position and working history, currently in essay
  form with no headings.
- **Not on hand:** employer testimonials, metrics or case-study numbers, headshots or
  portraits in the repo, screenshots of shipped project UI, and any contact email address.

## Product Principles

1. **The archive leads.** Writing is the proof. Design decisions that bury posts behind a
   marketing surface are wrong even if they convert better.
2. **Say it in one sentence before saying it in eight.** A manager's thirty seconds outrank
   the author's preference for a slow reveal.
3. **Monochrome until the mark.** Color is scarce and belongs to the SVG. Everywhere else,
   hierarchy comes from weight, scale, and opacity — not hue.
4. **The mark is fixed.** `SVGHero.astro` is the identity. Compose around it; never simplify
   it into a logo, a static image, or a responsive variant that loses the motion.
5. **No fake proof.** No invented testimonials, no stock team photos, no skill-percentage
   bars. If evidence is missing, the answer is to add real evidence or omit the section.
6. **Static by default.** A feature that needs a server, a tracker, or a login has to earn
   its way in.

## Accessibility & Inclusion

- Target WCAG 2.2 AA for text contrast, focus visibility, and keyboard operation.
- The two body tints in use (`/75` on each ground) both measure above 10:1, so contrast is
  presently sound; the constraint is not to introduce lighter text, not to fix existing.
- The continuous background motion on the home page currently ignores
  `prefers-reduced-motion`. That is a known defect, not a preference.
- The home page ships the name twice as two `<h1>` elements (one shadow copy, one stroked
  copy), so assistive tech announces the name twice and the document has a duplicated
  top-level heading.
- Headings must nest in order. The About page currently uses `<p>` where `<h2>` belongs and
  emits mismatched `<h3>…</p>` tags.
