/**
 * Tests for BigFive Type Classifier
 *
 * This test file follows TDD principles:
 * 1. Write tests first (they should FAIL)
 * 2. Implement minimal code to pass
 * 3. Refactor
 *
 * Initial run: These tests WILL FAIL because the implementation doesn't exist yet.
 */

import { describe, it, expect } from 'vitest'
import { classifyType, extractStrengths } from '../bigfive-type-classifier'
import type { BigFiveResult } from '@/types/bigfive'

describe('BigFive Type Classifier', () => {
  describe('classifyType', () => {
    it('should classify high extraversion as "社交的な" type', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 4.5, normalized: 90, level: 'high', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('extraversion')
      expect(type.level).toBe('high')
      expect(type.name).toContain('社交的')
    })

    it('should classify low extraversion as "内省的な" type', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 1.5, normalized: 30, level: 'low', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('extraversion')
      expect(type.level).toBe('low')
      expect(type.name).toContain('内省的')
    })

    it('should classify high openness correctly', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 4.8, normalized: 95, level: 'high', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('openness')
      expect(type.level).toBe('high')
      expect(type.name).toContain('創造的')
    })

    it('should classify high conscientiousness correctly', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 4.7, normalized: 92, level: 'high', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('conscientiousness')
      expect(type.level).toBe('high')
      expect(type.name).toContain('計画的')
    })

    it('should handle tie by priority (extraversion > conscientiousness > openness > agreeableness > neuroticism)', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 4.0, normalized: 80, level: 'high', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 4.0, normalized: 80, level: 'high', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('extraversion') // Higher priority than conscientiousness
    })

    it('should classify neutral level correctly when all scores are moderate', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      // When all are equal, extraversion wins by priority
      expect(type.primaryDimension).toBe('extraversion')
      expect(type.level).toBe('neutral')
    })

    it('should classify low neuroticism as "楽観主義者"', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 1.2, normalized: 20, level: 'low', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('neuroticism')
      expect(type.level).toBe('low')
      expect(type.name).toContain('楽観')
    })

    it('should classify high agreeableness correctly', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 4.6, normalized: 88, level: 'high', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const type = classifyType(result)
      expect(type.primaryDimension).toBe('agreeableness')
      expect(type.level).toBe('high')
      expect(type.name).toContain('調和')
    })
  })

  describe('extractStrengths', () => {
    it('should return 3 strengths from the classified type', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 4.5, normalized: 90, level: 'high', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const strengths = extractStrengths(result)
      expect(strengths).toHaveLength(3)
      expect(strengths).toContain('コミュニケーション力')
      expect(strengths).toContain('チームワーク')
    })

    it('should return different strengths for different types', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 4.8, normalized: 95, level: 'high', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 }
        },
        totalQuestions: 20,
        completedAt: new Date()
      }
      const strengths = extractStrengths(result)
      expect(strengths).toHaveLength(3)
      expect(strengths).toContain('創造性')
      expect(strengths).toContain('知的好奇心')
    })
  })
})
