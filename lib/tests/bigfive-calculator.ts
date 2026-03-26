import type {
  BigFiveAnswer,
  BigFiveResult,
  BigFiveDimension,
  BigFiveQuestion,
  DimensionScore,
} from '@/types/bigfive'
import { getScoreLevel } from '@/types/bigfive'
import { bigFiveQuestions20 } from '@/data/tests/bigfive-questions-20'

// 現在使用中の設問セット
const bigFiveQuestions = bigFiveQuestions20

/**
 * Big Five診断結果を計算する
 *
 * スコア計算方法:
 * 1. 各回答を1-5から0-4に変換（-1する）
 * 2. 逆転項目は4-valueで変換（5→0, 4→1, 3→2, 2→3, 1→4）
 * 3. 各次元ごとに平均を計算
 * 4. 平均を0-100にスケーリング（×25）
 *
 * 参考: TIPI-J（Ten Item Personality Inventory - Japanese）
 * https://www.jstage.jst.go.jp/article/personality/21/1/21_40/_article/-char/ja
 */
export function calculateBigFiveResult(answers: BigFiveAnswer[]): BigFiveResult {
  // 質問データのマップ作成
  const questionMap = new Map<number, BigFiveQuestion>()
  bigFiveQuestions.forEach((q) => questionMap.set(q.id, q))

  // 回答データのマップ作成
  const answerMap = new Map<number, BigFiveAnswer>()
  answers.forEach((a) => answerMap.set(a.questionId, a))

  // 各次元ごとに質問をグループ化
  const dimensionGroups: Record<BigFiveDimension, number[]> = {
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: [],
  }

  bigFiveQuestions.forEach((question) => {
    dimensionGroups[question.dimension].push(question.id)
  })

  // 各次元のスコアを計算
  const scores: Record<BigFiveDimension, DimensionScore> = {} as any

  const dimensions: Array<BigFiveDimension> = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ]

  dimensions.forEach((dimension) => {
    const questionIds = dimensionGroups[dimension]
    const validAnswers: number[] = []

    questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId)
      const answer = answerMap.get(questionId)

      if (question && answer) {
        // 1-5を0-4に変換
        let normalizedValue = answer.value - 1

        // 逆転項目の処理
        if (question.reversed) {
          normalizedValue = 4 - normalizedValue
        }

        validAnswers.push(normalizedValue)
      }
    })

    // 平均を計算（0-4の範囲）
    const average = validAnswers.length > 0
      ? validAnswers.reduce((sum, val) => sum + val, 0) / validAnswers.length
      : 2

    // 0-100にスケーリング
    const normalized = Math.round(average * 25)

    scores[dimension] = {
      average: average + 1, // 1-5スケールに戻す
      normalized,
      level: getScoreLevel(normalized),
      questionCount: validAnswers.length,
    }
  })

  return {
    scores: {
      neuroticism: scores.neuroticism,
      extraversion: scores.extraversion,
      openness: scores.openness,
      agreeableness: scores.agreeableness,
      conscientiousness: scores.conscientiousness,
    },
    totalQuestions: answers.length,
    completedAt: new Date(),
  }
}

