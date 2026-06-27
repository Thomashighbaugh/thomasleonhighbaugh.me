# /blog

Blog writing command for thomasleonhighbaugh.me. Write, edit, research, and optimize blog posts.

## Usage

```
/blog <subcommand> [args]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `write <topic>` | Write a new blog post on the given topic. Runs the full pipeline: outline → research → draft → edit → headline optimization. |
| `edit <post-slug>` | Edit and polish an existing blog post. Runs the blog-editor agent. |
| `research <topic>` | Research a topic and produce a structured research brief. |
| `headline <post-slug>` | Generate HN-optimized headline variants for an existing post. |
| `optimize <post-slug>` | Full HN optimization pass — headline, first paragraph, counterarguments. |
| `list` | List all blog posts (drafts and published). |
| `status <post-slug>` | Show the status of a blog post (draft, published, needs edit, etc.). |
| `new <topic>` | Alias for `write`. |

## Examples

```
/blog write "Why systemd is actually fine and you should get over it"
/blog edit llm-cargo-cult
/blog research "NixOS flakes vs traditional Nix"
/blog headline ai-consciousness-indian-philosophy
/blog optimize hubs-opencode
/blog list
/blog status neovim-lua
```

## Delegation

| Subcommand | Delegates To |
|------------|-------------|
| `write` | `@blog-writer` (via blog-writer skill) |
| `edit` | `@blog-editor` |
| `research` | `@blog-researcher` (via blog-research skill) |
| `headline` | `@hn-headline-crafter` |
| `optimize` | `@hn-headline-crafter` + `@blog-editor` (via hn-optimizer skill) |
| `list` | Direct (read content/blog/ directory) |
| `status` | Direct (read frontmatter) |

## Related Agents

- `@blog-writer` — Writes blog posts
- `@blog-editor` — Edits and polishes
- `@blog-researcher` — Researches topics
- `@hn-headline-crafter` — Optimizes headlines

## Related Skills

- `blog-writer` — Full blog writing pipeline
- `hn-optimizer` — HN-specific optimization
- `blog-research` — Topic research

## Related Rules

- `.opencode/rules/blog-writing-style.md` — Voice, tone, structure
- `.opencode/rules/blog-frontmatter.md` — Frontmatter validation
