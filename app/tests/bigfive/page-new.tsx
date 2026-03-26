'use client';

import Link from 'next/link';

export default function BigFiveSelectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            BigFive性格診断
          </h1>
          <p className="text-gray-600 text-lg">
            あなたの性格特性を科学的に分析します
          </p>
          <p className="text-gray-500 mt-2">
            診断のバージョンを選択してください
          </p>
        </div>

        {/* Version Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 簡易版 */}
          <Link href="/tests/bigfive/short" className="block group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  簡易版
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                クイック診断
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>全20問</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>所要時間: 約5分</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                手軽にあなたの性格傾向を把握できます。初めての方や時間がない方におすすめです。
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800 font-medium">
                  ✓ 5つの性格特性を測定<br />
                  ✓ 各次元4問で簡潔に診断<br />
                  ✓ すぐに結果が分かる
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                始める
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 詳細版 */}
          <Link href="/tests/bigfive/detail" className="block group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-full border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                  詳細版
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                精密診断
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>全120問</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>所要時間: 約15-20分</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                より詳細かつ正確な性格分析が可能です。じっくり自己理解を深めたい方におすすめです。
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-sm text-purple-800 font-medium">
                  ✓ 30のファセットを詳細分析<br />
                  ✓ より正確な性格プロフィール<br />
                  ✓ 科学的根拠に基づく診断
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                始める
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">BigFive性格診断とは？</h3>
          <p className="text-gray-600 mb-4">
            BigFive（ビッグファイブ）は、心理学で最も信頼性の高い性格分析モデルです。
            以下の5つの次元であなたの性格を測定します:
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">😰</div>
              <div className="font-semibold text-gray-800 text-sm">神経症傾向</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-semibold text-gray-800 text-sm">外向性</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold text-gray-800 text-sm">開放性</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🤝</div>
              <div className="font-semibold text-gray-800 text-sm">協調性</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold text-gray-800 text-sm">誠実性</div>
            </div>
          </div>
        </div>

        {/* Back to Tests */}
        <div className="mt-8 text-center">
          <Link
            href="/tests"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← 診断一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
