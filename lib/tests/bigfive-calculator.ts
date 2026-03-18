import type {
  BigFiveAnswer,
  BigFiveResult,
  BigFiveScores,
  BigFiveDimension,
  BigFiveDimensionDetail,
  BigFiveQuestion,
} from '@/types/bigfive'
import { getScoreLevel } from '@/types/bigfive'
import { bigFiveQuestions } from '@/data/tests/bigfive-questions'

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
  const scores: BigFiveScores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  }

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
    if (validAnswers.length > 0) {
      const average = validAnswers.reduce((sum, val) => sum + val, 0) / validAnswers.length

      // 0-100にスケーリング
      scores[dimension] = Math.round(average * 25)
    } else {
      // 回答がない場合は中間値
      scores[dimension] = 50
    }
  })

  // 各次元の詳細情報を作成
  const details = {
    openness: createDimensionDetail('openness', scores.openness),
    conscientiousness: createDimensionDetail('conscientiousness', scores.conscientiousness),
    extraversion: createDimensionDetail('extraversion', scores.extraversion),
    agreeableness: createDimensionDetail('agreeableness', scores.agreeableness),
    neuroticism: createDimensionDetail('neuroticism', scores.neuroticism),
  }

  return {
    takenAt: new Date(),
    scores,
    details,
  }
}

/**
 * 次元の詳細情報を作成
 */
function createDimensionDetail(
  dimension: BigFiveDimension,
  score: number
): BigFiveDimensionDetail {
  const level = getScoreLevel(score)

  const dimensionData = getDimensionData(dimension)

  return {
    name: dimensionData.name,
    score,
    level,
    description: dimensionData.description,
    highTraits: dimensionData.highTraits,
    lowTraits: dimensionData.lowTraits,
  }
}

/**
 * 各次元の説明データ
 */
function getDimensionData(dimension: BigFiveDimension) {
  const data: Record<
    BigFiveDimension,
    {
      name: string
      description: string
      highTraits: string[]
      lowTraits: string[]
    }
  > = {
    openness: {
      name: '開放性',
      description: '新しい経験や知的好奇心への開放度',
      highTraits: [
        '想像力が豊か',
        '新しいアイデアに興味がある',
        '芸術や美に敏感',
        '多様な経験を求める',
        '抽象的思考が得意',
      ],
      lowTraits: [
        '実用的で現実的',
        '慣れ親しんだものを好む',
        '伝統や習慣を重んじる',
        '具体的思考が得意',
        '安定を好む',
      ],
    },
    conscientiousness: {
      name: '誠実性',
      description: '計画性や自己統制の程度',
      highTraits: [
        '計画的で組織的',
        '責任感が強い',
        '目標達成に向けて努力する',
        '細部に注意を払う',
        '時間管理が得意',
      ],
      lowTraits: [
        '柔軟で即興的',
        '自発的に行動する',
        'リラックスしている',
        '大まかに物事を捉える',
        '変化に適応しやすい',
      ],
    },
    extraversion: {
      name: '外向性',
      description: '社交性や活動性の程度',
      highTraits: [
        '社交的で人と関わることを好む',
        'エネルギッシュで活動的',
        '注目を集めることを楽しむ',
        '感情を表現しやすい',
        'グループ活動を好む',
      ],
      lowTraits: [
        '内省的で一人の時間を大切にする',
        '少人数での交流を好む',
        '静かな環境を好む',
        '慎重に考えてから行動する',
        '深い関係を重視する',
      ],
    },
    agreeableness: {
      name: '協調性',
      description: '思いやりや協力性の程度',
      highTraits: [
        '思いやりがあり親切',
        '協力的で助け合う',
        '他人を信頼する',
        '対立を避ける',
        '共感力が高い',
      ],
      lowTraits: [
        '批判的で分析的',
        '自己主張が強い',
        '独立心が強い',
        '競争的',
        '客観的に判断する',
      ],
    },
    neuroticism: {
      name: '神経症傾向',
      description: '情緒の安定性（低いほど安定）',
      highTraits: [
        'ストレスを感じやすい',
        '心配性',
        '感情の波がある',
        '不安になりやすい',
        '敏感で繊細',
      ],
      lowTraits: [
        '情緒が安定している',
        'ストレスに強い',
        '落ち着いている',
        '楽観的',
        'リラックスしている',
      ],
    },
  }

  return data[dimension]
}
