import { describe, it, expect } from 'vitest'
import { cn, formatDate, readingTime, truncateText } from '@lib/utils'

// ---------------------------------------------------------------------------
// cn()
// ---------------------------------------------------------------------------
describe('cn()', () => {
  it('returns a single class string unchanged', () => {
    expect(cn('px-4')).toBe('px-4')
  })

  it('filters out falsy values', () => {
    expect(cn('px-4', false && 'hidden', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('resolves conflicting Tailwind classes via twMerge', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })

  it('handles no arguments', () => {
    expect(cn()).toBe('')
  })
})

// ---------------------------------------------------------------------------
// formatDate()
// ---------------------------------------------------------------------------
describe('formatDate()', () => {
  it('formats a valid date as "MMM DD, YYYY"', () => {
    // Use noon time to avoid timezone shifts
    expect(formatDate(new Date('2026-05-04T12:00:00'))).toBe('May 04, 2026')
  })

  it('handles a December date correctly (year boundary)', () => {
    expect(formatDate(new Date('2025-12-31T12:00:00'))).toBe('Dec 31, 2025')
  })

  it('handles an early January date', () => {
    expect(formatDate(new Date('2026-01-01T12:00:00'))).toBe('Jan 01, 2026')
  })

  it('returns "Invalid Date" for an invalid date object', () => {
    const d = new Date('not-a-date')
    // Intl.DateTimeFormat throws a RangeError for invalid dates
    expect(() => formatDate(d)).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// readingTime()
// ---------------------------------------------------------------------------
describe('readingTime()', () => {
  it('returns "2 min read" for ~200 words of HTML', () => {
    const words = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ')
    const html = `<p>${words}</p>`
    expect(readingTime(html)).toBe('2 min read')
  })

  it('returns "1 min read" for empty HTML', () => {
    expect(readingTime('')).toBe('1 min read')
  })

  it('returns "1 min read" for HTML with only tags (no text)', () => {
    expect(readingTime('<div><p></p></div>')).toBe('1 min read')
  })

  it('returns "2 min read" for exactly 200 words of plain text', () => {
    const words = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ')
    expect(readingTime(words)).toBe('2 min read')
  })

  it('returns "3 min read" for ~400 words', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ')
    expect(readingTime(words)).toBe('3 min read')
  })
})

// ---------------------------------------------------------------------------
// truncateText()
// ---------------------------------------------------------------------------
describe('truncateText()', () => {
  it('returns the original string when shorter than maxLength', () => {
    expect(truncateText('short', 10)).toBe('short')
  })

  it('returns the original string when exactly at maxLength', () => {
    expect(truncateText('exactly', 7)).toBe('exactly')
  })

  it('truncates a longer string with ellipsis', () => {
    // "a long string that needs truncation" = 35 chars, maxLength 20
    // cutoff = 19, slice(0,19) = "a long string that" (18 chars + trailing space)
    // trimEnd → "a long string that" (18 chars) + "…" = 19 chars
    const result = truncateText('a long string that needs truncation', 20)
    expect(result).toBe('a long string that…')
    expect(result).toHaveLength(19)
  })

  it('truncates with ellipsis replacing the last character positions', () => {
    // "hello world this is a test" = 24 chars, maxLength 10
    // cutoff = 9, slice(0,9) = "hello wor" (9 chars) + "…" = 10 chars
    const result = truncateText('hello world this is a test', 10)
    expect(result).toBe('hello wor…')
    expect(result).toHaveLength(10)
  })

  it('handles maxLength = 1 (edge case)', () => {
    // cutoff = 0, slice(0,0) = '', '' + '…' = '…'
    expect(truncateText('hello', 1)).toBe('…')
  })

  it('handles maxLength = 0 (edge case)', () => {
    // cutoff = -1, slice(0,-1) = 'hell', 'hell' + '…' = 'hell…'
    expect(truncateText('hello', 0)).toBe('hell…')
  })
})
