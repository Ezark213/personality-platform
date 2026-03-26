/**
 * Aptitude Test Type Definitions
 *
 * 適性検査（仕事・役割診断）の型定義
 */

// ============================================================================
// Work Role Dimensions
// ============================================================================

/**
 * 仕事上の役割の次元
 * - leadership: リーダーシップ傾向
 * - analytical: 分析的傾向
 * - creative: 創造的傾向
 * - collaborative: 協調的傾向
 */
export type WorkRoleDimension =
  | 'leadership'     // リーダーシップ
  | 'analytical'     // 分析的
  | 'creative'       // 創造的
  | 'collaborative'; // 協調的

/**
 * Question for aptitude test
 */
export interface AptitudeQuestion {
  /** Sequential ID (1-20) */
  id: number;

  /** Question text (Japanese) */
  text: string;

  /** Which dimension this question belongs to */
  dimension: WorkRoleDimension;

  /** Whether this is a reversed item (true = reverse scoring) */
  reversed: boolean;
}

/**
 * User's answer to a question
 */
export interface AptitudeAnswer {
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
 * Complete Aptitude test result
 */
export interface AptitudeResult {
  /** Scores for each dimension */
  scores: {
    leadership: DimensionScore;
    analytical: DimensionScore;
    creative: DimensionScore;
    collaborative: DimensionScore;
  };

  /** Total questions answered */
  totalQuestions: number;

  /** Timestamp of completion */
  completedAt: Date;
}

/**
 * Aptitude Type classification
 */
export interface AptitudeType {
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

  /** Suitable roles */
  suitableRoles: string[];

  /** Career advice */
  advice: string[];

  /** Primary dimension that defines this type */
  primaryDimension: WorkRoleDimension;

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
