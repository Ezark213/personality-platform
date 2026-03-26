'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loveTypes } from '@/data/tests/love-type-types';
import type { LoveType, LoveStyleDimension, LoveTypeResult } from '@/types/love-type';

// スコアから主要な次元を判定
function getPrimaryDimension(scores: LoveTypeResult['scores']): { dimension: LoveStyleDimension; level: 'high' | 'neutral' | 'low' } {
  const dimensions: LoveStyleDimension[] = ['romantic', 'practical', 'passionate', 'companionate'];

  // 最もスコアが高い次元を見つける
  let maxScore = -1;
  let primaryDimension: LoveStyleDimension = 'romantic';

  for (const dimension of dimensions) {
    const score = scores[dimension].normalized;
    if (score > maxScore) {
      maxScore = score;
      primaryDimension = dimension;
    }
  }

  const level = scores[primaryDimension].level;
  return { dimension: primaryDimension, level };
}

export default function LoveTypeResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resultType, setResultType] = useState<LoveType | null>(null);

  useEffect(() => {
    // localStorageから結果を取得
    const savedResult = localStorage.getItem('loveTypeResult');

    if (!savedResult) {
      router.push('/tests/love-type');
      return;
    }

    try {
      const parsedResult = JSON.parse(savedResult);
      setResult(parsedResult);

      // タイプ分類
      const { dimension, level } = getPrimaryDimension(parsedResult.scores);
      const typeId = `${level}-${dimension}`;
      const type = loveTypes.find(t => t.id === typeId);

      if (type) {
        setResultType(type);
      }
    } catch (err) {
      console.error('Failed to parse result:', err);
      router.push('/tests/love-type');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleShare = () => {
    if (!resultType) return;

    const shareText = `私の恋愛タイプは「${resultType.name}」でした！\n${resultType.catchphrase}\n\nあなたもやってみませんか？`;

    if (navigator.share) {
      navigator.share({
        title: '恋愛タイプ診断',
        text: shareText,
        url: window.location.origin + '/tests/love-type',
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText + '\n' + window.location.origin + '/tests/love-type');
        alert('テキストをコピーしました！');
      });
    } else {
      navigator.clipboard.writeText(shareText + '\n' + window.location.origin + '/tests/love-type');
      alert('テキストをコピーしました！');
    }
  };

  const handleRetry = () => {
    localStorage.removeItem('loveTypeResult');
    router.push('/tests/love-type');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">結果を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (!result || !resultType) {
    return null;
  }

  const dimensionNames: Record<LoveStyleDimension, string> = {
    romantic: 'ロマンティック',
    practical: '実用的',
    passionate: '情熱的',
    companionate: '友情的',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 結果カード */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              あなたの恋愛タイプ
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {resultType.name}
            </h1>
            <p className="text-xl text-gray-600">
              {resultType.catchphrase}
            </p>
          </div>

          {/* 説明 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">特徴</h2>
            <p className="text-gray-700 leading-relaxed">
              {resultType.description}
            </p>
          </div>

          {/* 強み */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">あなたの強み</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resultType.strengths.map((strength, index) => (
                <div key={index} className="bg-pink-50 rounded-lg p-4 text-center">
                  <p className="text-gray-800 font-medium">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* アドバイス */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">恋愛アドバイス</h2>
            <ul className="space-y-2">
              {resultType.advice.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* スコア詳細 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">各次元のスコア</h2>
            <div className="space-y-4">
              {(Object.keys(result.scores) as LoveStyleDimension[]).map((dimension) => {
                const score = result.scores[dimension];
                return (
                  <div key={dimension}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">
                        {dimensionNames[dimension]}
                      </span>
                      <span className="text-gray-600">
                        {score.normalized}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-pink-600 to-rose-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${score.normalized}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-200"
            >
              結果をシェア
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              もう一度診断
            </button>
          </div>
        </div>

        {/* 注意書き */}
        <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-600">
          <p className="mb-2">
            <strong>注意：</strong>この診断結果はあくまで傾向を示すものであり、あなたの恋愛スタイルを決めつけるものではありません。
          </p>
          <p>
            状況や相手によって恋愛スタイルは変化します。この結果を自己理解のきっかけとして活用してください。
          </p>
        </div>
      </div>
    </div>
  );
}
