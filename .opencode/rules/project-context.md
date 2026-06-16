# Project Context: thomasleonhighbaugh.me

## Stack
- **Framework**: Astro 5.18 (with legacy collections)
- **UI**: SolidJS 1.9 (interactive islands), Tailwind CSS 3.4
- **Content**: MDX with Astro content collections (blog, projects, legal, work)
- **Testing**: Vitest 3.x + @solidjs/testing-library
- **Deployment**: Vercel (via vercel.json)
- **Node**: >=24.x (per .nvmrc)

## Key Paths
- `@/` → `src/` (TypeScript path alias)
- Content collections: `src/content/{blog,projects,legal,work}/`
- Pages: `src/pages/` (file-based routing)
- Components: `src/components/` (`.astro` static, `.tsx` SolidJS)
- Layouts: `src/layouts/` (top/bottom split pattern)
- Tests: `__tests__/` directories next to source files

## Build Commands
- `npm run dev` — dev server
- `npm run build` — astro check + astro build (run before committing)
- `npm run test` — vitest (31 tests across 3 files)
- `npm run lint` — eslint

## Conventions
- Single quotes, no semicolons, trailing commas (es5)
- Named exports only (no default exports)
- Tailwind utility classes for all styling
- `cn()` from `@lib/utils` for conditional class merging
- `client:idle` for SolidJS islands (except search page uses `client:load`)
- Image optimization runs via prebuild script (sharp → WebP)
