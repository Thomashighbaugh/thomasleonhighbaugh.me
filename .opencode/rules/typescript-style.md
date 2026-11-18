---
name: typescript-style
description: TypeScript and JavaScript conventions for thomasleonhighbaugh.me — strict types, path aliases, import style, null safety, and the codebase's inconsistent formatting, which you must not "fix"
tags: [typescript, conventions, coding-style, astro]
---

# TypeScript Style — thomasleonhighbaugh.me

## Compiler settings (already configured — do not weaken)

`tsconfig.json` extends `astro/tsconfigs/strict` and adds `strictNullChecks: true`. That is the
floor. Do not add `@ts-ignore`, `as any`, or `// @ts-expect-error` without a comment naming the
upstream type bug and a link.

Available but not enabled: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. Enabling either
is a separate change with its own diff — not a drive-by improvement while doing something else.

## Imports — the `@` alias

`tsconfig.json` defines `"@*": ["src/*"]`, so imports look like:

```ts
import { SITE } from "@consts"
import Header from "@components/Header.astro"
import PageLayout from "@layouts/PageLayout.astro"
import type { Site, Page, Links } from "@types"
```

**Use these, not relative paths.** `../../components/Header.astro` is a defect.

**The Vitest trap:** `vitest.config.ts` cannot read tsconfig paths and re-declares a subset
(`@`, `@components`, `@lib`, `@test`, `@consts`, `@types`, `@layouts`). A new top-level directory
imported by a test needs an entry in **both** files. This resolves in `npm run build` and fails in
`npm test` — the most expensive kind of inconsistency to debug.

Type-only imports use `import type` (verbatim above). External → internal → types.

## Formatting — match the file, do not reformat

The repo is **not** consistently formatted and has no Prettier or ESLint config committed.
`src/lib/utils.ts` ends statements with semicolons; `src/components/ArrowCard.tsx` does not. Both
are tracked.

**Rule: match the file you are editing.** Do not convert a file's semicolon style, quote style, or
indentation as part of an unrelated change — it buries the real diff. `npm run lint` runs `eslint .`
and is currently not authoritative; do not treat a new lint warning as a blocker unless it is a real
error.

Preferred, where you have a free choice: single quotes, no semicolons, 2-space indent, ≤ 120 cols.
That is the majority style in `src/components/`.

## Naming

| Kind | Convention | Example |
|---|---|---|
| Types / interfaces | PascalCase | `Site`, `Page`, `Links`, `CollectionEntry<"blog">` |
| Functions / variables | camelCase | `getCollection`, `canonicalURL` |
| Constants (module-level config) | UPPER_SNAKE | `SITE`, `BLOG`, `PROJECTS`, `SOCIALS_LINKS_HREF` |
| Astro components | PascalCase `.astro` | `BaseHead.astro`, `ArrowCard.astro` |
| Solid components | PascalCase `.tsx` | `SearchBar.tsx`, `SearchCollection.tsx` |
| Content dirs | kebab-case | `src/content/blog/no-stupid-its-not-intelligent/` |

## Null safety

- `??` for defaults, not `||` — `0` and `""` are legitimate values in this codebase
- Optional chaining over nested `&&`
- `unknown` over `any` at boundaries; narrow with a type guard
- Content frontmatter is already validated by `src/content/config.ts` — trust the schema rather than
  re-checking `post.data.title` for null

## Astro specifics

- Frontmatter is TypeScript; the same rules apply inside `---` fences
- Props are declared with an `interface Props` and `Astro.props` destructured — follow the pattern in
  `BaseHead.astro`
- `import.meta.env.SITE` is typed as `string | undefined`; `robots.txt.ts` uses it inside `new URL()`
  without a guard — do not copy that into new code without a guard
- Solid islands need `jsxImportSource: "solid-js"` (already set); JSX in `.astro` files is not
  supported at all

## Async

`async`/`await` over `.then()`. `Promise.allSettled()` for independent parallel work where one
failure should not abort the rest — `getCollection` calls in `getStaticPaths` are independent and
already follow this shape.
