/**
 * Hashnode crosspost client.
 *
 * Hashnode uses GraphQL. The publish mutation is `publishPost` (for
 * publishing to a publication) or `createDraft` (for drafting first).
 * We publish directly. The schema is documented at:
 *   https://apidocs.hashnode.com/
 *
 * Required credentials:
 *   HASHNODE_TOKEN         — Personal Access Token (legacy API key works too)
 *   HASHNODE_PUBLICATION_ID — The id of the publication to post under
 */

import type { PlatformClient, PublishContext, PublishResult } from './types.js'
import { httpRequest } from './types.js'
import type { BlogPost } from '../frontmatter.js'
import type { RenderResult } from '../renderer.js'

const HASHNODE_API = 'https://gql-beta.hashnode.com'

const PUBLISH_MUTATION = /* GraphQL */ `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        slug
        url
      }
    }
  }
`

export const hashnodeFactory = (): PlatformClient => ({
  id: 'hashnode',
  displayName: 'Hashnode',

  async publish(post: BlogPost, rendered: RenderResult, ctx: PublishContext): Promise<PublishResult> {
    const token = ctx.config.credentials.token
    const publicationId = ctx.config.credentials.publicationId
    if (!token || !publicationId) {
      throw new Error('Hashnode: HASHNODE_TOKEN and HASHNODE_PUBLICATION_ID are required')
    }

    const canonicalUrl = `${ctx.siteUrl}/blog/${post.slug}/`

    const payload = {
      query: PUBLISH_MUTATION,
      variables: {
        input: {
          publicationId,
          title: post.frontmatter.title,
          contentMarkdown: wrapWithFooter(rendered.markdown, canonicalUrl),
          tags: post.frontmatter.tags.slice(0, 5).map((name) => ({ name, slug: slugify(name) })),
          canonicalUrl,
          coverImageOptions: ctx.coverImageUrl
            ? { coverImageURL: `${ctx.siteUrl}/blog/${post.slug}/${ctx.coverImageUrl}` }
            : undefined,
          // Publish immediately rather than draft.
          // Setting publishedAt is also acceptable.
        },
      },
    }

    if (ctx.dryRun) {
      console.log('[dry-run] hashnode', JSON.stringify(payload, null, 2))
      return { remoteId: 'dry-run', remoteUrl: canonicalUrl }
    }

    const res = await httpRequest(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    if (res.status !== 200) {
      throw new Error(`Hashnode: publishPost failed: ${res.status} ${res.body}`)
    }

    const json = res.json() as {
      data?: { publishPost?: { post?: { id: string; url: string } } }
      errors?: Array<{ message: string }>
    } | null

    if (json?.errors?.length) {
      throw new Error(`Hashnode: ${json.errors.map((e) => e.message).join('; ')}`)
    }
    const postResult = json?.data?.publishPost?.post
    if (!postResult?.id) throw new Error(`Hashnode: response missing post.id: ${res.body}`)

    return { remoteId: postResult.id, remoteUrl: postResult.url }
  },
})

function wrapWithFooter(markdown: string, canonicalUrl: string): string {
  return `${markdown}\n\n---\n\nOriginally published at [${canonicalUrl}](${canonicalUrl}).`
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
