import { describe, it, expect, beforeEach } from 'vitest'
import {
  CrosspostState,
  emptyState,
  loadState,
  markPosted,
  saveState,
  shouldPost,
} from '../../src/state.js'
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('state', () => {
  let dir: string
  let file: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'crosspost-'))
    file = join(dir, 'state.json')
  })

  describe('loadState', () => {
    it('returns empty state when file does not exist', async () => {
      expect(await loadState(file)).toEqual({})
    })

    it('returns empty state when file is corrupt', async () => {
      await writeFile(file, 'not json', 'utf8')
      expect(await loadState(file)).toEqual({})
    })

    it('parses a valid state file', async () => {
      const data = { hello: { slug: 'hello', posted: { devto: '123' }, lastPostedAt: '2024-01-01' } }
      await writeFile(file, JSON.stringify(data), 'utf8')
      const loaded = await loadState(file)
      expect(loaded).toEqual(data)
    })
  })

  describe('saveState', () => {
    it('writes pretty JSON to disk', async () => {
      const state: CrosspostState = { hello: { slug: 'hello', posted: { devto: '1' }, lastPostedAt: 't' } }
      await saveState(file, state)
      const raw = await readFile(file, 'utf8')
      expect(raw).toContain('"devto": "1"')
    })
  })

  describe('markPosted', () => {
    it('creates a new entry for a fresh slug', () => {
      const next = markPosted(emptyState(), 'hello', 'devto', '123')
      expect(next.hello?.posted.devto).toBe('123')
      expect(next.hello?.lastPostedAt).toBeTruthy()
    })

    it('adds to existing entries without losing other platforms', () => {
      let state = emptyState()
      state = markPosted(state, 'hello', 'devto', '1')
      state = markPosted(state, 'hello', 'hashnode', '2')
      expect(state.hello?.posted).toEqual({ devto: '1', hashnode: '2' })
    })

    it('overwrites an existing platform entry', () => {
      let state = markPosted(emptyState(), 'hello', 'devto', '1')
      state = markPosted(state, 'hello', 'devto', '2')
      expect(state.hello?.posted.devto).toBe('2')
    })
  })

  describe('shouldPost', () => {
    it('returns true when the slug has never been posted', () => {
      expect(shouldPost(emptyState(), 'hello', 'devto', false)).toBe(true)
    })

    it('returns false when already posted to the platform', () => {
      const state = markPosted(emptyState(), 'hello', 'devto', '1')
      expect(shouldPost(state, 'hello', 'devto', false)).toBe(false)
    })

    it('returns true when force is set, even if already posted', () => {
      const state = markPosted(emptyState(), 'hello', 'devto', '1')
      expect(shouldPost(state, 'hello', 'devto', true)).toBe(true)
    })

    it('returns true on a different platform', () => {
      const state = markPosted(emptyState(), 'hello', 'devto', '1')
      expect(shouldPost(state, 'hello', 'hashnode', false)).toBe(true)
    })
  })

  // Cleanup
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })
})

function afterEach(fn: () => Promise<void>) {
  // Polyfill — vitest's `afterEach` isn't imported above for brevity.
  return (globalThis as Record<string, unknown>).afterEach = fn
}
