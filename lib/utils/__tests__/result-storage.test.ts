import { describe, it, expect } from 'vitest'
import {
  generateResultId,
  encodeResultData,
  decodeResultData,
  isValidEncodedData,
  createResultUrl,
  type ResultData
} from '../result-storage'
import type { BigFiveAnswer } from '@/types/bigfive'

// Mock data for testing
const mockResultData: ResultData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  result: {
    scores: {
      neuroticism: { average: 2.5, normalized: 50, level: 'neutral', questionCount: 4 },
      extraversion: { average: 4.2, normalized: 84, level: 'high', questionCount: 4 },
      openness: { average: 3.8, normalized: 76, level: 'high', questionCount: 4 },
      agreeableness: { average: 3.5, normalized: 70, level: 'high', questionCount: 4 },
      conscientiousness: { average: 3.2, normalized: 64, level: 'neutral', questionCount: 4 }
    },
    totalQuestions: 20,
    completedAt: new Date('2024-01-15T10:30:00Z')
  },
  answers: [
    { questionId: 'q1', value: 5 },
    { questionId: 'q2', value: 4 }
  ]
}

describe('generateResultId', () => {
  it('should generate a valid UUID v4', () => {
    const id = generateResultId()
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(id).toMatch(uuidV4Regex)
  })

  it('should generate unique IDs', () => {
    const id1 = generateResultId()
    const id2 = generateResultId()
    expect(id1).not.toBe(id2)
  })
})

describe('encodeResultData', () => {
  it('should encode data to URL-safe Base64 string', () => {
    const encoded = encodeResultData(mockResultData)

    // Should not contain +, /, or =
    expect(encoded).not.toContain('+')
    expect(encoded).not.toContain('/')
    expect(encoded).not.toContain('=')

    // Should only contain URL-safe characters
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('should produce deterministic output for same input', () => {
    const encoded1 = encodeResultData(mockResultData)
    const encoded2 = encodeResultData(mockResultData)
    expect(encoded1).toBe(encoded2)
  })
})

describe('decodeResultData', () => {
  it('should correctly decode encoded data (round-trip)', () => {
    const encoded = encodeResultData(mockResultData)
    const decoded = decodeResultData(encoded)

    expect(decoded.id).toBe(mockResultData.id)
    expect(decoded.result.totalQuestions).toBe(20)
    expect(decoded.result.scores.extraversion.normalized).toBe(84)
    expect(decoded.answers).toHaveLength(2)
    expect(decoded.result.completedAt.toISOString()).toBe('2024-01-15T10:30:00.000Z')
  })

  it('should throw error for invalid Base64', () => {
    expect(() => decodeResultData('invalid!!!base64')).toThrow('Failed to decode result data')
  })

  it('should throw error for malformed JSON structure', () => {
    // Valid Base64 but invalid structure
    const invalidJson = btoa('{"invalid": "structure"}')
    expect(() => decodeResultData(invalidJson)).toThrow('Invalid data structure')
  })
})

describe('isValidEncodedData', () => {
  it('should return true for valid encoded data', () => {
    const encoded = encodeResultData(mockResultData)
    expect(isValidEncodedData(encoded)).toBe(true)
  })

  it('should return false for invalid data', () => {
    expect(isValidEncodedData('invalid')).toBe(false)
    expect(isValidEncodedData('')).toBe(false)
    expect(isValidEncodedData('123')).toBe(false)
  })
})

describe('createResultUrl', () => {
  it('should create URL with correct format', () => {
    const url = createResultUrl(mockResultData)

    expect(url).toContain('/tests/bigfive/result?')
    expect(url).toContain('id=123e4567-e89b-12d3-a456-426614174000')
    expect(url).toContain('&data=')

    // Extract and validate data parameter
    const dataParam = url.split('data=')[1]
    expect(dataParam).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('should support custom base URL', () => {
    const customBase = 'https://example.com/custom/path'
    const url = createResultUrl(mockResultData, customBase)

    expect(url).toContain(customBase)
    expect(url).toContain('?id=')
    expect(url).toContain('&data=')
  })
})

describe('Edge Cases', () => {
  it('should handle empty answers array', () => {
    const dataWithEmptyAnswers: ResultData = {
      ...mockResultData,
      answers: []
    }

    const encoded = encodeResultData(dataWithEmptyAnswers)
    const decoded = decodeResultData(encoded)

    expect(decoded.answers).toHaveLength(0)
  })

  it('should handle very long answer arrays', () => {
    const longAnswers: BigFiveAnswer[] = Array.from({ length: 100 }, (_, i) => ({
      questionId: `q${i}`,
      value: (i % 5) + 1
    }))

    const dataWithLongAnswers: ResultData = {
      ...mockResultData,
      answers: longAnswers
    }

    const encoded = encodeResultData(dataWithLongAnswers)
    const decoded = decodeResultData(encoded)

    expect(decoded.answers).toHaveLength(100)
  })

  it('should handle special characters in question IDs', () => {
    const specialAnswers: BigFiveAnswer[] = [
      { questionId: 'q-test_123', value: 3 },
      { questionId: 'q.with.dots', value: 4 }
    ]

    const dataWithSpecialChars: ResultData = {
      ...mockResultData,
      answers: specialAnswers
    }

    const encoded = encodeResultData(dataWithSpecialChars)
    const decoded = decodeResultData(encoded)

    expect(decoded.answers[0].questionId).toBe('q-test_123')
    expect(decoded.answers[1].questionId).toBe('q.with.dots')
  })

  it('should preserve all score precision', () => {
    const preciseScores: ResultData = {
      ...mockResultData,
      result: {
        ...mockResultData.result,
        scores: {
          ...mockResultData.result.scores,
          neuroticism: { average: 2.555555, normalized: 51, level: 'neutral', questionCount: 4 }
        }
      }
    }

    const encoded = encodeResultData(preciseScores)
    const decoded = decodeResultData(encoded)

    expect(decoded.result.scores.neuroticism.average).toBe(2.555555)
  })

  it('should handle different date formats', () => {
    const futureDate = new Date('2025-12-31T23:59:59.999Z')
    const dataWithFutureDate: ResultData = {
      ...mockResultData,
      result: {
        ...mockResultData.result,
        completedAt: futureDate
      }
    }

    const encoded = encodeResultData(dataWithFutureDate)
    const decoded = decodeResultData(encoded)

    expect(decoded.result.completedAt.toISOString()).toBe(futureDate.toISOString())
  })

  it('should handle URL length concerns (ensure reasonable size)', () => {
    const encoded = encodeResultData(mockResultData)
    const fullUrl = createResultUrl(mockResultData)

    // URL should be under 2000 characters (safe limit for browsers)
    expect(fullUrl.length).toBeLessThan(2000)

    // Base64 encoded data should be reasonable
    expect(encoded.length).toBeLessThan(1500)
  })
})
