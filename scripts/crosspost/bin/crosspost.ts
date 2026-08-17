#!/usr/bin/env -S npx tsx
/**
 * Crosspost CLI.
 *
 * Usage:
 *   tsx bin/crosspost.ts list
 *   tsx bin/crosspost.ts post [--count N] [--slug <slug>] [--platforms a,b,c] [--force] [--drafts] [--dry-run]
 *   tsx bin/crosspost.ts auth twitter   # one-time OAuth 2.0 PKCE setup
 *
 * In GitHub Actions, the workflow sets all the required env vars and
 * invokes `tsx bin/crosspost.ts post --count N` (or implicit count=1).
 */

import { dispatch, listPosts, summarizeReport } from '../src/index.js'
import { loadConfig, resolveTargetPlatforms } from '../src/config.js'
import { performTwitterOAuth } from '../src/auth/twitter.js'

interface ParsedArgs {
  command: string
  positional: string[]
  flags: Record<string, string | boolean>
}

function parseArgs(argv: readonly string[]): ParsedArgs {
  const [, , cmd = 'help', ...rest] = argv
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i] ?? ''
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = rest[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(arg)
    }
  }
  return { command: cmd, positional, flags }
}

function help(): void {
  console.log(`crosspost — publish blog posts to multiple platforms

Commands:
  list                          List the most recent posts available
  post [options]                Publish posts
  auth twitter                  One-time OAuth 2.0 setup for X (Twitter)

Post options:
  --count N                     Number of recent posts to publish (default 1)
  --slug <slug>                 Publish a specific post by slug
  --platforms a,b,c             Restrict to comma-separated platforms
  --force                       Re-publish even if state says already posted
  --drafts                      Include draft posts in the candidate list
  --dry-run                     Log API calls but do not POST

Environment variables (see README.md for full list):
  SITE_URL, CROSSPOST_CONTENT_DIR, CROSSPOST_STATE_FILE, DRY_RUN
  DEVTO_API_KEY
  MASTODON_INSTANCE, MASTODON_TOKEN
  BLUESKY_IDENTIFIER, BLUESKY_APP_PASSWORD
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID
  LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN
  TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_REFRESH_TOKEN
`)
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv)
  const config = loadConfig()

  switch (args.command) {
    case 'help':
    case '--help':
    case '-h':
      help()
      return

    case 'list': {
      const posts = await listPosts(config)
      const limit = typeof args.flags.count === 'string' ? Number(args.flags.count) : 10
      const top = posts.slice(0, limit)
      console.log(`Found ${top.length} posts (of ${posts.length} total):`)
      for (const p of top) {
        const draft = p.frontmatter.draft ? ' [DRAFT]' : ''
        console.log(`  - ${p.slug}${draft}  ${p.frontmatter.date.toISOString().slice(0, 10)}  ${p.frontmatter.title}`)
      }
      return
    }

    case 'post': {
      const count = typeof args.flags.count === 'string' ? Number(args.flags.count) : 1
      const slug = typeof args.flags.slug === 'string' ? args.flags.slug : undefined
      const platforms = resolveTargetPlatforms(
        config,
        typeof args.flags.platforms === 'string' ? args.flags.platforms : undefined,
      )
      const force = args.flags.force === true
      const includeDrafts = args.flags.drafts === true

      const report = await dispatch(config, {
        count,
        slug,
        platforms,
        force,
        includeDrafts,
      })
      console.log(summarizeReport(report))
      if (report.summary.totalFailed > 0) {
        process.exitCode = 1
      }
      return
    }

    case 'auth': {
      const platform = args.positional[0]
      if (platform === 'twitter') {
        const result = await performTwitterOAuth()
        console.log('\nAdd these as GitHub Secrets:')
        console.log(`  TWITTER_CLIENT_ID=${result.clientId}`)
        console.log(`  TWITTER_REFRESH_TOKEN=${result.refreshToken}`)
        if (result.clientSecret) {
          console.log(`  TWITTER_CLIENT_SECRET=${result.clientSecret}`)
        }
        return
      }
      console.error(`Unknown auth target: ${platform}. Supported: twitter`)
      process.exitCode = 1
      return
    }

    default:
      help()
      process.exitCode = 1
      return
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
