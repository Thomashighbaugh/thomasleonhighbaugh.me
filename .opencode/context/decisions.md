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
