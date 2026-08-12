/**
 * Common platform interface and a tiny HTTP helper.
 *
 * Each platform implements `publish(post, renderResult, config)`. The
 * dispatcher handles logging, dedup, and dry-run. Platforms do only the
 * platform-specific work: build the payload, POST it, return the remote id.
 */

import { request } from 'undici'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'
import type { PlatformConfig } from '../config.js'

export interface PublishContext {
  /** Resolved platform credentials. */
  config: PlatformConfig
  /** Canonical site URL (e.g. https://thomasleonhighbaugh.me). */
  siteUrl: string
  /** True if the caller wants to log API calls without actually POSTing. */
  dryRun: boolean
  /** URL of the post's leading image, if any (used for OG cards). */
  coverImageUrl: string | null
}

export interface PublishResult {
  /** The id returned by the platform (URL, numeric id, etc.). */
  remoteId: string
  /** Where the user can view the published post. */
  remoteUrl: string
}

export interface PlatformClient {
  /** Stable identifier used in state and the CLI. */
  readonly id: string
  /** Human-readable name for logs. */
  readonly displayName: string
  /** Publish a post to this platform. */
  publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult>
}

/**
 * A factory type — the platform index knows which factories exist, and
 * only the ones with credentials get instantiated.
 */
export type PlatformFactory = (config: PlatformConfig) => PlatformClient

/* ------------------------------------------------------------------------- */
/* HTTP helper                                                               */
/* ------------------------------------------------------------------------- */

export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string | object | undefined
  timeoutMs?: number
}

export interface HttpResponse {
  status: number
  headers: Record<string, string | string[] | undefined>
  body: string
  json(): unknown
}

/**
 * Minimal HTTP wrapper. We use undici directly (with Node's built-in
 * fetch fallback) so we don't add a heavyweight HTTP client. In dry-run
 * mode, the request is logged and never sent.
 */
export async function httpRequest(url: string, opts: HttpOptions = {}): Promise<HttpResponse> {
  const method = opts.method ?? 'GET'
  const init: RequestInit = {
    method,
    headers: opts.headers,
  }
  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)
  }

  const res = await fetch(url, init)
  const body = await res.text()
  const headers: Record<string, string | string[] | undefined> = {}
  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return {
    status: res.status,
    headers,
    body,
    json() {
      try {
        return JSON.parse(body)
      } catch {
        return null
      }
    },
  }
}

/**
 * Dry-run-aware HTTP wrapper that logs the request and returns a synthetic
 * 200 response. Use this for endpoints that POST but where the goal of
 * the dry-run is just to verify the payload shape.
 */
export function dryRunRequest(url: string, opts: HttpOptions, payload: unknown): HttpResponse {
  // eslint-disable-next-line no-console
  console.log('[dry-run]', opts.method ?? 'GET', url, JSON.stringify(payload, null, 2))
  return {
    status: 200,
    headers: {},
    body: JSON.stringify({ dryRun: true }),
    json() {
      return { dryRun: true }
    },
  }
}

// Re-export `request` so platform clients can use it for streaming
// uploads (e.g. Twitter media upload) without re-importing.
export { request }
