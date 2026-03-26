'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BigFiveDimension, BigFiveResult, BigFiveType } from '@/types/bigfive';
import { classifyType } from '@/lib/tests/bigfive-type-classifier';
import { generateShareText } from '@/lib/tests/bigfive-share-text';
import { decodeResultData } from '@/lib/utils/result-storage';
import { ResultAuthCTA } from '@/components/tests/ResultAuthCTA';

function BigFiveResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<BigFiveResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareText, setShareText] = useState('');
  const [resultType, setResultType] = useState<BigFiveType | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  useEffect(() => {
    // URLパラメータからデータ取得
    const data = searchParams.get('data');
    const id = searchParams.get('id');

    if (!data || !id) {
      setError('診断結果が見つかりません');
      setLoading(false);
      return;
    }

    try {
      // Base64デコードして完全な結果を取得
      const resultData = decodeResultData(data);
      setResult(resultData.result);

      // タイプ分類
      const type = classifyType(resultData.result);
      setResultType(type);

      // 共有テキスト生成
      const text = generateShareText(type, window.location.href);
      setShareText(text);
    } catch (err) {
      console.error('Failed to decode result:', err);
      setError('診断結果の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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

  if (!result || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || '診断結果が見つかりません'}</p>
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
            const data = result.scores[dim.key];
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

        {/* AI Consultation CTA (Iteration-03) */}
        <ResultAuthCTA redirectUrl={typeof window !== 'undefined' ? window.location.href : undefined} />

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

        {/* Share Section */}
        {resultType && (
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                診断結果をシェア
              </h2>

              {/* カードプレビュー */}
              <div className="mb-8">
                <div className="max-w-md mx-auto">
                  <img
                    src={`/api/og/bigfive/card/${searchParams.get('id')}?data=${searchParams.get('data')}`}
                    alt="診断結果カード"
                    className="w-full rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* シェアボタン */}
              <div className="space-y-4">
                {/* Twitter/X共有 */}
                <button
                  onClick={() => {
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter) でシェア</span>
                </button>

                {/* Instagram共有ガイド */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">Instagram ストーリーズでシェア</h3>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. 上のカード画像を長押しして保存</li>
                        <li>2. Instagramアプリを開く</li>
                        <li>3. ストーリーズで保存した画像を投稿</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* URLコピー */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                      setShowCopyToast(true);
                      setTimeout(() => setShowCopyToast(false), 3000);
                    });
                  }}
                  className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>URLをコピー</span>
                </button>
              </div>

              {/* コピー完了トースト */}
              {showCopyToast && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in z-50">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>URLをコピーしました</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BigFiveResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">結果を読み込み中...</p>
        </div>
      </div>
    }>
      <BigFiveResultContent />
    </Suspense>
  );
}
