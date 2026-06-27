<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-16 -->

# .opencode

## Purpose
OpenCode AI assistant project configuration. Contains project-scoped config, state, context, rules, and documentation for the AI-assisted development workflow.

## Key Files

| File | Description |
|------|-------------|
| `opencode.jsonc` | Project-scoped OpenCode configuration (extends global config) |
| `package.json` | OpenCode project-scoped dependencies |
| `package-lock.json` | Lockfile for OpenCode dependencies |
| `.gitignore` | Git ignore rules for OpenCode state |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `state/` | Session state, artifacts, logs, and plans (gitignored) |
| `context/` | Durable knowledge: ADRs, frameworks, patterns, research (committed) |
| `rules/` | Project-specific agent instructions and conventions |
| `commands/` | Custom OpenCode slash commands |
| `tools/` | Custom TypeScript tools for OpenCode |
| `docs/` | Generated project documentation |
| `cache/` | Multi-tier prompt cache (gitignored) |
| `agents/` | Project-scoped subagents (blog-writer, blog-editor, blog-researcher, hn-headline-crafter) |
| `skills/` | Project-scoped skills (blog-writer, blog-research, hn-optimizer) |

## For AI Agents

### Working In This Directory
- This directory is managed by the OpenCode system
- `state/` and `cache/` contain ephemeral data that is gitignored
- `context/` contains durable knowledge (ADRs, frameworks, patterns) — committed to git
- `rules/` contains project-specific agent instructions loaded via opencode.jsonc
- Do not manually edit files in `state/` or `cache/`

### Key Context Files
- `context/decisions.md` — Architecture Decision Records (ADRs 1-4)
- `context/frameworks/` — Astro content collections and pages-subdirs patterns
- `rules/project-context.md` — Stack, paths, build commands, and conventions

## Blog Writing Resources

### Agents (Project-Scoped)
| Agent | Purpose |
|-------|---------|
| `@blog-writer` | Write blog posts in the thomasleonhighbaugh.me voice — opinionated, technically deep, HN-optimized |
| `@blog-editor` | Edit and polish blog posts — structural, line, frontmatter, and HN optimization edits |
| `@blog-researcher` | Research topics and produce structured research briefs with sources and counterarguments |
| `@hn-headline-crafter` | Craft and optimize blog post titles for Hacker News engagement |

### Skills
| Skill | Purpose |
|-------|---------|
| `blog-writer` | Full blog writing pipeline: outline → research → draft → edit → headline optimization |
| `blog-research` | Topic research with source gathering and structured briefs |
| `hn-optimizer` | HN-specific optimization: headline, first paragraph, counterargument scan |

### Commands
| Command | Purpose |
|---------|---------|
| `/blog write <topic>` | Write a new blog post (full pipeline) |
| `/blog edit <slug>` | Edit an existing post |
| `/blog research <topic>` | Research a topic |
| `/blog headline <slug>` | Generate HN headline variants |
| `/blog optimize <slug>` | Full HN optimization pass |
| `/blog list` | List all posts |
| `/blog status <slug>` | Show post status |

### Rules
| Rule | Purpose |
|------|---------|
| `rules/blog-writing-style.md` | Voice, tone, structure, HN optimization guidelines |
| `rules/blog-frontmatter.md` | Frontmatter validation and tag conventions |

<!-- MANUAL: -->
