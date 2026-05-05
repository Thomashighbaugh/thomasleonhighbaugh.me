<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-04 | Updated: 2026-05-04 -->

# search

## Purpose
Client-side search page that enables full-text search across blog posts and projects using Fuse.js.

## Key Files

| File | Description |
|------|-------------|
| `index.astro` | Search page with interactive search interface |

## For AI Agents

### Working In This Directory
- The search page loads the `Search.tsx` SolidJS component as an interactive island
- Search indexes are built from the blog and projects content collections at build time
- Fuse.js provides fuzzy search matching across post titles, summaries, and tags
- The SolidJS search components handle real-time filtering as the user types

## Dependencies

### Internal
- `@components/Search.tsx` - Main SolidJS search component
- `@components/SearchBar.tsx` - Search input component
- `@components/SearchCollection.tsx` - Search results display

### External
- Fuse.js 7.1 - Client-side fuzzy search library

<!-- MANUAL: -->
