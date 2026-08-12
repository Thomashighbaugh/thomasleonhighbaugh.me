import { describe, it, expect } from 'vitest'
import { render } from '../../src/renderer.js'
import type { BlogPost } from '../../src/frontmatter.js'

const SITE = 'https://thomasleonhighbaugh.me'

function makePost(body: string, summary = 'A short summary.'): BlogPost {
  return {
    slug: 'sample',
    filePath: '/src/content/blog/sample/index.md',
    frontmatter: {
      title: 'Sample Post',
      summary,
      date: new Date('2024-01-01'),
      draft: false,
      tags: ['Test'],
    },
    body,
  }
}

describe('render', () => {
  it('absolutizes relative image references', () => {
    const post = makePost(`![banner](./banner.jpg "title")`)
    const { html } = render(post, SITE)
    expect(html).toContain('https://thomasleonhighbaugh.me/blog/sample/banner.jpg')
  })

  it('absolutizes relative internal links', () => {
    const post = makePost(`See [other](/blog/other).`)
    const { html } = render(post, SITE)
    expect(html).toContain('https://thomasleonhighbaugh.me/blog/other')
  })

  it('strips the leading H1 so platforms do not double-render the title', () => {
    const post = makePost(`# Sample Post\n\nBody text.`)
    const { html } = render(post, SITE)
    expect(html).not.toContain('<h1>Sample Post</h1>')
    expect(html).toContain('Body text.')
  })

  it('builds an excerpt with the canonical URL', () => {
    const post = makePost('Body.', 'This is the summary.')
    const { excerpt } = render(post, SITE)
    expect(excerpt).toContain('This is the summary.')
    expect(excerpt).toContain('https://thomasleonhighbaugh.me/blog/sample/')
  })

  it('truncates long summaries at a word boundary', () => {
    const longSummary = 'word '.repeat(200).trim()
    const post = makePost('body.', longSummary)
    const { excerpt } = render(post, SITE, 100)
    expect(excerpt.length).toBeLessThanOrEqual(120)
    expect(excerpt).not.toMatch(/\s$/)
  })

  it('falls back to the first paragraph when summary is empty', () => {
    const post = makePost('First paragraph here.\n\nSecond paragraph.', '')
    const { excerpt } = render(post, SITE)
    expect(excerpt).toContain('First paragraph here.')
    expect(excerpt).not.toContain('Second paragraph.')
  })

  it('preserves the markdown source for markdown-native platforms', () => {
    const post = makePost(`## Heading\n\n- list item`)
    const { markdown } = render(post, SITE)
    expect(markdown).toContain('## Heading')
    expect(markdown).toContain('- list item')
  })
})
