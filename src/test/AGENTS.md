<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-16 -->

# test

## Purpose
Test infrastructure for the project. Contains Vitest setup, shared test fixtures, and configuration for unit and component testing.

## Key Files

| File | Description |
|------|-------------|
| `setup.ts` | Vitest setup file — imports `@testing-library/jest-dom` matchers |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `fixtures/` | Reusable test fixtures and mock factories (see `fixtures/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `setup.ts` is loaded automatically by Vitest via `vitest.config.ts`
- Fixtures provide reusable `CollectionEntry` mock factories for blog and project content
- Test files live in `__tests__/` directories next to their source files, not in this directory

### Common Patterns
- Import fixtures via `@test/fixtures/content` path alias
- Use `describe`/`it` blocks with Vitest globals enabled
- Component tests use `@solidjs/testing-library` `render` function

<!-- MANUAL: -->
