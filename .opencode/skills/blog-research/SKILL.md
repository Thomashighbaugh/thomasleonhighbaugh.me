# Blog Research Skill

Research a topic for a thomasleonhighbaugh.me blog post and produce a structured research brief.

## When to Use

Use this skill when:
- The user says "research X for a blog post" or "find sources on Y"
- A blog post topic needs primary sources, counterarguments, and cultural references
- You need to gather material before the blog-writer agent can start drafting

## Workflow

### Phase 1: Scope the Research

Ask the user (or infer from context):
1. What is the core question or thesis?
2. What angle would make this post distinctive?
3. Are there specific sources or references the user wants included?
4. What is the target audience? (Default: HN/technical audience)

### Phase 2: Gather Sources

Use available tools to gather:
- **Context7 MCP** — For library/framework documentation, SDK docs, API references
- **WebFetch** — For articles, blog posts, academic papers, HN discussions, Reddit threads
- **GitHub search** (via `gh`) — For relevant repos, issues, discussions

Prioritize:
1. Primary sources (official docs, papers, standards)
2. Authoritative commentary (well-known figures in the field)
3. Community discussion (HN, Reddit, lobste.rs)
4. Critical takes (counterarguments, rebuttals)

### Phase 3: Produce Research Brief

Delegate to `@blog-researcher`:

```
@blog-researcher

**Context**: Blog post about [topic] for thomasleonhighbaugh.me
**Scope**: [What was scoped in Phase 1]
**Sources**: [Sources gathered in Phase 2]
**Task**: Produce a structured research brief covering key sources, arguments, counterarguments, cultural references, and HN angle
**Expected Output**: Research brief in the format specified in the agent prompt
```

### Phase 4: Review and Refine

Review the research brief for:
- Completeness — are there obvious gaps?
- Quality — are sources authoritative?
- HN angle — is there a clear hook?
- Cultural references — are they appropriate and accurate?

Present the brief to the user for approval before passing to the blog-writer.

## Output

A structured research brief containing:
- Thesis statement
- Key sources with annotations
- Arguments for and against
- Cultural/historical references
- Technical details
- HN angle and hook suggestion
- Open questions

## Related

- `@blog-researcher` — Research agent
- `@blog-writer` — Writing agent that consumes research briefs
- `.opencode/rules/blog-writing-style.md` — Style guide for reference
