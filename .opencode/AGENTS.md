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

<!-- MANUAL: -->
