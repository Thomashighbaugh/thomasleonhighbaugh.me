/**
 * Telegram crosspost client.
 *
 * Uses the Telegram Bot API. The bot must be an admin of the target
 * channel (or supergroup). Send a message with `disable_web_page_preview`
 * toggled off so Telegram auto-fetches the OG image and renders a link
 * preview card.
 *
 * Required credentials:
 *   TELEGRAM_BOT_TOKEN   — Bot token from @BotFather
 *   TELEGRAM_CHANNEL_ID  — @channelname or numeric chat id
 */

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

export const telegramFactory = (): PlatformClient => ({
  id: 'telegram',
  displayName: 'Telegram',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const botToken = ctx.config.credentials.botToken
    const channelId = ctx.config.credentials.channelId
    if (!botToken || !channelId) {
      throw new Error('Telegram: TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are required')
    }

    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`
    const text = formatTelegramMessage(post, canonicalUrl)

    if (ctx.dryRun) {
      // eslint-disable-next-line no-console
      console.log('[dry-run] telegram', { text })
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const res = await httpRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        chat_id: channelId,
        text,
        // HTML parse mode lets us render the link, italic title, and
        // tags nicely without needing Markdown escaping.
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      },
    })

    if (res.status !== 200) {
      throw new Error(`Telegram: sendMessage failed: ${res.status} ${res.body}`)
    }
    const data = res.json() as { ok: boolean; result?: { message_id: number } } | null
    if (!data?.ok || !data.result?.message_id) {
      throw new Error(`Telegram: response not ok: ${res.body}`)
    }

    return {
      remoteId: String(data.result.message_id),
      remoteUrl: canonicalUrl,
    }
  },
})

function formatTelegramMessage(post: BlogPost, canonicalUrl: string): string {
  const title = escapeHtml(post.frontmatter.title)
  const summary = escapeHtml(post.frontmatter.summary)
  const tags = post.frontmatter.tags
    .slice(0, 5)
    .map((t) => `#${escapeHtml(t.replace(/\s+/g, '_'))}`)
    .join(' ')

  return `<b>${title}</b>\n\n${summary}\n\n${tags}\n\nRead more: ${canonicalUrl}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
