import { describe, it, expect } from 'vitest';
import { bigFiveQuestions20 } from '../bigfive-questions-20';
import type { BigFiveDimension } from '../../../types/bigfive';

describe('BigFive 20-question short version', () => {
  it('should have exactly 20 questions', () => {
    expect(bigFiveQuestions20.length).toBe(20);
  });

  it('should have 4 questions per dimension', () => {
    const counts: Record<BigFiveDimension, number> = {
      neuroticism: 0,
      extraversion: 0,
      openness: 0,
      agreeableness: 0,
      conscientiousness: 0,
    };

    bigFiveQuestions20.forEach((q) => {
      counts[q.dimension]++;
    });

    expect(counts.neuroticism).toBe(4);
    expect(counts.extraversion).toBe(4);
    expect(counts.openness).toBe(4);
    expect(counts.agreeableness).toBe(4);
    expect(counts.conscientiousness).toBe(4);
  });

  it('should have sequential IDs from 1 to 20', () => {
    const ids = bigFiveQuestions20.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('should include both normal and reversed items', () => {
    const reversed = bigFiveQuestions20.filter((q) => q.reversed).length;
    const normal = bigFiveQuestions20.filter((q) => !q.reversed).length;
    expect(reversed).toBeGreaterThan(0);
    expect(normal).toBeGreaterThan(0);
  });

  it('should have all required fields', () => {
    bigFiveQuestions20.forEach((q) => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('text');
      expect(q).toHaveProperty('dimension');
      expect(q).toHaveProperty('reversed');
      expect(q).toHaveProperty('facet');
      expect(typeof q.id).toBe('number');
      expect(typeof q.text).toBe('string');
      expect(typeof q.reversed).toBe('boolean');
      expect(typeof q.facet).toBe('number');
    });
  });

  it('should have valid dimension values', () => {
    const validDimensions: BigFiveDimension[] = [
      'neuroticism',
      'extraversion',
      'openness',
      'agreeableness',
      'conscientiousness',
    ];

    bigFiveQuestions20.forEach((q) => {
      expect(validDimensions).toContain(q.dimension);
    });
  });
});
