# Blog Frontmatter Validation

## Required Fields

Every blog post in `src/content/blog/` MUST have these fields (matching the Zod schema in `src/content/config.ts`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Distinctive, searchable title. Subtitles after colon OK. |
| `summary` | string | yes | 1-2 sentences. Must stand alone in RSS/cards. |
| `date` | date | yes | Format: `"Mon DD YYYY"` (e.g., `"Jan 27 2023"`) |
| `tags` | string[] | yes | 1-2 broad conceptual tags only. See Tag Conventions below. |
| `draft` | boolean | no | Defaults to false. Set `true` during drafting. |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | SEO description (2-3 sentences). Falls back to `summary` if absent. Not in the Zod schema but commonly used. |

## Tag Conventions

Use exactly **1 or 2 broad conceptual tags** per post. These are not granular keywords — they are overarching clusters that group posts at the conceptual level. No post should have more than 2.

### Canonical Tag Clusters

| Tag | Covers | Example Posts |
|-----|--------|---------------|
| **AI** | LLMs, prompt engineering, agentic AI, swarm engineering, AI comparisons, AI tooling, machine learning concepts | llm-cargo-cult, intro-prompt-engineering, claude-vs-chatgpt, hubs-opencode, swarm-engineering, orchestration-patterns-hubs, llm-harnesses-opencode |
| **Linux** | Linux distributions, NixOS, system administration, init systems, window managers, CLI tools, open-source software, terminal tools | linux-init-systems, neovim-lua, sudo-v-doas, brave-browser-on-void-linux, remember-geometry-awesomewm, stack-layout-awesomewm, firefox, vice-color-scheme |
| **Development** | Programming languages, dev tools, workflows, architecture, design, version control, editors, build systems, web development, CSS, TypeScript | git, switching-to-astro, designing-interfaces, future-code-editing, ts-sandbox, portfolio_refresh, svg-github-banner, upgrade-nextjs |
| Philosophy | philosophy | philosophy |

### Tag Selection Rules

1. Pick the **single tag** that best describes the post's primary subject
2. Add a **second tag only** if the post genuinely spans two clusters (e.g., an AI post with deep philosophical analysis gets `[AI, Philosophy]`)
3. Never use 3 or more tags
4. Tags are Title Case, singular
5. Do not invent new tags — use only the four canonical clusters above

## Validation Rules

1. `title` must not end with a period
2. `summary` must be under 300 characters
3. `tags` must contain 1 or 2 entries only
4. `tags` must be from the canonical set: `AI`, `Linux`, `Development`, `Philosophy`
5. `tags` must not contain duplicates
6. `date` must be parseable by `new Date("Mon DD YYYY")`
7. `draft: true` posts should NOT be linked from index pages or sitemaps
8. Every post directory must contain `index.md` (not `index.mdx` unless MDX features are used)
9. Images must be in the same directory as `index.md`
10. At least one image should be present for social card generation (optional but recommended)
