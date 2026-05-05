<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# lib

## Purpose
Utility functions shared across the application. Provides formatting helpers and class name management utilities.

## Key Files

| File | Description |
|------|-------------|
| `utils.ts` | Utility functions: `cn()`, `formatDate()`, `readingTime()`, `truncateText()` |

## For AI Agents

### Working In This Directory
- Import via `@lib/utils` path alias
- `cn()` combines `clsx` and `tailwind-merge` for conditional Tailwind classes
- `formatDate()` returns localized date strings (e.g., "May 4, 2026")
- `readingTime()` estimates read time from HTML content
- `truncateText()` safely truncates strings with ellipsis

### Common Patterns
- All functions are pure and side-effect free
- Default export is not used; all functions are named exports

## Dependencies

### External
- `clsx` - Conditional class name construction
- `tailwind-merge` - Tailwind class conflict resolution

<!-- MANUAL: -->
