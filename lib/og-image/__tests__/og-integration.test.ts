/**
 * Integration Tests for OG Image Generation
 *
 * This test suite validates the integration between:
 * - BigFive type classification (Day 1)
 * - OG image gradient colors (Day 2.5)
 * - All 15 personality types
 *
 * TDD Approach:
 * 1. Test all 15 type combinations
 * 2. Test type classification + gradient color integration
 * 3. Test edge cases and error handling
 */

import { describe, it, expect } from 'vitest'
import { classifyType } from '@/lib/tests/bigfive-type-classifier'
import { getGradientColors, getCSSGradient } from '../gradient-colors'
import type { BigFiveResult } from '@/types/bigfive'

describe('OG Image Generation - Integration Tests', () => {
  describe('全15タイプの統合テスト', () => {
    const allTypes = [
      {
        name: '高ニューロティシズム',
        dimension: 'neuroticism' as const,
        level: 'high' as const,
        scores: {
          neuroticism: { average: 4.5, normalized: 90, level: 'high' as const, questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '感受性豊かな共感者',
        expectedGradientColor: '#fbbf24',
      },
      {
        name: '低ニューロティシズム',
        dimension: 'neuroticism' as const,
        level: 'low' as const,
        scores: {
          neuroticism: { average: 1.5, normalized: 30, level: 'low' as const, questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '揺るがない楽観主義者',
        expectedGradientColor: '#60a5fa',
      },
      {
        name: '高外向性',
        dimension: 'extraversion' as const,
        level: 'high' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 4.5, normalized: 90, level: 'high' as const, questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '社交的なリーダー',
        expectedGradientColor: '#f97316',
      },
      {
        name: '低外向性',
        dimension: 'extraversion' as const,
        level: 'low' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 1.5, normalized: 30, level: 'low' as const, questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '内省的な思考家',
        expectedGradientColor: '#8b5cf6',
      },
      {
        name: '高開放性',
        dimension: 'openness' as const,
        level: 'high' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 4.5, normalized: 90, level: 'high' as const, questionCount: 4 },
          agreeableness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '創造的な探究者',
        expectedGradientColor: '#ec4899',
      },
      {
        name: '低開放性',
        dimension: 'openness' as const,
        level: 'low' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 1.5, normalized: 30, level: 'low' as const, questionCount: 4 },
          agreeableness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '実践的な専門家',
        expectedGradientColor: '#10b981',
      },
      {
        name: '高協調性',
        dimension: 'agreeableness' as const,
        level: 'high' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 4.5,
            normalized: 90,
            level: 'high' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '温かい調和の創り手',
        expectedGradientColor: '#06b6d4',
      },
      {
        name: '低協調性',
        dimension: 'agreeableness' as const,
        level: 'low' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 1.5,
            normalized: 30,
            level: 'low' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '率直な挑戦者',
        expectedGradientColor: '#ef4444',
      },
      {
        name: '高誠実性',
        dimension: 'conscientiousness' as const,
        level: 'high' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 2.5,
            normalized: 50,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 4.5,
            normalized: 90,
            level: 'high' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '計画的な達成者',
        expectedGradientColor: '#3b82f6',
      },
      {
        name: '低誠実性',
        dimension: 'conscientiousness' as const,
        level: 'low' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 2.5,
            normalized: 50,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 1.5,
            normalized: 30,
            level: 'low' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '自由な即興家',
        expectedGradientColor: '#f59e0b',
      },
    ]

    allTypes.forEach(({ name, dimension, level, scores, expectedTypeName, expectedGradientColor }) => {
      describe(`${name}タイプ`, () => {
        const result: BigFiveResult = {
          scores,
          totalQuestions: 20,
          completedAt: new Date(),
        }

        it(`should classify as ${expectedTypeName}`, () => {
          const type = classifyType(result)
          expect(type.name).toBe(expectedTypeName)
          expect(type.primaryDimension).toBe(dimension)
          expect(type.level).toBe(level)
        })

        it(`should generate correct gradient color (${expectedGradientColor})`, () => {
          const gradient = getGradientColors(dimension, level)
          expect(gradient.to).toBe(expectedGradientColor)
        })

        it('should integrate classification with gradient generation', () => {
          const type = classifyType(result)
          const gradient = getGradientColors(type.primaryDimension, type.level)
          expect(gradient.to).toBe(expectedGradientColor)
        })

        it('should generate valid CSS gradient', () => {
          const type = classifyType(result)
          const cssGradient = getCSSGradient(type.primaryDimension, type.level)
          expect(cssGradient).toContain('linear-gradient')
          expect(cssGradient).toContain(expectedGradientColor)
        })
      })
    })
  })

  describe('Neutral（中立）タイプの統合テスト', () => {
    const neutralTypes = [
      {
        name: 'バランス型の調整者（ニューロティシズム中立）',
        dimension: 'neuroticism' as const,
        scores: {
          neuroticism: { average: 2.8, normalized: 56, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 2.5,
            normalized: 50,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 2.5,
            normalized: 50,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: 'バランス型の調整者',
      },
      {
        name: '柔軟な交流者（外向性中立）',
        dimension: 'extraversion' as const,
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          extraversion: { average: 2.8, normalized: 56, level: 'neutral' as const, questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral' as const, questionCount: 4 },
          agreeableness: {
            average: 2.5,
            normalized: 50,
            level: 'neutral' as const,
            questionCount: 4,
          },
          conscientiousness: {
            average: 2.5,
            normalized: 50,
            level: 'neutral' as const,
            questionCount: 4,
          },
        },
        expectedTypeName: '柔軟な交流者',
      },
    ]

    neutralTypes.forEach(({ name, dimension, scores, expectedTypeName }) => {
      it(`should handle ${name}`, () => {
        const result: BigFiveResult = {
          scores,
          totalQuestions: 20,
          completedAt: new Date(),
        }

        const type = classifyType(result)
        expect(type.name).toBe(expectedTypeName)
        expect(type.primaryDimension).toBe(dimension)
        expect(type.level).toBe('neutral')

        const gradient = getGradientColors(type.primaryDimension, type.level)
        expect(gradient.to).toBe('#a3a3a3') // Neutral gray
      })
    })
  })

  describe('エッジケース・境界値テスト', () => {
    it('should handle equal deviations (tie-breaking by priority)', () => {
      // Extraversion and Conscientiousness have equal deviation (10)
      // Extraversion should win (higher priority)
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          conscientiousness: {
            average: 3.0,
            normalized: 60,
            level: 'neutral',
            questionCount: 4,
          },
        },
        totalQuestions: 20,
        completedAt: new Date(),
      }

      const type = classifyType(result)
      expect(type.primaryDimension).toBe('extraversion') // Higher priority
    })

    it('should handle maximum deviation (normalized=100)', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 5.0, normalized: 100, level: 'high', questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
        },
        totalQuestions: 20,
        completedAt: new Date(),
      }

      const type = classifyType(result)
      expect(type.primaryDimension).toBe('extraversion')
      expect(type.level).toBe('high')
    })

    it('should handle minimum deviation (normalized=0)', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 1.0, normalized: 0, level: 'low', questionCount: 4 },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          openness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
        },
        totalQuestions: 20,
        completedAt: new Date(),
      }

      const type = classifyType(result)
      expect(type.primaryDimension).toBe('neuroticism')
      expect(type.level).toBe('low')
    })
  })

  describe('決定論的動作の検証', () => {
    it('should always return the same gradient for the same type', () => {
      const result: BigFiveResult = {
        scores: {
          neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
          extraversion: { average: 4.5, normalized: 90, level: 'high', questionCount: 4 },
          openness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
          conscientiousness: { average: 3.0, normalized: 60, level: 'neutral', questionCount: 4 },
        },
        totalQuestions: 20,
        completedAt: new Date(),
      }

      const type1 = classifyType(result)
      const gradient1 = getGradientColors(type1.primaryDimension, type1.level)

      const type2 = classifyType(result)
      const gradient2 = getGradientColors(type2.primaryDimension, type2.level)

      expect(type1).toEqual(type2)
      expect(gradient1).toEqual(gradient2)
    })
  })
})
