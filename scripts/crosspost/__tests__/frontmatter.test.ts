import { describe, it, expect } from 'vitest'
import { parsePost } from '../../src/frontmatter.js'

describe('parsePost', () => {
  it('extracts frontmatter and body from a markdown file', () => {
    const raw = `---
title: "Hello"
summary: "A short summary"
date: "Jul 20 2023"
draft: false
tags:
  - Foo
  - Bar
---

# Body starts here

More body text.`

    const post = parsePost('hello', '/tmp/hello/index.md', raw)
    expect(post.slug).toBe('hello')
    expect(post.frontmatter.title).toBe('Hello')
    expect(post.frontmatter.summary).toBe('A short summary')
    expect(post.frontmatter.draft).toBe(false)
    expect(post.frontmatter.tags).toEqual(['Foo', 'Bar'])
    expect(post.frontmatter.date.getFullYear()).toBe(2023)
    expect(post.body).toContain('# Body starts here')
    expect(post.body).toContain('More body text.')
  })

  it('defaults missing fields gracefully', () => {
    const raw = `---
title: "Minimal"
summary: ""
date: "2024-01-01"
---

Body.`

    const post = parsePost('minimal', '/tmp/min/index.md', raw)
    expect(post.frontmatter.tags).toEqual([])
    expect(post.frontmatter.draft).toBe(false)
    expect(post.frontmatter.description).toBeUndefined()
  })

  it('handles draft posts', () => {
    const raw = `---
title: "Draft"
summary: ""
date: "2024-01-01"
draft: true
---

Body.`

    const post = parsePost('draft', '/tmp/draft/index.md', raw)
    expect(post.frontmatter.draft).toBe(true)
  })

  it('falls back to slug when title is missing', () => {
    const raw = `---
title: ""
summary: ""
date: "2024-01-01"
---

Body.`

    const post = parsePost('my-slug', '/tmp/x/index.md', raw)
    expect(post.frontmatter.title).toBe('my-slug')
  })
})
