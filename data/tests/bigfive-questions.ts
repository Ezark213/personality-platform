import type { BigFiveQuestion } from '@/types/bigfive'

/**
 * Big Five短縮版質問データ（20問）
 *
 * 参考: TIPI-J（Ten Item Personality Inventory - Japanese）を拡張
 * 各次元4問（正転2問、逆転2問）で構成
 *
 * 回答形式: 1（全く当てはまらない）〜 5（非常に当てはまる）
 */
export const bigFiveQuestions: BigFiveQuestion[] = [
  // 外向性 (Extraversion) - 4問
  {
    id: 1,
    text: '初対面の人とでも気軽に話せる',
    dimension: 'extraversion',
    reversed: false,
    facet: 1,
  },
  {
    id: 2,
    text: '大勢の中にいると疲れてしまう',
    dimension: 'extraversion',
    reversed: true,
    facet: 1,
  },
  {
    id: 3,
    text: '積極的に人と関わることが好きだ',
    dimension: 'extraversion',
    reversed: false,
    facet: 2,
  },
  {
    id: 4,
    text: '一人で過ごす時間を大切にしている',
    dimension: 'extraversion',
    reversed: true,
    facet: 2,
  },

  // 協調性 (Agreeableness) - 4問
  {
    id: 5,
    text: '他人の気持ちを理解しようと努める',
    dimension: 'agreeableness',
    reversed: false,
    facet: 1,
  },
  {
    id: 6,
    text: '人と意見が対立することが多い',
    dimension: 'agreeableness',
    reversed: true,
    facet: 1,
  },
  {
    id: 7,
    text: '困っている人を見ると助けたくなる',
    dimension: 'agreeableness',
    reversed: false,
    facet: 2,
  },
  {
    id: 8,
    text: '自分の意見を曲げないことが多い',
    dimension: 'agreeableness',
    reversed: true,
    facet: 2,
  },

  // 誠実性 (Conscientiousness) - 4問
  {
    id: 9,
    text: '計画を立てて物事を進めることが多い',
    dimension: 'conscientiousness',
    reversed: false,
    facet: 1,
  },
  {
    id: 10,
    text: '締め切りギリギリまで手をつけないことがある',
    dimension: 'conscientiousness',
    reversed: true,
    facet: 1,
  },
  {
    id: 11,
    text: '約束や期限はきちんと守る',
    dimension: 'conscientiousness',
    reversed: false,
    facet: 2,
  },
  {
    id: 12,
    text: '整理整頓が苦手だ',
    dimension: 'conscientiousness',
    reversed: true,
    facet: 2,
  },

  // 神経症傾向 (Neuroticism) - 4問
  {
    id: 13,
    text: '小さなことで不安になることがある',
    dimension: 'neuroticism',
    reversed: false,
    facet: 1,
  },
  {
    id: 14,
    text: 'ストレスを感じてもすぐに立ち直れる',
    dimension: 'neuroticism',
    reversed: true,
    facet: 1,
  },
  {
    id: 15,
    text: '心配性だと思う',
    dimension: 'neuroticism',
    reversed: false,
    facet: 2,
  },
  {
    id: 16,
    text: '気分の浮き沈みが少ない',
    dimension: 'neuroticism',
    reversed: true,
    facet: 2,
  },

  // 開放性 (Openness) - 4問
  {
    id: 17,
    text: '新しいことに挑戦するのが好きだ',
    dimension: 'openness',
    reversed: false,
    facet: 1,
  },
  {
    id: 18,
    text: '慣れ親しんだやり方を変えたくない',
    dimension: 'openness',
    reversed: true,
    facet: 1,
  },
  {
    id: 19,
    text: '芸術や文化に興味がある',
    dimension: 'openness',
    reversed: false,
    facet: 2,
  },
  {
    id: 20,
    text: '抽象的な議論よりも具体的な話が好きだ',
    dimension: 'openness',
    reversed: true,
    facet: 2,
  },
]

/**
 * 質問データのバリデーション
 */
export function validateQuestions(): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 質問数チェック（20-30問）
  if (bigFiveQuestions.length < 20 || bigFiveQuestions.length > 30) {
    errors.push(
      `質問数が範囲外です（現在: ${bigFiveQuestions.length}、期待: 20-30問）`
    )
  }

  // 各次元の質問数をカウント
  const dimensionCounts: Record<string, number> = {}
  const dimensions = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']

  dimensions.forEach((dim) => {
    dimensionCounts[dim] = bigFiveQuestions.filter((q) => q.dimension === dim).length
  })

  // 各次元4-6問であることを確認
  Object.entries(dimensionCounts).forEach(([dimension, count]) => {
    if (count < 4 || count > 6) {
      errors.push(
        `${dimension}の質問数が範囲外です（現在: ${count}、期待: 4-6問）`
      )
    }
  })

  // IDの一意性チェック
  const ids = bigFiveQuestions.map((q) => q.id)
  const uniqueIds = new Set(ids)
  if (ids.length !== uniqueIds.size) {
    errors.push('質問IDが重複しています')
  }

  // 必須フィールドのチェック
  bigFiveQuestions.forEach((q) => {
    if (!q.id || !q.text || !q.dimension || q.reversed === undefined) {
      errors.push(`質問ID ${q.id}に必須フィールドが不足しています`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
