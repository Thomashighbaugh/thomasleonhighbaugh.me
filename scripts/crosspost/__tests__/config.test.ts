import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { loadConfig, resolveTargetPlatforms } from '../src/config.js'

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url))

describe('loadConfig', () => {
  it('returns defaults when no env vars are set', () => {
    const config = loadConfig({})
    expect(config.siteUrl).toBe('https://thomasleonhighbaugh.me')
    expect(config.contentDir).toBe(join(repoRoot, 'src/content/blog'))
    expect(config.stateFile).toBe(join(repoRoot, '.crosspost-state.json'))
    expect(config.dryRun).toBe(false)
    expect(Object.keys(config.platforms)).toEqual([])
  })

  it('strips a trailing slash from the site URL', () => {
    const config = loadConfig({ SITE_URL: 'https://example.com/' })
    expect(config.siteUrl).toBe('https://example.com')
  })

  it('honors DRY_RUN', () => {
    expect(loadConfig({ DRY_RUN: 'true' }).dryRun).toBe(true)
    expect(loadConfig({ DRY_RUN: 'TRUE' }).dryRun).toBe(true)
    expect(loadConfig({ DRY_RUN: '1' }).dryRun).toBe(false)
  })

  it('enables dev.to when DEVTO_API_KEY is set', () => {
    const config = loadConfig({ DEVTO_API_KEY: 'abc' })
    expect(config.platforms.devto?.credentials.apiKey).toBe('abc')
  })

  it('enables Hashnode when both token and publication id are set', () => {
    const config = loadConfig({ HASHNODE_TOKEN: 'tok', HASHNODE_PUBLICATION_ID: 'pub' })
    expect(config.platforms.hashnode).toBeDefined()
  })

  it('does not enable Hashnode with only one credential', () => {
    const config = loadConfig({ HASHNODE_TOKEN: 'tok' })
    expect(config.platforms.hashnode).toBeUndefined()
  })

  it('enables Mastodon with instance and token', () => {
    const config = loadConfig({ MASTODON_INSTANCE: 'https://mastodon.social/', MASTODON_TOKEN: 'x' })
    expect(config.platforms.mastodon?.credentials.instance).toBe('https://mastodon.social')
  })

  it('enables Bluesky with identifier and app password', () => {
    const config = loadConfig({ BLUESKY_IDENTIFIER: 'me.bsky.social', BLUESKY_APP_PASSWORD: 'pwd' })
    expect(config.platforms.bluesky).toBeDefined()
  })

  it('enables Telegram with bot token and channel id', () => {
    const config = loadConfig({ TELEGRAM_BOT_TOKEN: 'bot', TELEGRAM_CHANNEL_ID: '@ch' })
    expect(config.platforms.telegram).toBeDefined()
  })

  it('enables LinkedIn with access token and author urn', () => {
    const config = loadConfig({ LINKEDIN_ACCESS_TOKEN: 't', LINKEDIN_AUTHOR_URN: 'urn:li:person:1' })
    expect(config.platforms.linkedin).toBeDefined()
  })

  it('enables Twitter with client id and refresh token', () => {
    const config = loadConfig({ TWITTER_CLIENT_ID: 'cid', TWITTER_REFRESH_TOKEN: 'rt' })
    expect(config.platforms.twitter).toBeDefined()
  })
})

describe('resolveTargetPlatforms', () => {
  const baseConfig = {
    siteUrl: 'https://example.com',
    contentDir: 'src/content/blog',
    stateFile: '.crosspost-state.json',
    dryRun: false,
    platforms: {
      devto: { credentials: {} },
      hashnode: { credentials: {} },
    } as Partial<Record<'devto' | 'hashnode' | 'mastodon', { credentials: Record<string, string | undefined> }>>,
  }

  it('returns all enabled platforms when no override is provided', () => {
    const targets = resolveTargetPlatforms(baseConfig as never, undefined)
    expect(targets.sort()).toEqual(['devto', 'hashnode'])
  })

  it('filters to the requested subset', () => {
    const targets = resolveTargetPlatforms(baseConfig as never, 'devto')
    expect(targets).toEqual(['devto'])
  })

  it('drops requested platforms that are not configured', () => {
    const targets = resolveTargetPlatforms(baseConfig as never, 'devto,mastodon')
    expect(targets).toEqual(['devto'])
  })

  it('drops unknown platform names', () => {
    const targets = resolveTargetPlatforms(baseConfig as never, 'devto,fakeplatform')
    expect(targets).toEqual(['devto'])
  })
})
