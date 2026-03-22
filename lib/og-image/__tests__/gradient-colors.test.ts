/**
 * Tests for OG Image Gradient Color Utilities
 *
 * TDD Approach:
 * 1. Test normal cases (正常系)
 * 2. Test edge cases (境界値)
 * 3. Test error cases (異常系)
 */

import { describe, it, expect } from 'vitest'
import {
  darkenHexColor,
  getGradientColors,
  getCSSGradient,
  getDimensionColors,
  isValidHexColor,
} from '../gradient-colors'
import type { BigFiveDimension } from '@/types/bigfive'

describe('OG Image Gradient Color Utilities', () => {
  describe('darkenHexColor', () => {
    describe('正常系', () => {
      it('should darken a hex color by default amount (40)', () => {
        const result = darkenHexColor('#f97316')
        // #f97316 -> R=249, G=115, B=22 -> R=209, G=75, B=0 -> #d14b00
        expect(result).toBe('#d14b00')
      })

      it('should darken a hex color by custom amount', () => {
        const result = darkenHexColor('#f97316', 20)
        expect(result).toBe('#e55f02')
      })

      it('should handle colors with # prefix', () => {
        const result = darkenHexColor('#ffffff', 40)
        expect(result).toBe('#d7d7d7')
      })

      it('should handle colors without # prefix', () => {
        const result = darkenHexColor('ffffff', 40)
        expect(result).toBe('#d7d7d7')
      })
    })

    describe('境界値', () => {
      it('should not go below 0 (black)', () => {
        const result = darkenHexColor('#000000', 100)
        expect(result).toBe('#000000')
      })

      it('should handle very dark colors', () => {
        const result = darkenHexColor('#101010', 20)
        expect(result).toBe('#000000')
      })

      it('should darken by 0 (no change)', () => {
        const result = darkenHexColor('#f97316', 0)
        expect(result).toBe('#f97316')
      })
    })
  })

  describe('getGradientColors', () => {
    describe('正常系 - Extraversion', () => {
      it('should return gradient for high extraversion', () => {
        const result = getGradientColors('extraversion', 'high')
        expect(result.to).toBe('#f97316') // Original color
        expect(result.from).toBe('#d14b00') // Darkened by 40
      })

      it('should return gradient for neutral extraversion', () => {
        const result = getGradientColors('extraversion', 'neutral')
        expect(result.to).toBe('#a3a3a3') // Gray
        expect(result.from).toBe('#7b7b7b') // Darkened gray
      })

      it('should return gradient for low extraversion', () => {
        const result = getGradientColors('extraversion', 'low')
        expect(result.to).toBe('#8b5cf6') // Purple
        // #8b5cf6 -> R=139, G=92, B=246 -> R=99, G=52, B=206 -> #6334ce
        expect(result.from).toBe('#6334ce') // Darkened purple
      })
    })

    describe('正常系 - All dimensions', () => {
      const dimensions: BigFiveDimension[] = [
        'neuroticism',
        'extraversion',
        'openness',
        'agreeableness',
        'conscientiousness',
      ]

      const levels: Array<'high' | 'neutral' | 'low'> = ['high', 'neutral', 'low']

      dimensions.forEach((dimension) => {
        levels.forEach((level) => {
          it(`should return gradient for ${dimension} - ${level}`, () => {
            const result = getGradientColors(dimension, level)
            expect(result).toHaveProperty('from')
            expect(result).toHaveProperty('to')
            expect(isValidHexColor(result.from)).toBe(true)
            expect(isValidHexColor(result.to)).toBe(true)
          })
        })
      })
    })

    describe('境界値', () => {
      it('should handle all 15 type combinations', () => {
        const dimensions: BigFiveDimension[] = [
          'neuroticism',
          'extraversion',
          'openness',
          'agreeableness',
          'conscientiousness',
        ]
        const levels: Array<'high' | 'neutral' | 'low'> = ['high', 'neutral', 'low']

        let count = 0
        dimensions.forEach((dimension) => {
          levels.forEach((level) => {
            const result = getGradientColors(dimension, level)
            expect(result).toBeDefined()
            count++
          })
        })

        expect(count).toBe(15) // 5 dimensions × 3 levels = 15 types
      })
    })
  })

  describe('getCSSGradient', () => {
    describe('正常系', () => {
      it('should return CSS gradient string with default angle (135deg)', () => {
        const result = getCSSGradient('extraversion', 'high')
        expect(result).toContain('linear-gradient(135deg')
        expect(result).toContain('#d14b00 0%') // from
        expect(result).toContain('#f97316 100%') // to
      })

      it('should return CSS gradient string with custom angle', () => {
        const result = getCSSGradient('extraversion', 'high', 90)
        expect(result).toContain('linear-gradient(90deg')
      })

      it('should handle 0 degree angle', () => {
        const result = getCSSGradient('extraversion', 'high', 0)
        expect(result).toContain('linear-gradient(0deg')
      })

      it('should handle 360 degree angle', () => {
        const result = getCSSGradient('extraversion', 'high', 360)
        expect(result).toContain('linear-gradient(360deg')
      })
    })

    describe('全次元・全レベルの網羅テスト', () => {
      const dimensions: BigFiveDimension[] = [
        'neuroticism',
        'extraversion',
        'openness',
        'agreeableness',
        'conscientiousness',
      ]
      const levels: Array<'high' | 'neutral' | 'low'> = ['high', 'neutral', 'low']

      dimensions.forEach((dimension) => {
        levels.forEach((level) => {
          it(`should return valid CSS gradient for ${dimension} - ${level}`, () => {
            const result = getCSSGradient(dimension, level)
            expect(result).toMatch(/^linear-gradient\(\d+deg, #[0-9a-f]{6} 0%, #[0-9a-f]{6} 100%\)$/)
          })
        })
      })
    })
  })

  describe('getDimensionColors', () => {
    describe('正常系', () => {
      it('should return all colors for extraversion', () => {
        const result = getDimensionColors('extraversion')
        expect(result).toHaveProperty('high')
        expect(result).toHaveProperty('neutral')
        expect(result).toHaveProperty('low')
        expect(result.high).toBe('#f97316')
        expect(result.neutral).toBe('#a3a3a3')
        expect(result.low).toBe('#8b5cf6')
      })

      it('should return all colors for neuroticism', () => {
        const result = getDimensionColors('neuroticism')
        expect(result.high).toBe('#fbbf24')
        expect(result.neutral).toBe('#a3a3a3')
        expect(result.low).toBe('#60a5fa')
      })
    })

    describe('全次元の網羅テスト', () => {
      const dimensions: BigFiveDimension[] = [
        'neuroticism',
        'extraversion',
        'openness',
        'agreeableness',
        'conscientiousness',
      ]

      dimensions.forEach((dimension) => {
        it(`should return valid colors for ${dimension}`, () => {
          const result = getDimensionColors(dimension)
          expect(isValidHexColor(result.high)).toBe(true)
          expect(isValidHexColor(result.neutral)).toBe(true)
          expect(isValidHexColor(result.low)).toBe(true)
        })
      })
    })
  })

  describe('isValidHexColor', () => {
    describe('正常系', () => {
      it('should validate correct hex colors', () => {
        expect(isValidHexColor('#ffffff')).toBe(true)
        expect(isValidHexColor('#000000')).toBe(true)
        expect(isValidHexColor('#f97316')).toBe(true)
        expect(isValidHexColor('#ABCDEF')).toBe(true)
        expect(isValidHexColor('#abc123')).toBe(true)
      })
    })

    describe('異常系', () => {
      it('should reject invalid hex colors', () => {
        expect(isValidHexColor('ffffff')).toBe(false) // No #
        expect(isValidHexColor('#fff')).toBe(false) // Too short
        expect(isValidHexColor('#fffffff')).toBe(false) // Too long
        expect(isValidHexColor('#gggggg')).toBe(false) // Invalid characters
        expect(isValidHexColor('')).toBe(false) // Empty string
        expect(isValidHexColor('#')).toBe(false) // Just #
      })
    })

    describe('境界値', () => {
      it('should handle edge cases', () => {
        expect(isValidHexColor('#123abc')).toBe(true)
        expect(isValidHexColor('#ABC123')).toBe(true)
        expect(isValidHexColor('#00000')).toBe(false) // 5 characters
        expect(isValidHexColor('#0000000')).toBe(false) // 7 characters
      })
    })
  })

  describe('統合テスト - 全15タイプのグラデーション生成', () => {
    const typeDefinitions = [
      { dimension: 'neuroticism' as const, level: 'high' as const, expectedColor: '#fbbf24' },
      { dimension: 'neuroticism' as const, level: 'neutral' as const, expectedColor: '#a3a3a3' },
      { dimension: 'neuroticism' as const, level: 'low' as const, expectedColor: '#60a5fa' },
      { dimension: 'extraversion' as const, level: 'high' as const, expectedColor: '#f97316' },
      { dimension: 'extraversion' as const, level: 'neutral' as const, expectedColor: '#a3a3a3' },
      { dimension: 'extraversion' as const, level: 'low' as const, expectedColor: '#8b5cf6' },
      { dimension: 'openness' as const, level: 'high' as const, expectedColor: '#ec4899' },
      { dimension: 'openness' as const, level: 'neutral' as const, expectedColor: '#a3a3a3' },
      { dimension: 'openness' as const, level: 'low' as const, expectedColor: '#10b981' },
      { dimension: 'agreeableness' as const, level: 'high' as const, expectedColor: '#06b6d4' },
      { dimension: 'agreeableness' as const, level: 'neutral' as const, expectedColor: '#a3a3a3' },
      { dimension: 'agreeableness' as const, level: 'low' as const, expectedColor: '#ef4444' },
      {
        dimension: 'conscientiousness' as const,
        level: 'high' as const,
        expectedColor: '#3b82f6',
      },
      {
        dimension: 'conscientiousness' as const,
        level: 'neutral' as const,
        expectedColor: '#a3a3a3',
      },
      { dimension: 'conscientiousness' as const, level: 'low' as const, expectedColor: '#f59e0b' },
    ]

    typeDefinitions.forEach(({ dimension, level, expectedColor }) => {
      it(`should generate correct gradient for ${dimension} - ${level}`, () => {
        const gradient = getGradientColors(dimension, level)
        expect(gradient.to).toBe(expectedColor)

        const cssGradient = getCSSGradient(dimension, level)
        expect(cssGradient).toContain(expectedColor)

        const dimensionColors = getDimensionColors(dimension)
        expect(dimensionColors[level]).toBe(expectedColor)
      })
    })
  })

  describe('決定論的動作の検証', () => {
    it('should always return the same gradient for the same input', () => {
      const result1 = getGradientColors('extraversion', 'high')
      const result2 = getGradientColors('extraversion', 'high')
      expect(result1).toEqual(result2)
    })

    it('should always return the same CSS gradient for the same input', () => {
      const result1 = getCSSGradient('extraversion', 'high', 135)
      const result2 = getCSSGradient('extraversion', 'high', 135)
      expect(result1).toBe(result2)
    })
  })
})
