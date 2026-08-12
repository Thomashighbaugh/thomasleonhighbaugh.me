/**
 * dev.to crosspost client.
 *
 * Create an article via the public REST API:
 *   POST https://dev.to/api/articles
 *   Headers: api-key: <DEVTO_API_KEY>
 *
 * Body fields used:
 *   title, body_markdown, published, tags, canonical_url, description
 *
 * Articles are created as the authenticated user. Setting `canonical_url`
 * tells dev.to not to penalize the duplicate content.
 */

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

const DEVTO_API_BASE = 'https://dev.to/api'

export const devtoFactory = (): PlatformClient => ({
  id: 'devto',
  displayName: 'dev.to',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const apiKey = ctx.config.credentials.apiKey
    if (!apiKey) throw new Error('dev.to: DEVTO_API_KEY is not set')

    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`
    const description = post.frontmatter.description ?? post.frontmatter.summary

    const payload = {
      article: {
        title: post.frontmatter.title,
        description,
        body_markdown: wrapWithFooter(rendered.markdown, canonicalUrl),
        published: true,
        tags: post.frontmatter.tags.slice(0, 4), // dev.to allows 4 tags max
        canonical_url: canonicalUrl,
      },
    }

    if (ctx.dryRun) {
      // eslint-disable-next-line no-console
      console.log('[dry-run] dev.to', JSON.stringify(payload, null, 2))
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    const res = await httpRequest(`${DEVTO_API_BASE}/articles`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: payload,
    })

    if (res.status !== 201) {
      throw new Error(`dev.to: POST /articles failed: ${res.status} ${res.body}`)
    }

    const data = res.json() as { id: number; url: string } | null
    if (!data?.id) throw new Error(`dev.to: response missing id: ${res.body}`)

    return { remoteId: String(data.id), remoteUrl: data.url }
  },
})

function wrapWithFooter(markdown: string, canonicalUrl: string): string {
  return `${markdown}\n\n---\n\nOriginally published at [${canonicalUrl}](${canonicalUrl}).`
}
