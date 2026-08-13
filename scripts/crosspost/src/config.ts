/**
 * Centralized configuration loader.
 *
 * All credentials are read from environment variables. In GitHub Actions
 * these come from `secrets.*`. For local development, copy `.env.example`
 * to `.env` and fill in the values.
 *
 * The `Platform` union enumerates every supported crosspost target. Each
 * platform reads its own secret prefix (e.g. `DEVTO_API_KEY`) and exposes
 * a single helper to check whether it is enabled.
 */

export type Platform =
  | 'devto'
  | 'hashnode'
  | 'mastodon'
  | 'bluesky'
  | 'telegram'
  | 'linkedin'
  | 'twitter'

export const ALL_PLATFORMS: readonly Platform[] = [
  'devto',
  'hashnode',
  'mastodon',
  'bluesky',
  'telegram',
  'linkedin',
  'twitter',
] as const

export interface CrosspostConfig {
  /** Canonical site origin, used to build absolute URLs for posts. */
  siteUrl: string
  /** Absolute path to the blog content directory (defaults to src/content/blog at repo root). */
  contentDir: string
  /** Where the dedup state file lives. */
  stateFile: string
  /** When true, log every API call but do not actually POST. */
  dryRun: boolean
  /** Resolved per-platform credentials. Missing platforms are disabled. */
  platforms: Partial<Record<Platform, PlatformConfig>>
}

export interface PlatformConfig {
  /** Free-form credentials bag — each platform client reads what it needs. */
  credentials: Record<string, string | undefined>
}

/**
 * Read the env into a strongly-typed config. Missing platforms are simply
 * absent from the returned `platforms` map; the dispatcher iterates only
 * the keys that exist.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): CrosspostConfig {
  const siteUrl = (env.SITE_URL ?? 'https://thomasleonhighbaugh.me').replace(/\/$/, '')
  const contentDir = env.CROSSPOST_CONTENT_DIR ?? 'src/content/blog'
  const stateFile = env.CROSSPOST_STATE_FILE ?? '.crosspost-state.json'
  const dryRun = (env.DRY_RUN ?? 'false').toLowerCase() === 'true'

  const platforms: Partial<Record<Platform, PlatformConfig>> = {}

  // dev.to — single API key
  if (env.DEVTO_API_KEY) {
    platforms.devto = { credentials: { apiKey: env.DEVTO_API_KEY } }
  }

  // Hashnode — Personal Access Token + Publication id (for the story API)
  if (env.HASHNODE_TOKEN && env.HASHNODE_PUBLICATION_ID) {
    platforms.hashnode = {
      credentials: {
        token: env.HASHNODE_TOKEN,
        publicationId: env.HASHNODE_PUBLICATION_ID,
      },
    }
  }

  // Mastodon — instance URL + access token
  if (env.MASTODON_INSTANCE && env.MASTODON_TOKEN) {
    platforms.mastodon = {
      credentials: {
        instance: env.MASTODON_INSTANCE.replace(/\/$/, ''),
        token: env.MASTODON_TOKEN,
      },
    }
  }

  // Bluesky — identifier (handle or email) + app password
  if (env.BLUESKY_IDENTIFIER && env.BLUESKY_APP_PASSWORD) {
    platforms.bluesky = {
      credentials: {
        identifier: env.BLUESKY_IDENTIFIER,
        appPassword: env.BLUESKY_APP_PASSWORD,
      },
    }
  }

  // Telegram — bot token + channel chat id
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHANNEL_ID) {
    platforms.telegram = {
      credentials: {
        botToken: env.TELEGRAM_BOT_TOKEN,
        channelId: env.TELEGRAM_CHANNEL_ID,
      },
    }
  }

  // LinkedIn — OAuth2 access token + member ID
  if (env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_MEMBER_ID) {
    platforms.linkedin = {
      credentials: {
        accessToken: env.LINKEDIN_ACCESS_TOKEN,
        memberId: env.LINKEDIN_MEMBER_ID,
      },
    }
  }

  // X / Twitter — OAuth2 PKCE user-context refresh token + client credentials
  if (env.TWITTER_CLIENT_ID && env.TWITTER_REFRESH_TOKEN) {
    platforms.twitter = {
      credentials: {
        clientId: env.TWITTER_CLIENT_ID,
        clientSecret: env.TWITTER_CLIENT_SECRET,
        refreshToken: env.TWITTER_REFRESH_TOKEN,
      },
    }
  }

  return { siteUrl, contentDir, stateFile, dryRun, platforms }
}

/**
 * Returns the subset of platforms the user explicitly requested via the
 * `PLATFORMS` env var (comma-separated). If unset, returns all enabled
 * platforms. Used by the dispatcher to filter the target list.
 */
export function resolveTargetPlatforms(
  config: CrosspostConfig,
  requested: string | undefined,
): Platform[] {
  const enabled = Object.keys(config.platforms) as Platform[]
  if (!requested) return enabled
  const wanted = requested
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is Platform => (ALL_PLATFORMS as readonly string[]).includes(s))
  return wanted.filter((p) => enabled.includes(p))
}
