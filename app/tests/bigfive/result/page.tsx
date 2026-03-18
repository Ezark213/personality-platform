'use client';

import { useEffect, useState } from 'react';
import { bigFiveQuestions20 } from '@/data/tests/bigfive-questions-20';
import type { BigFiveAnswer, BigFiveDimension } from '@/types/bigfive';

// 簡易的なスコア計算関数（20問版用）
function calculateScores(answers: BigFiveAnswer[]) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  const dimensions: BigFiveDimension[] = [
    'neuroticism',
    'extraversion',
    'openness',
    'agreeableness',
    'conscientiousness',
  ];

  const scores: Record<BigFiveDimension, { average: number; normalized: number; level: string; questionCount: number }> = {} as any;

  for (const dimension of dimensions) {
    const dimensionQuestions = bigFiveQuestions20.filter((q) => q.dimension === dimension);
    const validAnswers: number[] = [];

    for (const question of dimensionQuestions) {
      const answerValue = answerMap.get(question.id);
      if (answerValue !== undefined) {
        // 1-5を0-4に変換
        let normalizedValue = answerValue - 1;

        // 逆転項目の処理
        if (question.reversed) {
          normalizedValue = 4 - normalizedValue;
        }

        validAnswers.push(normalizedValue);
      }
    }

    // 平均を計算（0-4の範囲）
    const average = validAnswers.length > 0
      ? validAnswers.reduce((sum, val) => sum + val, 0) / validAnswers.length
      : 2;

    // 0-100にスケーリング
    const normalized = Math.round(average * 25);

    // レベル判定
    const level = normalized >= 60 ? 'high' : normalized <= 40 ? 'low' : 'neutral';

    scores[dimension] = {
      average: average + 1, // 1-5スケールに戻す
      normalized,
      level,
      questionCount: validAnswers.length,
    };
  }

  return scores;
}

export default function BigFiveResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorageから回答を取得
    const answersJson = sessionStorage.getItem('bigfive-answers');
    if (answersJson) {
      const answers: BigFiveAnswer[] = JSON.parse(answersJson);
      const calculatedScores = calculateScores(answers);
      setResult(calculatedScores);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">結果を計算中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">診断結果が見つかりません</p>
          <a
            href="/tests/bigfive"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            診断を受ける
          </a>
        </div>
      </div>
    );
  }

  const dimensions = [
    {
      key: 'neuroticism' as BigFiveDimension,
      name: '神経症傾向',
      emoji: '😰',
      description: 'ストレスや不安への感じやすさを表します。',
      highDescription: '感情的で繊細、ストレスに敏感',
      lowDescription: '落ち着いていて安定、ストレスに強い',
    },
    {
      key: 'extraversion' as BigFiveDimension,
      name: '外向性',
      emoji: '🎉',
      description: '社交性や活発さの程度を表します。',
      highDescription: '社交的で活発、刺激を求める',
      lowDescription: '内向的で静か、独りを好む',
    },
    {
      key: 'openness' as BigFiveDimension,
      name: '開放性',
      emoji: '🎨',
      description: '新しい経験や知的好奇心の度合いを表します。',
      highDescription: '想像力豊かで新しいことに興味',
      lowDescription: '現実的で伝統を重視',
    },
    {
      key: 'agreeableness' as BigFiveDimension,
      name: '協調性',
      emoji: '🤝',
      description: '他者への思いやりや協力的態度を表します。',
      highDescription: '思いやりがあり協力的',
      lowDescription: '競争的で主張が強い',
    },
    {
      key: 'conscientiousness' as BigFiveDimension,
      name: '誠実性',
      emoji: '📋',
      description: '計画性や責任感の強さを表します。',
      highDescription: '計画的で責任感が強い',
      lowDescription: '柔軟で自発的',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            診断結果
          </h1>
          <p className="text-gray-600">
            あなたのBigFive性格特性プロフィール
          </p>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {dimensions.map((dim) => {
            const data = result[dim.key];
            const levelColor =
              data.level === 'high'
                ? 'bg-red-100 text-red-800'
                : data.level === 'low'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800';

            return (
              <div
                key={dim.key}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{dim.emoji}</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {dim.name}
                      </h2>
                      <p className="text-sm text-gray-600">{dim.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${levelColor}`}>
                    {data.level === 'high' ? '高い' : data.level === 'low' ? '低い' : '中程度'}
                  </span>
                </div>

                {/* スコアバー */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>スコア: {data.average.toFixed(2)} / 5.00</span>
                    <span>{data.normalized} / 100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        data.level === 'high'
                          ? 'bg-gradient-to-r from-red-400 to-red-600'
                          : data.level === 'low'
                          ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                          : 'bg-gradient-to-r from-gray-400 to-gray-600'
                      }`}
                      style={{ width: `${data.normalized}%` }}
                    />
                  </div>
                </div>

                {/* 説明 */}
                <p className="text-gray-700 text-sm">
                  {data.level === 'high' ? dim.highDescription : dim.lowDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center space-y-4">
          <button
            onClick={() => {
              sessionStorage.removeItem('bigfive-answers');
              window.location.href = '/tests/bigfive';
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
