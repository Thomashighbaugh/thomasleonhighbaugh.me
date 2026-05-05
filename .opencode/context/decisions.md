# Architecture Decision Records

## ADR-001: Hierarchical AGENTS.md Documentation

**Context:**
The project had only a single root AGENTS.md file with minimal coverage. AI agents needed comprehensive, navigable documentation to understand the codebase structure, conventions, and relationships between modules.

**Decision:**
Generate hierarchical AGENTS.md documentation across all source directories using the deepinit pattern. The root file serves as an index, and each subdirectory has its own AGENTS.md with parent references.

**Rationale:**
- Progressive disclosure: agents can start at root and drill down as needed
- Parent references (`<!-- Parent: ../AGENTS.md -->`) create a navigable hierarchy
- Each file covers purpose, key files, subdirectories, AI agent instructions, and dependencies
- Manual sections preserved via `<!-- MANUAL: -->` comment markers

**Consequences:**
- 21 AGENTS.md files created (from 1 previously)
- Coverage spans all meaningful directories (excluded leaf content items)
- Build is unaffected — metadata-only change
- Future updates should follow the same hierarchical pattern
- Content leaf directories (individual blog posts/projects) intentionally excluded — covered by collection-level docs

## ADR-002: Remove Unused Public Assets and Stale Deploy Badges

**Context:**
The `public/` directory contained multiple files with zero references in the source code. A `robots.txt` was hardcoding `localhost:4321` while a dynamic `src/pages/robots.txt.ts` was already generating the correct sitemap URL at build time. Root-level deploy badge SVGs (`_deploy_vercel.svg`, `_deploy_netlify.svg`) were unreferenced, and `_deploy_netlify.svg` was stale since the project deploys on Vercel.

**Decision:**
Remove all unreferenced/stale assets:
- `public/brand.svg` — zero references in src/, not used
- `public/social.svg` — zero references in src/, not used
- `public/planet.png` — 14MB decorative image, zero references
- `public/robots.txt` — stale (hardcoded localhost), superseded by dynamic `src/pages/robots.txt.ts`
- `_deploy_vercel.svg` — unreferenced deploy badge
- `_deploy_netlify.svg` — stale (project uses Vercel, not Netlify)

**Rationale:**
- Reduces repository size and noise
- Eliminates confusion between static `robots.txt` and the dynamic route
- Verified all remaining public/ assets are actively referenced in source code
- Only removed files with confirmed zero usage

**Consequences:**
- ~14MB reclaimed (primarily from planet.png)
- 5 stale/unused files removed
- Dynamic robots.txt route handles URL correctly at build time
- public/AGENTS.md updated to reflect the cleaned file listing
