"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mbtiQuestions, likertScale } from "@/data/tests/mbti-questions";
import { Answer } from "@/types/test";

export default function MBTITestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const currentQuestion = mbtiQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mbtiQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === mbtiQuestions.length - 1;

  const handleAnswer = (value: number) => {
    // 回答を保存
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, value },
    ];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // 最後の質問の場合、結果ページに遷移
      // 回答データをlocalStorageに一時保存
      localStorage.setItem("mbti-answers", JSON.stringify(newAnswers));
      router.push("/tests/mbti/result");
    } else {
      // 次の質問へ
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 現在の質問への既存の回答を取得
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MBTI性格診断</h1>
          <p className="text-gray-600 dark:text-gray-300">
            質問 {currentQuestionIndex + 1} / {mbtiQuestions.length}
          </p>
        </div>

        {/* 進捗バー */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問カード */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-8">
            <p className="text-xl font-semibold text-center">
              {currentQuestion.text}
            </p>
          </div>

          {/* 回答オプション */}
          <div className="space-y-3">
            {likertScale.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition duration-200 text-left ${
                  currentAnswer?.value === option.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {currentAnswer?.value === option.value && (
                    <span className="text-purple-500">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
              currentQuestionIndex === 0
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            ← 前の質問
          </button>

          {currentAnswer && (
            <button
              onClick={() => handleAnswer(currentAnswer.value)}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition duration-200"
            >
              {isLastQuestion ? "結果を見る →" : "次の質問 →"}
            </button>
          )}
        </div>

        {/* ヒント */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>💡 直感で答えてください。正解はありません。</p>
        </div>
      </div>
    </div>
  );
}
