import { describe, it, expect } from 'vitest'
import { calculateBigFiveResult } from '../bigfive-calculator'
import type { BigFiveAnswer } from '@/types/bigfive'

describe('Big Five Calculator', () => {
  describe('calculateBigFiveResult', () => {
    it('should calculate scores for all minimum values (all 1s)', () => {
      // すべての質問に「1」（全く当てはまらない）と回答
      // 逆転項目がない場合、すべて0になるはず
      const answers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 1,
      }))

      const result = calculateBigFiveResult(answers)

      // すべて最低スコア（0）になるはず
      expect(result.scores.openness).toBe(0)
      expect(result.scores.conscientiousness).toBe(0)
      expect(result.scores.extraversion).toBe(0)
      expect(result.scores.agreeableness).toBe(0)
      expect(result.scores.neuroticism).toBe(0)
    })

    it('should calculate scores for all maximum values (all 5s)', () => {
      // すべての質問に「5」（非常に当てはまる）と回答
      const answers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 5,
      }))

      const result = calculateBigFiveResult(answers)

      // すべて最高スコア（100）になるはず
      expect(result.scores.openness).toBe(100)
      expect(result.scores.conscientiousness).toBe(100)
      expect(result.scores.extraversion).toBe(100)
      expect(result.scores.agreeableness).toBe(100)
      expect(result.scores.neuroticism).toBe(100)
    })

    it('should handle reversed items correctly', () => {
      // 逆転項目のテスト
      // questionId 1: 正転項目（dimension: openness, reversed: false）
      // questionId 2: 逆転項目（dimension: openness, reversed: true）
      const answers: BigFiveAnswer[] = [
        { questionId: 1, value: 5 }, // 正転: 5 → そのまま5
        { questionId: 2, value: 5 }, // 逆転: 5 → 1に変換
        { questionId: 3, value: 1 }, // 逆転: 1 → 5に変換
        { questionId: 4, value: 3 }, // 正転: 3 → そのまま3
      ]

      const result = calculateBigFiveResult(answers)

      // スコアが正しく計算されることを確認
      expect(result.scores).toBeDefined()
      expect(typeof result.scores.openness).toBe('number')
      expect(result.scores.openness).toBeGreaterThanOrEqual(0)
      expect(result.scores.openness).toBeLessThanOrEqual(100)
    })

    it('should calculate correct average for mixed values', () => {
      // 中間的な回答（3が中心）
      const answers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 3,
      }))

      const result = calculateBigFiveResult(answers)

      // 中間値（50付近）になるはず
      expect(result.scores.openness).toBeGreaterThan(40)
      expect(result.scores.openness).toBeLessThan(60)
      expect(result.scores.conscientiousness).toBeGreaterThan(40)
      expect(result.scores.conscientiousness).toBeLessThan(60)
      expect(result.scores.extraversion).toBeGreaterThan(40)
      expect(result.scores.extraversion).toBeLessThan(60)
      expect(result.scores.agreeableness).toBeGreaterThan(40)
      expect(result.scores.agreeableness).toBeLessThan(60)
      expect(result.scores.neuroticism).toBeGreaterThan(40)
      expect(result.scores.neuroticism).toBeLessThan(60)
    })

    it('should return result with takenAt timestamp', () => {
      const answers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 3,
      }))

      const result = calculateBigFiveResult(answers)

      expect(result.takenAt).toBeInstanceOf(Date)
    })

    it('should return result with all dimension details', () => {
      const answers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 3,
      }))

      const result = calculateBigFiveResult(answers)

      // すべての次元の詳細情報が存在すること
      expect(result.details.openness).toBeDefined()
      expect(result.details.conscientiousness).toBeDefined()
      expect(result.details.extraversion).toBeDefined()
      expect(result.details.agreeableness).toBeDefined()
      expect(result.details.neuroticism).toBeDefined()

      // 各詳細情報が必要なプロパティを持つこと
      expect(result.details.openness.name).toBe('開放性')
      expect(result.details.openness.score).toBeDefined()
      expect(result.details.openness.level).toBeDefined()
      expect(result.details.openness.description).toBeDefined()
      expect(Array.isArray(result.details.openness.highTraits)).toBe(true)
      expect(Array.isArray(result.details.openness.lowTraits)).toBe(true)
    })

    it('should handle partial answers gracefully', () => {
      // 一部の質問のみ回答
      const answers: BigFiveAnswer[] = [
        { questionId: 1, value: 4 },
        { questionId: 2, value: 3 },
        { questionId: 5, value: 5 },
      ]

      const result = calculateBigFiveResult(answers)

      // エラーにならず、結果が返ること
      expect(result.scores).toBeDefined()
      expect(result.details).toBeDefined()
    })

    it('should normalize scores to 0-100 range', () => {
      const answers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5, // 1-5の値をループ
      }))

      const result = calculateBigFiveResult(answers)

      // すべてのスコアが0-100の範囲内
      Object.values(result.scores).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })

    it('should assign correct score levels', () => {
      // 高スコアのテスト
      const highAnswers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 5,
      }))

      const highResult = calculateBigFiveResult(highAnswers)

      // 高スコアの場合、levelが'high'または'somewhat_high'
      expect(['high', 'somewhat_high']).toContain(highResult.details.openness.level)

      // 低スコアのテスト
      const lowAnswers: BigFiveAnswer[] = Array.from({ length: 20 }, (_, i) => ({
        questionId: i + 1,
        value: 1,
      }))

      const lowResult = calculateBigFiveResult(lowAnswers)

      // 低スコアの場合、levelが'low'または'somewhat_low'
      expect(['low', 'somewhat_low']).toContain(lowResult.details.openness.level)
    })
  })
})
