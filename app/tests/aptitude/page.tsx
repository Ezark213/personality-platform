'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { aptitudeQuestions } from '@/data/tests/aptitude-questions';
import type { AptitudeAnswer, WorkRoleDimension, ScoreLevel } from '@/types/aptitude';

// スコア計算関数
function calculateScores(answers: AptitudeAnswer[]) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  const dimensions: WorkRoleDimension[] = [
    'leadership',
    'analytical',
    'creative',
    'collaborative',
  ];

  const scores: Record<WorkRoleDimension, { average: number; normalized: number; level: ScoreLevel; questionCount: number }> = {} as any;

  for (const dimension of dimensions) {
    const dimensionQuestions = aptitudeQuestions.filter((q) => q.dimension === dimension);
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
    const level: ScoreLevel = normalized >= 60 ? 'high' : normalized <= 40 ? 'low' : 'neutral';

    scores[dimension] = {
      average: average + 1, // 1-5スケールに戻す
      normalized,
      level,
      questionCount: validAnswers.length,
    };
  }

  return scores;
}

export default function AptitudeTestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AptitudeAnswer[]>([]);

  const currentQuestion = aptitudeQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / aptitudeQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    // 回答を保存
    const newAnswers = [...answers, { questionId: currentQuestion.id, value }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < aptitudeQuestions.length - 1) {
      // 次の質問へ
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 全問完了 → 結果ページへ
      // スコア計算
      const calculatedScores = calculateScores(newAnswers);

      // 結果データ作成
      const resultData = {
        scores: calculatedScores,
        totalQuestions: 20,
        completedAt: new Date(),
        answers: newAnswers,
      };

      // 結果をローカルストレージに保存
      localStorage.setItem('aptitudeResult', JSON.stringify(resultData));

      // 結果ページへ遷移
      router.push('/tests/aptitude/result');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            仕事適性診断
          </h1>
          <p className="text-gray-600">
            全20問の質問にお答えください
          </p>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>質問 {currentQuestionIndex + 1} / {aptitudeQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問 */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentQuestion.text}
            </h2>
          </div>

          {/* 回答選択 */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className="w-full py-4 px-6 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center mr-4">
                    {value}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {value === 1 && '全く当てはまらない'}
                    {value === 2 && 'あまり当てはまらない'}
                    {value === 3 && 'どちらでもない'}
                    {value === 4 && 'やや当てはまる'}
                    {value === 5 && '非常に当てはまる'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          あなたに最も当てはまる回答を選択してください
        </div>
      </div>
    </div>
  );
}
