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

## ADR-003: Astro 5 Migration, Codebase Improvements, and Cleanup

**Context:**
The project was on Astro 4.16 and had several quality gaps: no testing, stale template fork artifacts (Mark Horn references), unoptimized images (7.3MB raw PNGs), no error handling, no structured SEO data, and `client:load` eager-loading on all SolidJS islands.

**Decision:**
Execute a multi-phase improvement plan encompassing 6 workstreams:

1. **Astro 5 Migration** — Upgrade from 4.16 to 5.18 with legacy collections flag. Package bumps: `@astrojs/mdx` 2→4, `@astrojs/solid-js` 4→5, `@astrojs/check` 0.5→0.9.
2. **Error Landscaping** — Create `404.astro` page, fix ArrowCard type error (`as string[]` cast).
3. **Template Fork Cleanup** — Replace `SITE.AUTHOR: "Mark Horn"` with `"Thomas Leon Highbaugh"`, replace stale hardcoded `SOCIALS` array (markhorn-dev emails, repos, socials) with a single reference to `links.thomasleonhighbaugh.me`, remove unused `Socials` type and orphaned imports.
4. **Image Pipeline** — Create `scripts/optimize-images.mjs` prebuild script using `sharp` (already a dependency) to convert all content images to WebP with 1200px max-width. 93.7% savings (7.33MB → 0.46MB). Runs automatically before every build.
5. **Structured Data (JSON-LD)** — Create reusable `JsonLd.astro` component. Add `WebSite` + `Person` schema on homepage, `BlogPosting` on blog posts, `CreativeWork` on projects, `BreadcrumbList` on about page.
6. **Client Island Strategy** — Change `client:load` to `client:idle` on blog and project listing SearchCollection components (search page stays as `client:load`).

**Rationale:**
- Astro 5 unlocks content layer, better image optimization, server islands, and Vite 6 — future-proofing
- 404 page provides branded error experience instead of Vercel default
- Template fork artifacts (Mark Horn) would confuse visitors and harm SEO authorship signals
- Hardcoded stale social links are a maintenance burden — single links page is simpler
- Image pipeline saves 7MB+ per build and improves page load times
- JSON-LD structured data enables rich search result snippets
- `client:idle` defers JS loading to first idle moment, improving initial page load without UX impact

**Consequences:**
- Build passes clean: 0 errors, 0 warnings, 39 pages, 2.4s build time
- AGENTS.md files in `src/pages/` and `src/content/` subdirectories were moved to `.opencode/context/frameworks/` because Astro treats `.md` files in `src/pages/` as routes
- `.webp` files are generated artifacts — consider adding `*.webp` to `.gitignore` if they should not be committed
- Social links page at `links.thomasleonhighbaugh.me` becomes the single source of truth for social presence
- Future image additions should run `npm run build` (prebuild script handles optimization automatically)

## ADR-004: Test Foundation

**Context:**
The project had zero test infrastructure. There was no test framework, no test files, and no way to verify correctness during refactors or upgrades. The pure utility functions in `src/lib/utils.ts` and SolidJS components were the highest-value targets for initial test coverage.

**Decision:**
Add a Vitest-based test foundation:

- **Framework**: Vitest 3.x with jsdom environment for unit/component tests
- **SolidJS support**: `vite-plugin-solid` for JSX transform, `@solidjs/testing-library` for component rendering
- **Config**: `vitest.config.ts` at project root with `@/*` path alias resolution matching the Astro tsconfig
- **Setup**: `src/test/setup.ts` importing `@testing-library/jest-dom` matchers
- **Fixtures**: `src/test/fixtures/content.ts` with reusable mock `CollectionEntry` factories for blog and project entries
- **Test exclusion**: Added `src/**/*.test.*`, `src/**/*.spec.*`, `e2e` to `tsconfig.json` `exclude` to prevent `astro check` from scanning test files
- **Package scripts**: `test` (vitest run), `test:watch` (vitest), `test:coverage` (vitest run --coverage)

**Test files created (31 tests, 3 files):**

| Test file | Tests | What it covers |
|-----------|-------|----------------|
| `src/lib/__tests__/utils.test.ts` | 19 | `cn()`, `formatDate()`, `readingTime()`, `truncateText()` — all edge cases including falsy filtering, invalid dates, empty strings, boundary lengths, documented negative-cutoff behavior |
| `src/components/__tests__/ArrowCard.test.tsx` | 9 | Rendering title, date, summary, tags, pill badges (blog/project), hide pill when not set, correct href with collection+slug, project vs blog routing |
| `src/components/__tests__/Counter.test.tsx` | 3 | Initial state, singular/plural text, multi-click increment |

**Rationale:**
- Pure functions are the safest starting point (zero dependencies, zero mocking needed)
- SolidJS component tests validate the `@solidjs/testing-library` + Vitest pipeline works
- Fixture factories enable easy expansion to Search/SearchCollection/other component tests
- Excluding test files from `tsconfig.json` prevents `astro check` from failing on test-only imports

**Consequences:**
- All 31 tests pass, build still passes clean (0 errors, 39 pages, 2.4s)
- Adding new tests: create `__tests__/*.test.ts(x)` next to the source file, add to fixtures if needed
- `npm run test` runs before any code change — recommended as a pre-commit hook
- No coverage threshold enforced yet — available via `npm run test:coverage`
- E2E tests deferred — Playwright setup not included in this ADR
