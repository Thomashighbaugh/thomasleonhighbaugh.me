/**
 * Main dispatcher.
 *
 * Given a config + selection criteria, fans out to each platform's client
 * and records results in the persistent state. Failures for one platform
 * do not abort the run — they're logged and the dispatcher continues.
 */

import { findCoverImage, loadAllPosts, selectPosts } from './frontmatter.js'
import { render } from './renderer.js'
import { loadState, markPosted, saveState, shouldPost } from './state.js'
import { instantiate } from './platforms/index.js'
import type { Platform } from './config.js'
import type { BlogPost } from './frontmatter.js'
import type { CrosspostConfig } from './config.js'
import type { PostState } from './state.js'

export interface DispatchOptions {
  /** Number of posts to publish (ignored when `slug` is set). */
  count: number
  /** If set, publish only this specific post. */
  slug?: string
  /** Override the platform list from the env. */
  platforms?: Platform[]
  /** Republish even if the state file shows it's already posted. */
  force: boolean
  /** Include drafts in the candidate list. */
  includeDrafts: boolean
}

export interface DispatchReport {
  posts: Array<{
    slug: string
    title: string
    platforms: Platform[]
    results: Array<{
      platform: Platform
      status: 'success' | 'failed' | 'skipped'
      remoteId?: string
      remoteUrl?: string
      error?: string
    }>
  }>
  summary: {
    totalPosts: number
    totalSuccessful: number
    totalFailed: number
    totalSkipped: number
  }
}

export async function dispatch(
  config: CrosspostConfig,
  options: DispatchOptions,
): Promise<DispatchReport> {
  const platforms = options.platforms ?? (Object.keys(config.platforms) as Platform[])
  if (platforms.length === 0) {
    console.warn('No platforms enabled — nothing to do.')
    return emptyReport()
  }

  const allPosts = await loadAllPosts(config.contentDir)
  const posts = selectPosts(allPosts, {
    count: options.count,
    slug: options.slug,
    includeDrafts: options.includeDrafts,
  })

  if (posts.length === 0) {
    console.warn('No posts matched the selection criteria.')
    return emptyReport()
  }

  let state = await loadState(config.stateFile)
  const report: DispatchReport = {
    posts: [],
    summary: { totalPosts: posts.length, totalSuccessful: 0, totalFailed: 0, totalSkipped: 0 },
  }

  for (const post of posts) {
    const rendered = render(post, config.siteUrl)
    const coverImage = await findCoverImage(config.contentDir, post.slug)
    const coverImageUrl = coverImage ? `${config.siteUrl}/blog/${post.slug}/${coverImage}` : null

    const postEntry: DispatchReport['posts'][number] = {
      slug: post.slug,
      title: post.frontmatter.title,
      platforms: [],
      results: [],
    }

    for (const platform of platforms) {
      const platformConfig = config.platforms[platform]
      if (!platformConfig) {
        postEntry.results.push({ platform, status: 'skipped', error: 'platform not configured' })
        report.summary.totalSkipped++
        continue
      }

      if (!shouldPost(state, post.slug, platform, options.force)) {
        postEntry.results.push({ platform, status: 'skipped', error: 'already posted' })
        report.summary.totalSkipped++
        continue
      }

      const client = instantiate(platform, platformConfig)
      try {
        const result = await client.publish(post, rendered, {
          config: platformConfig,
          siteUrl: config.siteUrl,
          dryRun: config.dryRun,
          coverImageUrl,
        })
        state = markPosted(state, post.slug, platform, result.remoteId)
        postEntry.platforms.push(platform)
        postEntry.results.push({
          platform,
          status: 'success',
          remoteId: result.remoteId,
          remoteUrl: result.remoteUrl,
        })
        report.summary.totalSuccessful++
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        postEntry.results.push({ platform, status: 'failed', error: message })
        report.summary.totalFailed++
        console.error(`[${platform}] ${post.slug}: ${message}`)
      }
    }

    report.posts.push(postEntry)
  }

  // Persist state unless we're in dry-run mode.
  if (!config.dryRun) {
    await saveState(config.stateFile, state)
  }

  return report
}

function emptyReport(): DispatchReport {
  return {
    posts: [],
    summary: { totalPosts: 0, totalSuccessful: 0, totalFailed: 0, totalSkipped: 0 },
  }
}

export async function listPosts(config: CrosspostConfig): Promise<BlogPost[]> {
  return loadAllPosts(config.contentDir)
}

export function summarizeReport(report: DispatchReport): string {
  const lines: string[] = []
  lines.push(`Posts: ${report.summary.totalPosts}`)
  lines.push(`Successful: ${report.summary.totalSuccessful}`)
  lines.push(`Failed: ${report.summary.totalFailed}`)
  lines.push(`Skipped: ${report.summary.totalSkipped}`)
  for (const post of report.posts) {
    lines.push(`  - ${post.slug}: ${post.title}`)
    for (const r of post.results) {
      const url = r.remoteUrl ? ` → ${r.remoteUrl}` : ''
      const err = r.error ? ` (${r.error})` : ''
      lines.push(`      [${r.status}] ${r.platform}${url}${err}`)
    }
  }
  return lines.join('\n')
}

export type { PostState }
