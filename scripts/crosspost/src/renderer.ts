/**
 * Markdown → platform-specific rendering.
 *
 * dev.to, LinkedIn articles, and X long-form posts all accept
 * either markdown or HTML. Mastodon, Bluesky, Telegram, and short X posts
 * need a plain-text summary with a link.
 *
 * The renderer also handles Astro-specific image references
 * (`![alt](./banner.jpg "title")`) and relative internal links
 * (`/blog/other-post`), rewriting them to absolute URLs against the
 * configured site origin.
 */

import MarkdownIt from 'markdown-it'

export interface RenderResult {
  /** Markdown source — kept for platforms that accept markdown natively. */
  markdown: string
  /** HTML rendered from the markdown (with relative links rewritten). */
  html: string
  /** Plain-text excerpt for short-form posts (Mastodon, Bluesky, X, Telegram). */
  excerpt: string
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

/**
 * Render a post into the three formats most platforms need.
 *
 * - `siteUrl` is used to absolutize relative links.
 * - `slug` is the post's directory name, used to build the canonical URL.
 * - `maxExcerptChars` caps the length of the short-form excerpt.
 */
export function render(post: {
  slug: string
  body: string
  frontmatter: { title: string; summary: string; tags: string[] }
}, siteUrl: string, maxExcerptChars = 500): RenderResult {
  const canonicalUrl = `${siteUrl}/blog/${post.slug}/`

  // Rewrite relative `./foo.jpg` image references to absolute URLs.
  // In the rendered site, these images end up at /blog/<slug>/<image>,
  // so the CDN URL is "<siteUrl>/blog/<slug>/<image>".
  const rewritten = post.body.replace(
    /!\[([^\]]*)\]\(\.\/([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt: string, filename: string, title?: string) => {
      const imageUrl = `${siteUrl}/blog/${post.slug}/${filename}`
      const titlePart = title ? ` "${title}"` : ''
      return `![${alt}](${imageUrl}${titlePart})`
    },
  )

  // Rewrite relative internal links — Astro uses /blog/<other-slug>/.
  // Also unwrap markdown reference links to plain URLs.
  const rewrittenLinks = rewritten.replace(
    /\[([^\]]+)\]\(\/([^)]+)\)/g,
    (_, text: string, path: string) => `[${text}](${siteUrl}/${path})`,
  )

  // Convert the first H1 (the post title) into a heading that platforms
  // won't double-render — most platforms prepend the title themselves.
  const withoutH1 = rewrittenLinks.replace(/^#\s+.+\n+/, '')

  const html = md.render(withoutH1)
  const markdown = withoutH1

  const excerpt = buildExcerpt(post.frontmatter.summary, post.body, maxExcerptChars, canonicalUrl)

  return { markdown, html, excerpt }
}

function buildExcerpt(summary: string, body: string, maxChars: number, canonicalUrl: string): string {
  // Prefer the user-authored summary. If it's too long, truncate at a word
  // boundary and append a link. If it's empty, fall back to the first
  // paragraph of the body.
  const source = (summary || extractFirstParagraph(body)).trim()
  if (source.length <= maxChars) {
    return `${source}\n\n${canonicalUrl}`
  }

  const truncated = truncateAtWord(source, maxChars - canonicalUrl.length - 8)
  return `${truncated}…\n\n${canonicalUrl}`
}

function extractFirstParagraph(body: string): string {
  const lines = body.split('\n')
  let inParagraph = false
  const collected: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!inParagraph) {
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue
      inParagraph = true
    }
    if (inParagraph) {
      if (!trimmed) break
      collected.push(trimmed)
    }
  }
  return collected.join(' ')
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return lastSpace > 0 ? slice.slice(0, lastSpace) : slice
}
