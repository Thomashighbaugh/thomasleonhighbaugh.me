# HN Optimizer Skill

Optimize a blog post for Hacker News engagement — headline, first paragraph, argument structure, and counterargument anticipation.

## When to Use

Use this skill when:
- The user says "optimize this for HN" or "make this HN-ready"
- A blog post draft is complete and needs HN-specific polish
- You want to maximize the chances of a post reaching the HN front page

## Workflow

### Phase 1: Read and Analyze

Read the full post at the specified path. Analyze it against HN success factors:

1. **Headline** — Is it substantive and slightly provocative? Does it signal depth?
2. **First paragraph** — Is it quotable? Does it state the thesis in the first 200 characters?
3. **Argument structure** — Does it anticipate counterarguments? Is the position clear?
4. **Depth signal** — Does the post demonstrate expertise, data, or original thinking?
5. **Bait-and-switch check** — Does the content deliver on the headline's promise?

### Phase 2: Headline Optimization

Delegate to `@hn-headline-crafter`:

```
@hn-headline-crafter

**Context**: Blog post at [path]
**Task**: Produce headline variants optimized for HN
**Expected Output**: 5-10 variants with rationale
```

### Phase 3: First Paragraph Rewrite (if needed)

If the first paragraph doesn't hook within 200 characters, rewrite it. The rewrite must:
- State the thesis clearly
- Be quotable in isolation
- Make the reader want to argue or share
- Preserve the author's voice

### Phase 4: Counterargument Scan

Scan the post for unaddressed counterarguments. For each one found:
1. Note where the objection would arise
2. Draft a paragraph or sentence that addresses it
3. Insert it at the appropriate point in the argument

### Phase 5: Apply Changes

Apply all approved changes to the file. Do not change the author's voice, technical content, or overall structure unless it directly impacts HN performance.

## Output

```markdown
## HN Optimization Report

### Headline
- Original: [headline]
- Recommended: [headline]
- Rationale: [why this variant]

### First Paragraph
- [Original or OK]
- [Changes if any]

### Counterarguments Addressed
- [Counterargument] → [How addressed, location in post]

### Risk Assessment
- [What could go wrong on HN]
- [How the post mitigates it]

### Changes Applied
- [List of file changes]
```

## Related

- `@hn-headline-crafter` — Headline optimization agent
- `.opencode/rules/blog-writing-style.md` — HN optimization section
