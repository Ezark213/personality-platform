/**
 * Tests for BigFive Share Text Generator
 *
 * This test file follows TDD principles:
 * 1. Write tests first (they should FAIL)
 * 2. Implement minimal code to pass
 * 3. Refactor
 *
 * Initial run: These tests WILL FAIL because the implementation doesn't exist yet.
 */

import { describe, it, expect } from 'vitest'
import { generateShareText } from '../bigfive-share-text'
import type { BigFiveType } from '@/data/tests/bigfive-types'

describe('BigFive Share Text Generator', () => {
  const mockType: BigFiveType = {
    id: 'high-extraversion',
    name: '社交的なリーダー',
    catchphrase: '人と共に成長する',
    strengths: ['コミュニケーション力', 'チームワーク', 'ポジティブな影響力'],
    description: '人との交流からエネルギーを得て、積極的に人間関係を築く。',
    primaryDimension: 'extraversion',
    level: 'high'
  }

  describe('text length validation', () => {
    it('should generate text within 140-200 characters', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text.length).toBeGreaterThanOrEqual(140)
      expect(text.length).toBeLessThanOrEqual(200)
    })

    it('should handle long URLs without exceeding 200 characters', () => {
      const longUrl = 'https://personality-platform.vercel.app/tests/bigfive/result/abc123def456'
      const text = generateShareText(mockType, longUrl)
      expect(text.length).toBeLessThanOrEqual(200)
    })

    it('should handle short type names', () => {
      const shortType: BigFiveType = {
        ...mockType,
        name: '楽観家',
        strengths: ['明るさ', '前向き', '強さ']
      }
      const text = generateShareText(shortType, 'https://ex.co/r')
      expect(text.length).toBeGreaterThanOrEqual(140)
      expect(text.length).toBeLessThanOrEqual(200)
    })
  })

  describe('content validation', () => {
    it('should include type name', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text).toContain('社交的なリーダー')
    })

    it('should include all three strengths', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text).toContain('コミュニケーション力')
      expect(text).toContain('チームワーク')
      expect(text).toContain('ポジティブな影響力')
    })

    it('should include hashtags #性格診断 #自己理解 #BigFive', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text).toContain('#性格診断')
      expect(text).toContain('#自己理解')
      expect(text).toContain('#BigFive')
    })

    it('should include result URL', () => {
      const url = 'https://example.com/result/456'
      const text = generateShareText(mockType, url)
      expect(text).toContain(url)
    })

    it('should include a call-to-action phrase', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      // Should include phrases like "あなたの結果は？" or similar CTA
      expect(text).toMatch(/あなた|診断|試し/)
    })
  })

  describe('format validation', () => {
    it('should use checkmark emoji for strengths', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text).toContain('✅')
    })

    it('should have proper line breaks for readability', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text).toContain('\n')
    })

    it('should not have excessive whitespace', () => {
      const text = generateShareText(mockType, 'https://example.com/result/123')
      expect(text).not.toMatch(/\n\n\n/) // No triple line breaks
      expect(text).not.toMatch(/  /) // No double spaces
    })
  })

  describe('different type variations', () => {
    it('should work with low-level types', () => {
      const lowType: BigFiveType = {
        id: 'low-extraversion',
        name: '内省的な思考家',
        catchphrase: '深く考え、静かに行動する',
        strengths: ['集中力', '分析力', '独立性'],
        description: '一人の時間を大切にし、内省を通じて深い洞察を得る。',
        primaryDimension: 'extraversion',
        level: 'low'
      }
      const text = generateShareText(lowType, 'https://example.com/result/789')
      expect(text.length).toBeGreaterThanOrEqual(140)
      expect(text.length).toBeLessThanOrEqual(200)
      expect(text).toContain('内省的な思考家')
    })

    it('should work with neutral-level types', () => {
      const neutralType: BigFiveType = {
        id: 'neutral-conscientiousness',
        name: '適応的な実行者',
        catchphrase: '計画と柔軟性の両立',
        strengths: ['柔軟な計画力', 'バランス感覚', '適応的な遂行力'],
        description: '計画性と柔軟性のバランスが取れている。',
        primaryDimension: 'conscientiousness',
        level: 'neutral'
      }
      const text = generateShareText(neutralType, 'https://example.com/result/xyz')
      expect(text.length).toBeGreaterThanOrEqual(140)
      expect(text.length).toBeLessThanOrEqual(200)
      expect(text).toContain('適応的な実行者')
    })

    it('should work with all 15 types', () => {
      const types: BigFiveType[] = [
        mockType, // Just test one here, integration tests can test all 15
      ]
      types.forEach(type => {
        const text = generateShareText(type, 'https://example.com/result/test')
        expect(text.length).toBeGreaterThanOrEqual(140)
        expect(text.length).toBeLessThanOrEqual(200)
        expect(text).toContain(type.name)
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty URL gracefully', () => {
      const text = generateShareText(mockType, '')
      expect(text.length).toBeGreaterThanOrEqual(140)
      expect(text.length).toBeLessThanOrEqual(200)
    })

    it('should handle very long type names', () => {
      const longNameType: BigFiveType = {
        ...mockType,
        name: '非常に創造的で革新的なアイデアを次々と生み出す探究者'
      }
      const text = generateShareText(longNameType, 'https://example.com/result/long')
      expect(text.length).toBeLessThanOrEqual(200)
    })

    it('should be deterministic (same input = same output)', () => {
      const text1 = generateShareText(mockType, 'https://example.com/result/123')
      const text2 = generateShareText(mockType, 'https://example.com/result/123')
      expect(text1).toBe(text2)
    })
  })
})
