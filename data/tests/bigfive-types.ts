/**
 * BigFive Personality Type Definitions
 *
 * This file defines 15 personality types based on BigFive dimensions.
 * Each type is classified by the most prominent dimension (high/neutral/low).
 *
 * Classification strategy:
 * - 5 dimensions × 3 levels (high/neutral/low) = 15 types
 * - High: normalized score >= 65
 * - Neutral: 35 < normalized score < 65
 * - Low: normalized score <= 35
 */

import type { BigFiveDimension } from '@/types/bigfive'

export interface BigFiveType {
  /** Unique identifier */
  id: string

  /** Type name (Japanese) */
  name: string

  /** Catchphrase describing the type */
  catchphrase: string

  /** Three key strengths */
  strengths: string[]

  /** Detailed description */
  description: string

  /** Primary dimension that defines this type */
  primaryDimension: BigFiveDimension

  /** Level of the primary dimension */
  level: 'high' | 'neutral' | 'low'
}

export const bigFiveTypes: BigFiveType[] = [
  // ============================================================================
  // Neuroticism (神経症傾向)
  // ============================================================================
  {
    id: 'high-neuroticism',
    name: '感受性豊かな共感者',
    catchphrase: '心の声に耳を傾ける',
    strengths: [
      '感情への深い洞察力',
      '他者の気持ちへの共感',
      'リスクへの慎重な対応'
    ],
    description: '感情に敏感で、自分や他者の心の動きを深く理解できる。ストレスを感じやすい一方、その感受性が創造性や共感力の源となる。',
    primaryDimension: 'neuroticism',
    level: 'high'
  },
  {
    id: 'neutral-neuroticism',
    name: 'バランス型の調整者',
    catchphrase: '冷静さと情熱の両立',
    strengths: [
      '柔軟な感情コントロール',
      '状況に応じた対応力',
      '安定した判断力'
    ],
    description: '感情と理性のバランスが取れており、状況に応じて適切に対応できる。過度なストレスを避けつつ、必要な時には感情を表現できる。',
    primaryDimension: 'neuroticism',
    level: 'neutral'
  },
  {
    id: 'low-neuroticism',
    name: '揺るがない楽観主義者',
    catchphrase: 'どんな時も前を向く',
    strengths: [
      '高いストレス耐性',
      'ポジティブ思考',
      '困難な状況でも冷静'
    ],
    description: 'ストレスに強く、感情的に安定している。困難な状況でも冷静さを保ち、楽観的に物事を捉えることができる。',
    primaryDimension: 'neuroticism',
    level: 'low'
  },

  // ============================================================================
  // Extraversion (外向性)
  // ============================================================================
  {
    id: 'high-extraversion',
    name: '社交的なリーダー',
    catchphrase: '人と共に成長する',
    strengths: [
      'コミュニケーション力',
      'チームワーク',
      'ポジティブな影響力'
    ],
    description: '人との交流からエネルギーを得て、積極的に人間関係を築く。リーダーシップを発揮し、チームを明るく活気づけることができる。',
    primaryDimension: 'extraversion',
    level: 'high'
  },
  {
    id: 'neutral-extraversion',
    name: '柔軟な交流者',
    catchphrase: '一人も、みんなも大切に',
    strengths: [
      '状況適応力',
      '自己・他者理解のバランス',
      '多様な環境への適応'
    ],
    description: '一人の時間も人との交流も両方楽しめる。状況に応じて社交的にも内省的にもなれる柔軟性を持つ。',
    primaryDimension: 'extraversion',
    level: 'neutral'
  },
  {
    id: 'low-extraversion',
    name: '内省的な思考家',
    catchphrase: '深く考え、静かに行動する',
    strengths: [
      '集中力',
      '分析力',
      '独立性'
    ],
    description: '一人の時間を大切にし、内省を通じて深い洞察を得る。少人数での深い関係を好み、独立して物事を進める力がある。',
    primaryDimension: 'extraversion',
    level: 'low'
  },

  // ============================================================================
  // Openness (開放性)
  // ============================================================================
  {
    id: 'high-openness',
    name: '創造的な探究者',
    catchphrase: '新しい世界を切り拓く',
    strengths: [
      '創造性',
      '知的好奇心',
      '柔軟な思考'
    ],
    description: '新しいアイデアや経験に開かれており、創造的な活動を楽しむ。固定観念にとらわれず、革新的な解決策を見出すことができる。',
    primaryDimension: 'openness',
    level: 'high'
  },
  {
    id: 'neutral-openness',
    name: '現実的な革新者',
    catchphrase: '伝統と革新の架け橋',
    strengths: [
      '実用的な創造性',
      '経験と新規のバランス',
      '安定した挑戦'
    ],
    description: '新しいことにも挑戦しつつ、実用性や現実性も重視する。伝統と革新のバランスを取りながら前進できる。',
    primaryDimension: 'openness',
    level: 'neutral'
  },
  {
    id: 'low-openness',
    name: '実践的な専門家',
    catchphrase: '確実性を重んじる',
    strengths: [
      '実務能力',
      '確実な遂行力',
      '伝統の尊重'
    ],
    description: '実用的で具体的なアプローチを好み、確立された方法を尊重する。専門分野での深い知識と確実な実行力を持つ。',
    primaryDimension: 'openness',
    level: 'low'
  },

  // ============================================================================
  // Agreeableness (協調性)
  // ============================================================================
  {
    id: 'high-agreeableness',
    name: '温かい調和の創り手',
    catchphrase: '思いやりで人をつなぐ',
    strengths: [
      '共感力',
      '協力性',
      '信頼を築く力'
    ],
    description: '他者への思いやりが深く、調和を重視する。人々の間に信頼関係を築き、協力的な環境を作り出すことができる。',
    primaryDimension: 'agreeableness',
    level: 'high'
  },
  {
    id: 'neutral-agreeableness',
    name: '現実的な協力者',
    catchphrase: '協調と主張のバランス',
    strengths: [
      '適切な自己主張',
      '状況判断力',
      '実務的な協力'
    ],
    description: '協調性と自己主張のバランスが取れており、状況に応じて適切に対応できる。必要な時には譲り、重要な時には主張できる。',
    primaryDimension: 'agreeableness',
    level: 'neutral'
  },
  {
    id: 'low-agreeableness',
    name: '率直な挑戦者',
    catchphrase: '本音で勝負する',
    strengths: [
      '率直なコミュニケーション',
      '論理的思考',
      '競争力'
    ],
    description: '率直で正直なコミュニケーションを重視し、必要な時には対立も辞さない。論理的に物事を判断し、競争環境で力を発揮する。',
    primaryDimension: 'agreeableness',
    level: 'low'
  },

  // ============================================================================
  // Conscientiousness (誠実性)
  // ============================================================================
  {
    id: 'high-conscientiousness',
    name: '計画的な達成者',
    catchphrase: '目標に向かって着実に',
    strengths: [
      '計画性',
      '責任感',
      '自己管理能力'
    ],
    description: '目標に向けて計画的に行動し、責任感が強い。細部にまで注意を払い、高い品質で仕事を完遂することができる。',
    primaryDimension: 'conscientiousness',
    level: 'high'
  },
  {
    id: 'neutral-conscientiousness',
    name: '適応的な実行者',
    catchphrase: '計画と柔軟性の両立',
    strengths: [
      '柔軟な計画力',
      'バランス感覚',
      '適応的な遂行力'
    ],
    description: '計画性と柔軟性のバランスが取れており、状況に応じて適応できる。完璧主義に陥らず、実用的な成果を出すことができる。',
    primaryDimension: 'conscientiousness',
    level: 'neutral'
  },
  {
    id: 'low-conscientiousness',
    name: '自由な即興家',
    catchphrase: '流れに身を任せる',
    strengths: [
      '柔軟性',
      '即興対応力',
      '自由な発想'
    ],
    description: '柔軟で自発的なアプローチを好み、即興的に対応する力がある。固定的な計画にとらわれず、状況に応じて自由に行動できる。',
    primaryDimension: 'conscientiousness',
    level: 'low'
  }
]

/**
 * Helper function to get a type by ID
 */
export function getTypeById(id: string): BigFiveType | undefined {
  return bigFiveTypes.find(type => type.id === id)
}

/**
 * Helper function to get all types for a specific dimension
 */
export function getTypesByDimension(dimension: BigFiveDimension): BigFiveType[] {
  return bigFiveTypes.filter(type => type.primaryDimension === dimension)
}
