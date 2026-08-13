/**
 * LinkedIn crosspost client.
 *
 * Updated: Now accepts simple numeric Member ID to construct the URN.
 *
 * Required credentials:
 *   LINKEDIN_ACCESS_TOKEN  — OAuth2 access token with `w_member_social` scope
 *   LINKEDIN_MEMBER_ID     — The numeric ID from your profile URL
 */

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

const LINKEDIN_API = 'https://api.linkedin.com/v2'

export const linkedinFactory = (): PlatformClient => ({
  id: 'linkedin',
  displayName: 'LinkedIn',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const accessToken = ctx.config.credentials.accessToken
    const memberId = ctx.config.credentials.memberId
    if (!accessToken || !memberId) {
      throw new Error('LinkedIn: LINKEDIN_ACCESS_TOKEN and LINKEDIN_MEMBER_ID are required')
    }

    // Construct the URN automatically
    const authorUrn = `urn:li:person:${memberId}`
    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`
    const text = truncateForLinkedIn(post, canonicalUrl)

    const payload = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              originalUrl: canonicalUrl,
              title: { text: post.frontmatter.title },
              description: { text: post.frontmatter.summary },
            },
          ],
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }

    if (ctx.dryRun) {
      // eslint-disable-next-line no-console
      console.log('[dry-run] linkedin', JSON.stringify(payload, null, 2))
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    const res = await httpRequest(`${LINKEDIN_API}/ugcPosts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: payload,
    })

    if (res.status !== 201) {
      throw new Error(`LinkedIn: ugcPosts failed: ${res.status} ${res.body}`)
    }
    const id = (res.headers['x-restli-id'] as string | undefined) ?? res.body
    const remoteUrl = `https://www.linkedin.com/feed/update/${encodeURIComponent(id)}`

    return { remoteId: id, remoteUrl }
  },
})

function truncateForLinkedIn(post: BlogPost, canonicalUrl: string): string {
  const header = `${post.frontmatter.title}\n\n`
  const summary = post.frontmatter.summary
  const footer = `\n\nRead more: ${canonicalUrl}`
  const budget = 1300 - header.length - footer.length
  if (summary.length <= budget) return `${header}${summary}${footer}`
  const slice = summary.slice(0, budget - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${header}${trimmed}…${footer}`
}
