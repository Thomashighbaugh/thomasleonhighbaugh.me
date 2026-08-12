/**
 * Blog post parsing.
 *
 * Each Astro blog post lives at `<contentDir>/<slug>/index.md`. The
 * frontmatter schema (see src/content/config.ts in the main project) is:
 *
 *   title: string
 *   summary: string
 *   description?: string  (some posts include this)
 *   date: string  (e.g. "Jul 20 2023")
 *   draft?: boolean
 *   tags?: string[]
 *
 * We use gray-matter for the YAML frontmatter, then read the rest of the
 * file as the post body.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

export interface BlogPost {
  /** URL slug (the directory name). */
  slug: string
  /** Absolute path to the post's index.md file. */
  filePath: string
  /** Frontmatter fields, normalized. */
  frontmatter: {
    title: string
    summary: string
    description?: string
    /** Parsed Date object. */
    date: Date
    draft: boolean
    tags: string[]
  }
  /** Raw markdown body (no frontmatter). */
  body: string
}

/**
 * Walk the content directory and return all blog posts, sorted newest-first.
 * Drafts are included so the operator can choose to publish them explicitly.
 */
export async function loadAllPosts(contentDir: string): Promise<BlogPost[]> {
  let entries: string[]
  try {
    entries = await readdir(contentDir)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }

  const posts: BlogPost[] = []
  for (const entry of entries) {
    const dirPath = join(contentDir, entry)
    const s = await stat(dirPath).catch(() => null)
    if (!s?.isDirectory()) continue

    const indexPath = join(dirPath, 'index.md')
    const raw = await readFile(indexPath, 'utf8').catch(() => null)
    if (raw === null) continue

    posts.push(parsePost(entry, indexPath, raw))
  }

  posts.sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
  return posts
}

function parsePost(slug: string, filePath: string, raw: string): BlogPost {
  const parsed = matter(raw)
  const data = parsed.data as Record<string, unknown>

  const title = String(data.title ?? slug)
  const summary = String(data.summary ?? '')
  const description = data.description ? String(data.description) : undefined
  const date = coerceDate(data.date) ?? new Date(0)
  const draft = Boolean(data.draft ?? false)
  const tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t)) : []

  return {
    slug,
    filePath,
    frontmatter: { title, summary, description, date, draft, tags },
    body: parsed.content.trim(),
  }
}

function coerceDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return null
}

/** Take the first N posts, optionally filtering to drafts/non-drafts only. */
export function selectPosts(
  posts: BlogPost[],
  options: { count: number; slug?: string; includeDrafts: boolean },
): BlogPost[] {
  const filtered = options.includeDrafts
    ? posts
    : posts.filter((p) => !p.frontmatter.draft)

  if (options.slug) {
    const exact = filtered.find((p) => p.slug === options.slug)
    return exact ? [exact] : []
  }

  return filtered.slice(0, Math.max(0, options.count))
}

/**
 * Pick the most likely cover image for a post. Posts ship images in their
 * own directory (see src/content/blog/claude-vs-chatgpt/index.md for an
 * example). We prefer a `.webp` or `.png` over `.jpg`, and prefer a file
 * named `banner.*`, `cover.*`, or `hero.*` if present.
 */
export async function findCoverImage(contentDir: string, slug: string): Promise<string | null> {
  const dir = join(contentDir, slug)
  let files: string[]
  try {
    files = await readdir(dir)
  } catch {
    return null
  }

  const candidates = files.filter((f) => /\.(webp|png|jpg|jpeg|gif)$/i.test(f))
  if (candidates.length === 0) return null

  const ranked = [...candidates].sort((a, b) => {
    const score = (name: string) => {
      const lower = name.toLowerCase()
      if (/^banner\./.test(lower)) return 0
      if (/^cover\./.test(lower)) return 1
      if (/^hero\./.test(lower)) return 2
      if (/\.webp$/.test(lower)) return 3
      if (/\.png$/.test(lower)) return 4
      return 5
    }
    return score(a) - score(b)
  })

  return ranked[0] ?? null
}
