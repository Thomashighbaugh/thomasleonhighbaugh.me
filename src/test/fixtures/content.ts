/**
 * Mock content collection entries for testing.
 * These match the blog/project schemas defined in src/content/config.ts
 */

export function createMockBlogPost(overrides: Partial<{
  id: string
  collection: 'blog'
  title: string
  summary: string
  date: Date
  tags: string[]
  draft: boolean
}> = {}) {
  const defaults = {
    id: 'test-post',
    slug: 'test-post',
    collection: 'blog' as const,
    title: 'Test Blog Post',
    summary: 'A test summary for the blog post.',
    date: new Date('2026-05-04T12:00:00'),
    tags: ['testing', 'astro', 'typescript'],
    draft: false,
  }
  const merged = { ...defaults, ...overrides }
  return {
    id: merged.id,
    slug: merged.slug,
    collection: merged.collection,
    data: {
      title: merged.title,
      summary: merged.summary,
      date: merged.date,
      tags: merged.tags,
      draft: merged.draft,
    },
  }
}

export function createMockProject(overrides: Partial<{
  id: string
  collection: 'projects'
  title: string
  summary: string
  date: Date
  tags: string[]
  draft: boolean
  demoUrl: string
  repoUrl: string
}> = {}) {
  const defaults = {
    id: 'test-project',
    slug: 'test-project',
    collection: 'projects' as const,
    title: 'Test Project',
    summary: 'A test summary for the project.',
    date: new Date('2026-05-04T12:00:00'),
    tags: ['testing', 'astro'],
    draft: false,
    demoUrl: 'https://demo.example.com',
    repoUrl: 'https://github.com/example/test',
  }
  const merged = { ...defaults, ...overrides }
  return {
    id: merged.id,
    slug: merged.slug,
    collection: merged.collection,
    data: {
      title: merged.title,
      summary: merged.summary,
      date: merged.date,
      tags: merged.tags,
      draft: merged.draft,
      demoUrl: merged.demoUrl,
      repoUrl: merged.repoUrl,
    },
  }
}
