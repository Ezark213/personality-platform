"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Answer, MBTIResult } from "@/types/test";
import { calculateMBTIResult, mbtiDescriptions } from "@/lib/tests/mbti-calculator";

export default function MBTIResultPage() {
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorageから回答を取得
    const savedAnswers = localStorage.getItem("mbti-answers");
    if (savedAnswers) {
      const answers: Answer[] = JSON.parse(savedAnswers);
      const mbtiResult = calculateMBTIResult(answers);
      setResult(mbtiResult);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">結果を計算中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="mb-4">診断結果が見つかりませんでした。</p>
          <Link
            href="/tests/mbti"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            診断をやり直す
          </Link>
        </div>
      </div>
    );
  }

  const description = mbtiDescriptions[result.type];

  // シェア機能
  const handleShare = () => {
    const text = `私のMBTIタイプは${result.type}（${description.name}）でした！ #PersonalityPlatform`;
    if (navigator.share) {
      navigator.share({
        title: "MBTI診断結果",
        text: text,
        url: window.location.href,
      });
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(text + " " + window.location.href);
      alert("結果をクリップボードにコピーしました！");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* 結果ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-6xl font-bold py-6 px-12 rounded-2xl shadow-2xl mb-6">
            {result.type}
          </div>
          <h1 className="text-4xl font-bold mb-2">{description.name}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {description.nickname}
          </p>
        </div>

        {/* 性格の説明 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">あなたの性格</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {description.description}
          </p>
        </div>

        {/* 各軸のスコア */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">性格の傾向</h2>
          <div className="space-y-6">
            {Object.entries(result.dimensions).map(([key, data]) => {
              const labels: Record<string, [string, string]> = {
                EI: ["外向型 (E)", "内向型 (I)"],
                SN: ["感覚型 (S)", "直観型 (N)"],
                TF: ["思考型 (T)", "感情型 (F)"],
                JP: ["判断型 (J)", "知覚型 (P)"],
              };
              const [leftLabel, rightLabel] = labels[key];
              const percentage = ((data.score + 20) / 40) * 100; // -20〜+20を0〜100%に変換

              return (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{leftLabel}</span>
                    <span className="font-semibold">{rightLabel}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {data.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 強みと弱み */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
              ✨ 強み
            </h2>
            <ul className="space-y-2">
              {description.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">
              🔍 改善点
            </h2>
            <ul className="space-y-2">
              {description.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* おすすめのキャリア */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">💼 おすすめのキャリア</h2>
          <div className="flex flex-wrap gap-3">
            {description.careers.map((career, index) => (
              <span
                key={index}
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full"
              >
                {career}
              </span>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleShare}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition duration-200"
          >
            📤 結果をシェア
          </button>
          <Link
            href="/tests"
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-teal-600 transition duration-200 text-center"
          >
            🧪 他の診断を受ける
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold rounded-lg transition duration-200 text-center"
          >
            🏠 ホームへ戻る
          </Link>
        </div>

        {/* AI相談の予告 */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">🤖 AI相談機能（近日公開）</h3>
          <p className="mb-4">
            あなたの診断結果をAIが詳しく分析し、パーソナライズされたアドバイスを提供します。
          </p>
          <button
            disabled
            className="bg-white/20 text-white px-6 py-2 rounded-lg cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
