/**
 * Love Type Test Type Definitions
 *
 * 恋愛タイプ診断の型定義
 */

// ============================================================================
// Love Style Dimensions
// ============================================================================

/**
 * 恋愛スタイルの次元
 * - romantic: ロマンティック傾向
 * - practical: 実用的傾向
 * - passionate: 情熱的傾向
 * - companionate: 友情的傾向
 */
export type LoveStyleDimension =
  | 'romantic'      // ロマンティック
  | 'practical'     // 実用的
  | 'passionate'    // 情熱的
  | 'companionate'; // 友情的

/**
 * Question for love type test
 */
export interface LoveTypeQuestion {
  /** Sequential ID (1-20) */
  id: number;

  /** Question text (Japanese) */
  text: string;

  /** Which dimension this question belongs to */
  dimension: LoveStyleDimension;

  /** Whether this is a reversed item (true = reverse scoring) */
  reversed: boolean;
}

/**
 * User's answer to a question
 */
export interface LoveTypeAnswer {
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
 * Complete Love Type test result
 */
export interface LoveTypeResult {
  /** Scores for each dimension */
  scores: {
    romantic: DimensionScore;
    practical: DimensionScore;
    passionate: DimensionScore;
    companionate: DimensionScore;
  };

  /** Total questions answered */
  totalQuestions: number;

  /** Timestamp of completion */
  completedAt: Date;
}

/**
 * Love Type classification
 */
export interface LoveType {
  /** Unique identifier */
  id: string;

  /** Type name (Japanese) */
  name: string;

  /** Catchphrase describing the type */
  catchphrase: string;

  /** Three key strengths */
  strengths: string[];

  /** Detailed description */
  description: string;

  /** Romantic advice */
  advice: string[];

  /** Primary dimension that defines this type */
  primaryDimension: LoveStyleDimension;

  /** Level of the primary dimension */
  level: 'high' | 'neutral' | 'low';
}

/**
 * Determine the score level based on normalized score (0-100)
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
