import { describe, it, expect } from 'vitest';
import type { BigFiveOSSQuestion, BigFiveQuestion, BigFiveDimension } from '../../../types/bigfive';
import {
  convertBigFiveOSSToOurFormat,
  createShortVersion,
  mapDomainToDimension,
  mapKeyedToReversed,
} from '../bigfive-adapter';

describe('BigFive Adapter', () => {
  describe('mapDomainToDimension', () => {
    it('should map N to neuroticism', () => {
      expect(mapDomainToDimension('N')).toBe('neuroticism');
    });

    it('should map E to extraversion', () => {
      expect(mapDomainToDimension('E')).toBe('extraversion');
    });

    it('should map O to openness', () => {
      expect(mapDomainToDimension('O')).toBe('openness');
    });

    it('should map A to agreeableness', () => {
      expect(mapDomainToDimension('A')).toBe('agreeableness');
    });

    it('should map C to conscientiousness', () => {
      expect(mapDomainToDimension('C')).toBe('conscientiousness');
    });
  });

  describe('mapKeyedToReversed', () => {
    it('should map "plus" to false (not reversed)', () => {
      expect(mapKeyedToReversed('plus')).toBe(false);
    });

    it('should map "minus" to true (reversed)', () => {
      expect(mapKeyedToReversed('minus')).toBe(true);
    });
  });

  describe('convertBigFiveOSSToOurFormat', () => {
    it('should convert a single OSS question to our format', () => {
      const ossQuestion: BigFiveOSSQuestion = {
        id: '43c98ce8-a07a-4dc2-80f6-c1b2a2485f06',
        text: '心配性だ',
        keyed: 'plus',
        domain: 'N',
        facet: 1,
      };

      const result = convertBigFiveOSSToOurFormat([ossQuestion]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        text: '心配性だ',
        dimension: 'neuroticism',
        reversed: false,
        facet: 1,
      });
    });

    it('should return empty array for empty input', () => {
      const result = convertBigFiveOSSToOurFormat([]);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should convert reversed item correctly', () => {
      const ossQuestion: BigFiveOSSQuestion = {
        id: 'test-uuid-123',
        text: '落ち着いている',
        keyed: 'minus',
        domain: 'N',
        facet: 1,
      };

      const result = convertBigFiveOSSToOurFormat([ossQuestion]);
      expect(result[0].reversed).toBe(true);
    });

    it('should assign sequential IDs', () => {
      const ossQuestions: BigFiveOSSQuestion[] = [
        { id: 'uuid-1', text: 'Q1', keyed: 'plus', domain: 'N', facet: 1 },
        { id: 'uuid-2', text: 'Q2', keyed: 'plus', domain: 'E', facet: 1 },
      ];

      const result = convertBigFiveOSSToOurFormat(ossQuestions);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('createShortVersion', () => {
    it('should select exactly 20 questions', () => {
      const dimensions: BigFiveDimension[] = [
        'neuroticism',
        'extraversion',
        'openness',
        'agreeableness',
        'conscientiousness',
      ];
      const questions: BigFiveQuestion[] = [];
      let id = 1;

      // Create 24 questions per dimension (120 total)
      for (const dimension of dimensions) {
        for (let i = 0; i < 24; i++) {
          questions.push({
            id: id++,
            text: `test ${dimension} ${i}`,
            dimension,
            reversed: false,
            facet: (i % 6) + 1,
          });
        }
      }

      const shortVersion = createShortVersion(questions, 20);
      expect(shortVersion).toHaveLength(20);
    });

    it('should select questions evenly across all 5 dimensions', () => {
      const dimensions: BigFiveDimension[] = [
        'neuroticism',
        'extraversion',
        'openness',
        'agreeableness',
        'conscientiousness',
      ];
      const questions: BigFiveQuestion[] = [];
      let id = 1;

      // Create 24 questions per dimension
      for (const dimension of dimensions) {
        for (let i = 0; i < 24; i++) {
          questions.push({
            id: id++,
            text: `test ${dimension} ${i}`,
            dimension,
            reversed: false,
            facet: (i % 6) + 1,
          });
        }
      }

      const shortVersion = createShortVersion(questions, 20);

      // Count questions per dimension (should be 4 each for 20 total)
      const dimensionCounts = dimensions.reduce(
        (acc, dim) => {
          acc[dim] = shortVersion.filter((q) => q.dimension === dim).length;
          return acc;
        },
        {} as Record<BigFiveDimension, number>
      );

      // Each dimension should have exactly 4 questions (20 / 5 = 4)
      dimensions.forEach((dim) => {
        expect(dimensionCounts[dim]).toBe(4);
      });
    });

    it('should handle count of 0', () => {
      const questions: BigFiveQuestion[] = [
        { id: 1, text: 'Q1', dimension: 'neuroticism', reversed: false, facet: 1 },
        { id: 2, text: 'Q2', dimension: 'extraversion', reversed: false, facet: 1 },
      ];

      const result = createShortVersion(questions, 0);
      expect(result).toHaveLength(0);
    });

    it('should handle odd count (21 questions)', () => {
      const dimensions: BigFiveDimension[] = [
        'neuroticism',
        'extraversion',
        'openness',
        'agreeableness',
        'conscientiousness',
      ];
      const questions: BigFiveQuestion[] = [];
      let id = 1;

      for (const dimension of dimensions) {
        for (let i = 0; i < 24; i++) {
          questions.push({
            id: id++,
            text: `test ${dimension} ${i}`,
            dimension,
            reversed: false,
            facet: (i % 6) + 1,
          });
        }
      }

      const result = createShortVersion(questions, 21);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(21);
    });

    it('should handle insufficient questions per dimension', () => {
      const fewQuestions: BigFiveQuestion[] = [
        { id: 1, text: 'Q1', dimension: 'neuroticism', reversed: false, facet: 1 },
      ];

      const result = createShortVersion(fewQuestions, 20);
      // When there are not enough questions, it should return what's available
      expect(result.length).toBeLessThanOrEqual(1);
    });
  });
});
