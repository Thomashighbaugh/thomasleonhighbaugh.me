# Blog Writer Skill

Write a complete blog post for thomasleonhighbaugh.me from outline to polished draft.

## When to Use

Use this skill when the user says "write a blog post about X" or "draft a post on Y topic." This skill orchestrates the full blog writing pipeline: outline → research → draft → edit → headline optimization.

## Workflow

### Phase 1: Outline (always first)
Before any research or drafting, produce a brief outline that crystallizes the thesis and structure. This is the first and most important step — the outline defines what the post is about and where it's going.

```markdown
## Outline: [Working Title]

### Thesis
[One sentence — the core argument of the post]

### Sections
1. [Section title] — [What this section argues, 1 sentence]
2. [Section title] — [What this section argues, 1 sentence]
3. [Section title] — [What this section argues, 1 sentence]
...

### HN Angle
[What makes this post HN-worthy — why would someone want to argue about it?]

### Research Needs
[What gaps the outline reveals — specific things to look up]
```

Present this to the user and ask for approval before proceeding. The outline must be approved before moving to research or drafting.

### Phase 2: Research (fills gaps the outline revealed)
If the outline reveals research needs, delegate to `@blog-researcher` with the approved outline as context:

```
@blog-researcher

**Context**: Blog post about [topic] for thomasleonhighbaugh.me
**Approved Outline**: [Thesis + sections from Phase 1]
**Research Needs**: [Specific gaps identified in the outline]
**Task**: Produce a structured research brief covering key sources, arguments, counterarguments, cultural references, and HN angle
**Expected Output**: Research brief in the format specified in the agent prompt
```

If the outline is self-contained and the topic is already well-understood, skip this phase.

### Phase 3: Draft
Once the outline is approved (and research is done if needed), delegate to `@blog-writer`:

```
@blog-writer

**Context**: Blog post for thomasleonhighbaugh.me
**Topic**: [Topic]
**Approved Outline**: [Thesis + sections from Phase 1]
**Research Brief**: [If research was done]
**Task**: Write the complete post as index.md in src/content/blog/{post-slug}/
**Constraints**: 
- Set draft: true
- Follow the blog writing style rules
- Include full frontmatter
- No placeholder text
```

### Phase 4: Edit
After the draft is written, delegate to `@blog-editor`:

```
@blog-editor

**Context**: Blog post at src/content/blog/{post-slug}/index.md
**Task**: Edit and polish the post. Check structure, prose, frontmatter, HN optimization, and technical accuracy.
**Expected Output**: Edit report with applied changes
```

### Phase 5: Headline Optimization
Delegate to `@hn-headline-crafter`:

```
@hn-headline-crafter

**Context**: Blog post at src/content/blog/{post-slug}/index.md
**Task**: Produce 5-10 headline variants ranked by predicted HN performance
**Expected Output**: Headline variants with rationale
```

Present the top variants to the user for final selection.

### Phase 6: Final Review
- Verify `npm run build` passes (no type errors)
- Verify frontmatter is valid per `blog-frontmatter.md`
- Confirm the post directory has all required assets

## Output

The final deliverable is:
1. A complete `index.md` in `src/content/blog/{post-slug}/`
2. An edit report (if edits were applied)
3. A headline recommendation
4. Build verification result

## Related

- `@blog-writer` — Agent that writes the post
- `@blog-editor` — Agent that edits and polishes
- `@blog-researcher` — Agent that researches topics
- `@hn-headline-crafter` — Agent that optimizes headlines
- `.opencode/rules/blog-writing-style.md` — Style guide
- `.opencode/rules/blog-frontmatter.md` — Frontmatter validation
