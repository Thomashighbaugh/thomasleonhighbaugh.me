/**
 * Persistent dedup state.
 *
 * After a post is successfully crossposted to a platform, we record the
 * resulting remote id (e.g. the dev.to article id, the tweet id, etc.) in
 * `.crosspost-state.json` at the repo root. The workflow commits this file
 * back to the repo on success so subsequent runs can skip already-posted
 * content.
 *
 * The file is intentionally tiny and human-readable — it's safe to edit
 * by hand if you want to force a re-post.
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import type { Platform } from './config.js'

export interface PostState {
  /** Slug of the source post. */
  slug: string
  /** Map of platform → remote id returned by the platform. */
  posted: Partial<Record<Platform, string>>
  /** ISO timestamp of the last successful post. */
  lastPostedAt: string
}

export type CrosspostState = Record<string, PostState>

export function emptyState(): CrosspostState {
  return {}
}

export async function loadState(path: string): Promise<CrosspostState> {
  if (!existsSync(path)) return emptyState()
  try {
    const raw = await readFile(path, 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as CrosspostState
    return emptyState()
  } catch {
    // Corrupt state file — start fresh but don't fail the whole run.
    return emptyState()
  }
}

export async function saveState(path: string, state: CrosspostState): Promise<void> {
  const serialized = JSON.stringify(state, null, 2) + '\n'
  await writeFile(path, serialized, 'utf8')
}

/**
 * Mark a post as posted to a platform. If the post entry doesn't exist,
 * it is created. If the platform entry already exists, it is overwritten
 * (useful for retries on the same platform).
 */
export function markPosted(
  state: CrosspostState,
  slug: string,
  platform: Platform,
  remoteId: string,
): CrosspostState {
  const existing = state[slug] ?? { slug, posted: {}, lastPostedAt: '' }
  const next: PostState = {
    slug,
    posted: { ...existing.posted, [platform]: remoteId },
    lastPostedAt: new Date().toISOString(),
  }
  return { ...state, [slug]: next }
}

/**
 * Should we attempt to post this post to this platform?
 * Returns false if the state file already records a successful post.
 */
export function shouldPost(
  state: CrosspostState,
  slug: string,
  platform: Platform,
  force: boolean,
): boolean {
  if (force) return true
  return !state[slug]?.posted?.[platform]
}
