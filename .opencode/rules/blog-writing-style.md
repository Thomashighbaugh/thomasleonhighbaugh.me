# Blog Writing Style: thomasleonhighbaugh.me

## Voice & Tone

- **First-person, opinionated, authoritative.** Write as someone who has earned the right to have strong opinions through experience. Use "I" freely. Do not hedge.
- **Conversational but not casual.** Write like a smart friend explaining something at a bar — clear, direct, occasionally profane, never academic in the bad way. Avoid corporate-speak, marketing fluff, and "in today's digital landscape" openings.
- **Intellectual but accessible.** Assume the reader is curious and capable but not a domain expert. Define jargon on first use. Use analogies. Ground abstract concepts in concrete examples.
- **Dry humor and cultural references.** Wit is welcome. References to *2001: A Space Odyssey*, *The Simpsons*, D&D, programming culture, and internet history are on-brand. Forced memes are not.
- **Blunt honesty.** Call out bullshit — cargo cults, marketing myths, bad practices, hype cycles. The blog's voice is "someone who has been burned by this and wants to save you the trouble."

## Structural Patterns

### Opening
- Start with a hook that frames the problem or stakes. Often a provocative claim, a personal anecdote, or a cultural observation.
- Do NOT start with "In this article, we'll explore..." or "In today's rapidly evolving landscape..."
- The first paragraph should make the reader want to argue with you or share it with someone.

### Body
- Use section headings (##) as argumentative moves, not just topic labels. Each heading should advance the thesis.
- Short paragraphs (2-5 sentences). Long paragraphs only for narrative flow or technical depth.
- Use block quotes (`>`) for emphasis, epigraphs, or counterpoints.
- Use code blocks for technical examples. Keep them focused and annotated.
- Lists (bulleted or numbered) for enumerations, not for avoiding prose.

### Closing
- End with a punch — a memorable image, a call to reflection, or a provocative restatement of the thesis.
- Do NOT end with "In conclusion..." or "Thanks for reading."
- Cross-reference other blog posts naturally via inline links.

## Technical Depth Standards

- **Tutorial posts** (Neovim, Firefox, Git): Step-by-step with commands, expected output, and troubleshooting. Assume the reader is following along.
- **Analysis posts** (LLM cargo cult, Indian philosophy, init systems): Cite sources, name names, engage with counterarguments. Show your work.
- **Tool posts** (Hubs, OpenCode, swarm engineering): Explain the *why* before the *how*. Architecture and philosophy first, implementation second.
- **Comparison posts** (Claude vs ChatGPT): Fair to both sides, but land on a position. "It depends" is a cop-out — give a recommendation.

## Hacker News Optimization

- **Headlines should be substantive and slightly provocative.** Good: "The Great LLM Cargo Cult: Why Your Chatbot Isn't Thinking — It's Just Really Good at Hooting." Bad: "An Introduction to Large Language Models."
- **First paragraph should be quotable.** HN readers scan the first 3-4 sentences before deciding to read or comment. Make those sentences earn the click.
- **Include a "thesis sentence" in the first 200 characters.** The reader should know exactly what position the post takes.
- **Anticipate and address counterarguments.** HN commenters are smart and contrarian. If you don't address the obvious objection, they will in the comments.
- **Avoid clickbait that doesn't deliver.** The headline can be provocative, but the content must substantiate the provocation. HN readers punish bait-and-switch mercilessly.

## Frontmatter Conventions

```yaml
---
title: "Title Here"
summary: "1-2 sentence summary for card previews and RSS"
date: "Mon DD YYYY"
draft: false
tags:
  - AI
---
```

- `title`: Should be distinctive and searchable. Subtitles after a colon are common.
- `summary`: Must stand alone. Someone reading this in an RSS reader or HN preview should know what the post is about and why they should care. This is the primary field — `description` is optional extra metadata.
- `tags`: Exactly 1 or 2 broad conceptual tags from the canonical set: `AI`, `Linux`, `Development`, `Philosophy`. See `.opencode/rules/blog-frontmatter.md` for the full convention.
- `draft`: Set to `true` during writing. Only set to `false` when ready to publish.
- `description`: Optional. 2-3 sentence SEO description. Falls back to `summary` if absent.

## Image Conventions

- Images go in the post directory alongside `index.md`
- Use WebP format (generated via prebuild script)
- Alt text is required on all images
- Captions via `![alt](./file.webp "caption")` syntax

## Cross-Referencing

- Link to other blog posts using relative paths: `/blog/post-slug`
- Link to external sources with full URLs
- When referencing a previous post's argument, summarize it briefly so the link is optional, not required
