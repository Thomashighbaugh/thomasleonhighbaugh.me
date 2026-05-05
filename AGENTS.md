<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# thomasleonhighbaugh.me

## Purpose
Personal portfolio and blog site built with Astro, featuring blog posts on Linux, Neovim, prompt engineering, and development workflows, along with project showcases. Deployed on Vercel.

## Key Files

| File | Description |
|------|-------------|
| `astro.config.mjs` | Astro configuration with MDX, sitemap, Tailwind, and Solid.js integrations |
| `tailwind.config.mjs` | Tailwind CSS theme with custom fonts, animations, and typography plugin |
| `tsconfig.json` | TypeScript strict config with `@/*` path alias for `src/` |
| `package.json` | Project dependencies and scripts (v6.2.1) |
| `vercel.json` | Vercel deployment configuration |
| `.nvmrc` | Node version management |
| `AGENTS.md` | AI-readable documentation (this file) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `public/` | Static assets (fonts, JS, images, SVGs) (see `public/AGENTS.md`) |
| `.github/` | GitHub workflows and funding (see `.github/AGENTS.md`) |
| `.opencode/` | OpenCode AI configuration (see `.opencode/AGENTS.md`) |

## Build, Lint, and Test Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Dev server (network): `npm run dev:network`
- Build: `npm run build` (runs `astro check && astro build`)
- Preview build: `npm run preview`
- Lint: `npm run lint`
- Auto-fix lint: `npm run lint:fix`
- Run Astro CLI: `npm run astro -- <command>`

## Code Style Guidelines

- **Imports:** Named imports, type imports, single quotes
- **Formatting:** Print width 120, no semicolons, single quotes, trailing commas (es5)
- **Types:** TypeScript, strict null checks enabled
- **Naming:** camelCase for functions/variables, PascalCase for components
- **Astro/SolidJS:** `.astro` for pages/components, `.tsx` for SolidJS components
- **Tailwind:** Utility classes, theme extended in `tailwind.config.mjs`
- **File Paths:** Use `@/*` alias for imports from `src/`

## For AI Agents

### Working In This Directory
- Run `npm run build` before committing to verify no type/build errors
- Astro content collections are in `src/content/` with schema validation in `config.ts`
- SolidJS interactive components live in `src/components/` as `.tsx` files

### Testing Requirements
- No formal test suite yet; manual verification via `npm run dev` and `npm run build`

### Common Patterns
- `@/` path alias maps to `src/` directory
- Content collections define schema in `src/content/config.ts`
- Pages use Astro components (`.astro`) with optional SolidJS islands (`.tsx`)
- Tailwind CSS with dark mode via class strategy

## Dependencies

### Internal
- `src/` - All application source code
- `public/` - Static assets served at root path

### External
- Astro 4.16 - Web framework
- SolidJS 1.9 - Interactive UI components
- Tailwind CSS 3.4 - Utility-first CSS
- TypeScript 5.9 - Type safety
- MDX - Markdown with JSX for content
- Fuse.js 7.1 - Client-side search
- clsx + tailwind-merge - Class name utilities
- sharp - Image processing (build-time)

<!-- MANUAL: Custom project notes can be added below -->
