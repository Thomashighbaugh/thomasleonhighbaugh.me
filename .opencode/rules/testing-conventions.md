---
name: testing-conventions
description: Vitest conventions for thomasleonhighbaugh.me — test placement, the SolidJS testing setup, jsdom environment, alias handling, and what is actually worth testing on a static content site
tags: [testing, vitest, solidjs, conventions]
---

# Testing — thomasleonhighbaugh.me

## The setup, as it is

`vitest.config.ts`: `environment: "jsdom"`, `globals: true`, `setupFiles:
["./src/test/setup.ts"]`, `include: ["src/**/*.test.{ts,tsx}"]`, `exclude: ["node_modules", "dist",
"e2e"]`, with `vite-plugin-solid`.

Current suite: **31 tests in 3 files** —

| File | Covers |
|---|---|
| `src/lib/__tests__/utils.test.ts` | 19 tests — pure helpers |
| `src/components/__tests__/Counter.test.tsx` | 3 tests — Solid reactivity |
| `src/components/__tests__/ArrowCard.test.tsx` | 9 tests — component rendering |

`npm test` = `vitest run`. `npm run test:watch`, `npm run test:coverage`.

## Placement

Tests live in a `__tests__/` directory beside the code they test:

```
src/components/ArrowCard.tsx
src/components/__tests__/ArrowCard.test.tsx
```

This differs from the generic template's strict co-location (`ArrowCard.test.tsx` next to the
source). **Follow `__tests__/` here** — it is what the existing suite does and what
`tsconfig.json`'s `exclude` pattern expects.

## What is worth testing on this site

The high-value surface is small, and that is the point:

1. **`src/lib/` helpers** — pure functions, cheap to test, catch real regressions. `utils.test.ts` is
   the model.
2. **Solid components** — anything with state, derived values, or conditional rendering. Use
   `@solidjs/testing-library` (already a dev dependency).
3. **Content schema** — a test asserting that every entry in `src/content/blog/` and `projects/`
   satisfies `src/content/config.ts` and the tag rules in `rules/blog-frontmatter.md` catches
   more real breakage than any component test. Tag count ≤ 2, tag ∈ {AI, Linux, Development,
   Philosophy}, `summary` < 300 chars, title does not end with `.`.
4. **Route correctness** — that `getStaticPaths` emits the expected slugs and excludes drafts.

**Not worth testing:** Astro layout markup snapshots, Tailwind class presence, RSS string output.
They assert implementation, break constantly, and prove nothing.

## Writing a Solid test

```tsx
import { render, screen } from "@solidjs/testing-library"
import { describe, it, expect } from "vitest"
import ArrowCard from "@components/ArrowCard"

describe("ArrowCard", () => {
  it("should render the title when given a post", () => {
    render(() => <ArrowCard entry={fixture} />)
    expect(screen.getByText(fixture.data.title)).toBeInTheDocument()
  })
})
```

- Wrap the component in an arrow function — Solid's `render` takes a function, not an element
- Assert on **user-visible text and roles**, not CSS classes or internal signal names
- `vitest` globals are enabled, but importing `describe`/`it`/`expect` explicitly is also fine and
  is what the existing tests do — match them

## Fixtures

Reusable content fixtures belong in `src/test/fixtures/` (it already exists and has its own
`AGENTS.md`). A fixture must satisfy the real `CollectionEntry` type — cast through a small factory
rather than `as any`, so a schema change surfaces as a type error.

## Aliases

`vitest.config.ts` declares `@`, `@components`, `@lib`, `@test`, `@consts`, `@types`, `@layouts`
explicitly because Vitest does not read `tsconfig.json` paths. Adding a new alias means editing
**both** files. A test that cannot resolve `@newthing` while `npm run build` succeeds is this,
exactly.

## Coverage

`npm run test:coverage`. No threshold is enforced and none should be added — a coverage gate on a
static content site produces tests that exist to satisfy the gate. Read the report to find untested
logic in `src/lib/`, ignore the percentage on `.astro` files (they render to HTML and are not
meaningfully covered by jsdom).

## Before claiming tests pass

Run `npm test` and read the output. Note the exact count — it is 31 today. A change that silently
drops tests to 30 is a regression even if the command exits 0.
