'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bigFiveQuestions20 } from '@/data/tests/bigfive-questions-20';
import type { BigFiveAnswer } from '@/types/bigfive';

export default function BigFiveTestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<BigFiveAnswer[]>([]);

  const currentQuestion = bigFiveQuestions20[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / bigFiveQuestions20.length) * 100;

  const handleAnswer = (value: number) => {
    // 回答を保存
    const newAnswers = [...answers, { questionId: currentQuestion.id, value }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < bigFiveQuestions20.length - 1) {
      // 次の質問へ
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 全問完了 → 結果ページへ
      // answersをsessionStorageに保存
      sessionStorage.setItem('bigfive-answers', JSON.stringify(newAnswers));
      router.push('/tests/bigfive/result');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            BigFive性格診断
          </h1>
          <p className="text-gray-600">
            全20問の質問にお答えください
          </p>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>質問 {currentQuestionIndex + 1} / {bigFiveQuestions20.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問 */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6">
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
                className="w-full py-4 px-6 text-left border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center mr-4">
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
