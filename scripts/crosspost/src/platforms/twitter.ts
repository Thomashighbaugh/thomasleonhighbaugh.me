/**
 * X (Twitter) crosspost client.
 *
 * Uses OAuth 2.0 with PKCE — user-context authentication. This is the
 * FREE flow for posting on your own behalf. (The $100/mo Basic API tier is
 * only required for app-context posting at higher rates.)
 *
 * Flow:
 *   1. One-time local login: open the auth URL, paste the redirect code,
 *      exchange for access_token + refresh_token, store as GitHub Secrets.
 *   2. Each workflow run: refresh_token → access_token, POST to
 *      https://api.twitter.com/2/tweets.
 *
 * Required credentials:
 *   TWITTER_CLIENT_ID      — OAuth 2.0 client id from the X Developer Portal
 *   TWITTER_CLIENT_SECRET  — (optional, only if app is confidential)
 *   TWITTER_REFRESH_TOKEN  — long-lived refresh token
 *
 * Limitations:
 *   - Free tier is ~17 posts per 24h per user
 *   - 280 chars per post (4,000 for Premium)
 *   - We send a short excerpt + link card (the X card crawler will
 *     fetch the OG tags from the canonical URL)
 */

// ---------------------------------------------------------------------------
// Inline minimal OAuth helpers. We deliberately avoid depending on a heavy
// OAuth library for ~50 lines of PKCE / refresh-token handling.
// ---------------------------------------------------------------------------

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

const TOKEN_URL = 'https://api.x.com/2/oauth2/token'
const TWEETS_URL = 'https://api.twitter.com/2/tweets'
const MAX_CHARS = 270 // leave a small buffer under the 280 char limit

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
}

export const twitterFactory = (): PlatformClient => ({
  id: 'twitter',
  displayName: 'X (Twitter)',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const clientId = ctx.config.credentials.clientId
    const clientSecret = ctx.config.credentials.clientSecret
    const refreshToken = ctx.config.credentials.refreshToken
    if (!clientId || !refreshToken) {
      throw new Error('Twitter: TWITTER_CLIENT_ID and TWITTER_REFRESH_TOKEN are required')
    }

    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`
    const text = truncateForTwitter(post, canonicalUrl)

    if (ctx.dryRun) {
      console.log('[dry-run] twitter', { text })
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    const accessToken = await refreshAccessToken(clientId, clientSecret, refreshToken)

    const res = await httpRequest(TWEETS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: { text },
    })

    if (res.status !== 201) {
      throw new Error(`Twitter: POST /2/tweets failed: ${res.status} ${res.body}`)
    }

    const data = res.json() as { data?: { id: string; text: string } } | null
    const tweetId = data?.data?.id
    if (!tweetId) throw new Error(`Twitter: response missing data.id: ${res.body}`)

    // We don't know the handle without an extra /users/me call; the
    // tweet URL is sufficient for the operator to find it.
    return {
      remoteId: tweetId,
      remoteUrl: `https://x.com/i/status/${tweetId}`,
    }
  },
})

async function refreshAccessToken(
  clientId: string,
  clientSecret: string | undefined,
  refreshToken: string,
): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  })
  if (clientSecret) body.set('client_secret', clientSecret)

  const res = await httpRequest(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Confidential clients (with a secret) require basic auth.
      ...(clientSecret
        ? { 'Authorization': `Basic ${base64(`${clientId}:${clientSecret}`)}` }
        : {}),
    },
    body: body.toString(),
  })

  if (res.status !== 200) {
    throw new Error(`Twitter: token refresh failed: ${res.status} ${res.body}`)
  }
  const token = res.json() as TokenResponse
  if (!token.access_token) {
    throw new Error(`Twitter: token refresh response missing access_token: ${res.body}`)
  }
  return token.access_token
}

function base64(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64')
}

function truncateForTwitter(post: BlogPost, canonicalUrl: string): string {
  const header = `${post.frontmatter.title}\n\n`
  const footer = `\n\n${canonicalUrl}`
  const budget = MAX_CHARS - header.length - footer.length
  if (post.frontmatter.summary.length <= budget) {
    return `${header}${post.frontmatter.summary}${footer}`
  }
  const slice = post.frontmatter.summary.slice(0, budget - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${header}${trimmed}…${footer}`
}
