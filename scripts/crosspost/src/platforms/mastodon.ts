/**
 * Mastodon crosspost client.
 *
 * Mastodon is a federated network — pick any instance (e.g. mastodon.social,
 * peoplemaking.games, chaos.social). We speak the Mastodon REST API directly
 * via the shared `httpRequest` helper (no external client library).
 *
 * Post format: short text + canonical URL. Mastodon's character limit is
 * 500 by default but most instances allow more (up to ~10,000). We cap at
 * 500 to be safe across instances.
 *
 * Required credentials:
 *   MASTODON_INSTANCE  — e.g., https://mastodon.social
 *   MASTODON_TOKEN     — User access token (Settings → Development → New Token)
 */

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

const MAX_CHARS = 480 // leave room for the URL + ellipsis

export const mastodonFactory = (): PlatformClient => ({
  id: 'mastodon',
  displayName: 'Mastodon',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const instance = ctx.config.credentials.instance
    const token = ctx.config.credentials.token
    if (!instance || !token) {
      throw new Error('Mastodon: MASTODON_INSTANCE and MASTODON_TOKEN are required')
    }

    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`
    const text = truncateForMastodon(post.frontmatter.summary, canonicalUrl)

    if (ctx.dryRun) {
      // eslint-disable-next-line no-console
      console.log('[dry-run] mastodon', { text, visibility: 'public' })
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    const res = await httpRequest(`${instance}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: {
        status: text,
        visibility: 'public',
      },
    })

    if (res.status !== 200) {
      throw new Error(`Mastodon: POST /api/v1/statuses failed: ${res.status} ${res.body}`)
    }

    const data = res.json() as { id: string; url?: string } | null
    if (!data?.id) throw new Error(`Mastodon: response missing id: ${res.body}`)

    return {
      remoteId: data.id,
      remoteUrl: data.url ?? `${instance}/@me/${data.id}`,
    }
  },
})

function truncateForMastodon(summary: string, canonicalUrl: string): string {
  const fixed = `\n\n${canonicalUrl}`
  const budget = MAX_CHARS - fixed.length
  if (summary.length <= budget) return `${summary}${fixed}`
  const slice = summary.slice(0, budget - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${trimmed}…${fixed}`
}
