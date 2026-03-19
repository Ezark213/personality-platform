/**
 * BigFive Personality Test Type Definitions
 *
 * This file contains type definitions for the BigFive personality test,
 * including both the original BigFive OSS format and our internal format.
 *
 * Data Source: BigFive OSS (https://github.com/rubynor/bigfive-web)
 * License: MIT (see data/tests/LICENSE-BIGFIVE.md)
 */

// ============================================================================
// BigFive OSS Original Format
// ============================================================================

/**
 * Domain code from BigFive OSS
 * - N: Neuroticism (神経症傾向)
 * - E: Extraversion (外向性)
 * - O: Openness (開放性)
 * - A: Agreeableness (協調性)
 * - C: Conscientiousness (誠実性)
 */
export type BigFiveOSSDomain = 'N' | 'E' | 'O' | 'A' | 'C';

/**
 * Keyed value from BigFive OSS
 * - plus: Normal scoring (高いほど当該次元が高い)
 * - minus: Reverse scoring (逆転項目、低いほど当該次元が高い)
 */
export type BigFiveOSSKeyed = 'plus' | 'minus';

/**
 * BigFive OSS original question format
 * This is the format used in the BigFive OSS repository.
 */
export interface BigFiveOSSQuestion {
  /** UUID of the question */
  id: string;

  /** Question text (Japanese) */
  text: string;

  /** Scoring direction (plus=normal, minus=reversed) */
  keyed: BigFiveOSSKeyed;

  /** Domain code (N/E/O/A/C) */
  domain: BigFiveOSSDomain;

  /** Facet number (1-6) */
  facet: number;
}

// ============================================================================
// Our Internal Format
// ============================================================================

/**
 * Dimension names used in our system
 * (English names matching psychological literature)
 */
export type BigFiveDimension =
  | 'neuroticism'    // 神経症傾向
  | 'extraversion'   // 外向性
  | 'openness'       // 開放性
  | 'agreeableness'  // 協調性
  | 'conscientiousness'; // 誠実性

/**
 * Our internal question format
 * Simplified and numbered for easier handling.
 */
export interface BigFiveQuestion {
  /** Sequential ID (1-120) */
  id: number;

  /** Question text (Japanese) */
  text: string;

  /** Which dimension this question belongs to */
  dimension: BigFiveDimension;

  /** Whether this is a reversed item (true = reverse scoring) */
  reversed: boolean;

  /** Facet number (1-6) from original data */
  facet: number;
}

/**
 * User's answer to a question
 */
export interface BigFiveAnswer {
  /** Question ID */
  questionId: number;

  /** Answer value (1-5 scale) */
  value: number;
}

/**
 * Score level classification
 */
export type ScoreLevel = 'low' | 'neutral' | 'high';

/**
 * Dimension score result
 */
export interface DimensionScore {
  /** Raw average score (1-5 scale) */
  average: number;

  /** Normalized score (0-100 scale) */
  normalized: number;

  /** Score level classification */
  level: ScoreLevel;

  /** Number of questions answered for this dimension */
  questionCount: number;
}

/**
 * Complete BigFive test result
 */
export interface BigFiveResult {
  /** Scores for each dimension */
  scores: {
    neuroticism: DimensionScore;
    extraversion: DimensionScore;
    openness: DimensionScore;
    agreeableness: DimensionScore;
    conscientiousness: DimensionScore;
  };

  /** Total questions answered */
  totalQuestions: number;

  /** Timestamp of completion */
  completedAt: Date;
}

/**
 * Question set metadata
 */
export interface QuestionSetMetadata {
  /** Total number of questions */
  totalCount: number;

  /** Question count per dimension */
  dimensionCounts: Record<BigFiveDimension, number>;

  /** Version identifier */
  version: '120-full' | '20-short';

  /** Source information */
  source: string;

  /** License information */
  license: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Determine the score level based on normalized score (0-100)
 *
 * Classification:
 * - low: 0-35
 * - neutral: 36-64
 * - high: 65-100
 *
 * @param normalizedScore Score in 0-100 range
 * @returns Score level classification
 */
export function getScoreLevel(normalizedScore: number): ScoreLevel {
  if (normalizedScore <= 35) {
    return 'low'
  } else if (normalizedScore >= 65) {
    return 'high'
  } else {
    return 'neutral'
  }
}
