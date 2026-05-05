import { describe, it, expect } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import ArrowCard from '@components/ArrowCard'
import { createMockBlogPost, createMockProject } from '@test/fixtures/content'

describe('ArrowCard', () => {
  it('renders the title from entry.data', () => {
    const post = createMockBlogPost({ title: 'My Amazing Post' })
    render(() => <ArrowCard entry={post as any} />)
    expect(screen.getByText('My Amazing Post')).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    // Use getByText with a function matcher to handle timezone shifts
    const post = createMockBlogPost({ date: new Date('2026-05-04T12:00:00') })
    render(() => <ArrowCard entry={post as any} />)
    // The format depends on timezone; just verify the date renders
    expect(screen.getByText((content) => content.includes('May'))).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('2026'))).toBeInTheDocument()
  })

  it('renders the summary text', () => {
    const post = createMockBlogPost({ summary: 'A test summary.' })
    render(() => <ArrowCard entry={post as any} />)
    expect(screen.getByText('A test summary.')).toBeInTheDocument()
  })

  it('renders tags as list items', () => {
    const post = createMockBlogPost({ tags: ['astro', 'testing'] })
    render(() => <ArrowCard entry={post as any} />)
    expect(screen.getByText('astro')).toBeInTheDocument()
    expect(screen.getByText('testing')).toBeInTheDocument()
  })

  it('renders pill badge with "post" for blog entries', () => {
    const post = createMockBlogPost()
    render(() => <ArrowCard entry={post as any} pill={true} />)
    expect(screen.getByText('post')).toBeInTheDocument()
  })

  it('renders pill badge with "project" for project entries', () => {
    const project = createMockProject()
    render(() => <ArrowCard entry={project as any} pill={true} />)
    expect(screen.getByText('project')).toBeInTheDocument()
  })

  it('does not render pill badge when pill is false', () => {
    const post = createMockBlogPost()
    render(() => <ArrowCard entry={post as any} pill={false} />)
    expect(screen.queryByText('post')).not.toBeInTheDocument()
    expect(screen.queryByText('project')).not.toBeInTheDocument()
  })

  it('has an anchor linking to the correct collection + slug path', () => {
    const post = createMockBlogPost({ slug: 'my-post-slug', id: 'my-post-slug' })
    render(() => <ArrowCard entry={post as any} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/my-post-slug')
  })

  it('links to /projects/ for project entries', () => {
    const project = createMockProject({ slug: 'my-project', id: 'my-project' })
    render(() => <ArrowCard entry={project as any} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/projects/my-project')
  })
})
