<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# blog

## Purpose
Blog post content collection. Contains 22 posts in Markdown format covering Linux, Neovim, prompt engineering, AI, web development, and personal technology workflows.

## Content Overview

| Topic Cluster | Posts |
|---------------|-------|
| **Linux/System** | `linux-init-systems`, `sudo-v-doas`, `brave-browser-on-void-linux`, `stack-layout-awesomewm`, `remember-geometry-awesomewm`, `firefox` |
| **Neovim/Editors** | `neovim-lua`, `future-code-editing`, `ts-sandbox` |
| **AI/Prompt Engineering** | `intro-prompt-engineering`, `llm-harnesses-opencode`, `claude-vs-chatgpt`, `swarm-engineering`, `ai-consciousness-indian-philosophy` |
| **Web Development** | `switching-to-astro`, `upgrade-nextjs`, `portfolio_refresh`, `designing-interfaces`, `svg-github-banner`, `git`, `vice-color-scheme` |
| **Other** | `average-median-human` |

## For AI Agents

### Working In This Directory
- Each post is a subdirectory containing `index.md` and optional image assets
- Frontmatter must include: `title`, `summary`, `date`, `tags` (all required)
- Optional frontmatter: `draft` (boolean, hides post when `true`)
- Images within posts should be placed in the same subdirectory as `index.md`
- Tags are used for grouping and search categorization

### Creating New Posts
1. Create a new subdirectory with a URL-friendly slug name
2. Write `index.md` with proper frontmatter
3. Add images as needed in the same directory
4. Reference images with relative paths (e.g., `![alt](./image.png)`)

## Dependencies

### Internal
- `../config.ts` - Blog collection schema validation

<!-- MANUAL: -->
