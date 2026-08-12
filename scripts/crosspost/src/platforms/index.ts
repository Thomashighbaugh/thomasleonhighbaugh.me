/**
 * Platform registry. Maps each platform id to its factory.
 */

import type { Platform, PlatformConfig } from '../config.js'
import type { PlatformClient, PlatformFactory } from './types.js'
import { devtoFactory } from './devto.js'
import { hashnodeFactory } from './hashnode.js'
import { mastodonFactory } from './mastodon.js'
import { blueskyFactory } from './bluesky.js'
import { telegramFactory } from './telegram.js'
import { linkedinFactory } from './linkedin.js'
import { twitterFactory } from './twitter.js'

const FACTORIES: Record<Platform, PlatformFactory> = {
  devto: devtoFactory,
  hashnode: hashnodeFactory,
  mastodon: mastodonFactory,
  bluesky: blueskyFactory,
  telegram: telegramFactory,
  linkedin: linkedinFactory,
  twitter: twitterFactory,
}

export function instantiate(
  platform: Platform,
  config: PlatformConfig,
): PlatformClient {
  return FACTORIES[platform](config)
}

export function listFactories(): Platform[] {
  return Object.keys(FACTORIES) as Platform[]
}

export type { PlatformClient, PlatformFactory, PublishContext, PublishResult } from './types.js'
