/**
 * Bluesky crosspost client.
 *
 * Bluesky uses the AT Protocol. The public-facing API is at
 * https://bsky.social (or any PDS — Personal Data Server). To post you
 *   1. Create a session with identifier + app password
 *   2. POST /xrpc/com.atproto.repo.createRecord with a `app.bsky.feed.post`
 *      record.
 *
 * Required credentials:
 *   BLUESKY_IDENTIFIER   — handle (e.g. tlh.bsky.social) or email
 *   BLUESKY_APP_PASSWORD — app password (Settings → App Passwords)
 *
 * We talk to the public `https://bsky.social` PDS by default; a custom PDS
 * host can be added later if needed. Note: `public.api.bsky.app` is a
 * read-only public API and does NOT support `createSession` (it returns
 * 405) — authentication must go through a real PDS like bsky.social.
 */

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

const PDS_HOST = 'https://bsky.social'
const MAX_CHARS = 290

export const blueskyFactory = (): PlatformClient => ({
  id: 'bluesky',
  displayName: 'Bluesky',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const identifier = ctx.config.credentials.identifier
    const appPassword = ctx.config.credentials.appPassword
    if (!identifier || !appPassword) {
      throw new Error('Bluesky: BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD are required')
    }

    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`
    const text = truncateForBluesky(post.frontmatter.summary)

    if (ctx.dryRun) {
      console.log('[dry-run] bluesky', { text })
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    // Step 1: create session
    const sessionRes = await httpRequest(`${PDS_HOST}/xrpc/com.atproto.server.createSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { identifier, password: appPassword },
    })
    if (sessionRes.status !== 200) {
      throw new Error(`Bluesky: createSession failed: ${sessionRes.status} ${sessionRes.body}`)
    }
    const session = sessionRes.json() as { did: string; accessJwt: string; handle: string }

    // Step 2: create post record
    const createdAt = new Date().toISOString()
    const record = {
      $type: 'app.bsky.feed.post',
      text,
      createdAt,
      facets: buildFacets(text),
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri: canonicalUrl,
          title: post.frontmatter.title,
          description: post.frontmatter.summary,
        },
      },
    }

    const createRes = await httpRequest(
      `${PDS_HOST}/xrpc/com.atproto.repo.createRecord`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessJwt}`,
          'Content-Type': 'application/json',
        },
        body: {
          repo: session.did,
          collection: 'app.bsky.feed.post',
          record,
        },
      },
    )
    if (createRes.status !== 200) {
      throw new Error(`Bluesky: createRecord failed: ${createRes.status} ${createRes.body}`)
    }
    const created = createRes.json() as { uri: string; cid: string }
    const postId = created.uri.split('/').pop() ?? created.uri
    const remoteUrl = `https://bsky.app/profile/${session.handle}/post/${postId}`

    return { remoteId: created.uri, remoteUrl }
  },
})

function truncateForBluesky(summary: string): string {
  const budget = MAX_CHARS
  if (summary.length <= budget) return summary
  const slice = summary.slice(0, budget - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${trimmed}…`
  // Note: the canonical URL is sent as an embed card, not in the text body.
  // Including it inline would double-count against the character limit.
}

/**
 * Build very simple facet records for URL mentions and links. We don't
 * try to detect hashtags or mentions here — the embed card carries the
 * article URL, which is the important thing.
 */
function buildFacets(text: string): Array<{ index: { byteStart: number; byteEnd: number }; features: Array<{ $type: string }> }> {
  // For simplicity we return no facets. Bluesky will still render the
  // text correctly; only auto-linking is missed. Add detection here if
  // you want to surface @mentions or #tags.
  void text
  return []
}
