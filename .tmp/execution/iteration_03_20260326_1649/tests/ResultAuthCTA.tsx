'use client';

import { useUser, SignInButton } from '@clerk/nextjs';

/**
 * ResultAuthCTA - 診断結果ページ用のログインCTAコンポーネント
 *
 * Iteration-03で追加:
 * - 未ログインユーザー: 「結果を保存してAI相談を始める」ボタン（ログイン促進）
 * - ログイン済みユーザー: 「AI相談を始める」ボタン（/ai-chatへ遷移）
 *
 * @param {string} redirectUrl - ログイン後に戻るURL（デフォルト: 現在のページ）
 */

interface ResultAuthCTAProps {
  redirectUrl?: string;
}

export function ResultAuthCTA({ redirectUrl }: ResultAuthCTAProps) {
  const { isSignedIn, isLoaded } = useUser();

  // Clerkのロード中は何も表示しない
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-8">
        <div className="text-center">
          {/* 未ログイン時 */}
          {!isSignedIn && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                🤖 AI相談で性格を深掘り
              </h2>
              <p className="text-gray-600 mb-6">
                あなたの性格診断結果をもとに、AIがキャリアの悩みに寄り添います。
                <br />
                ログインして、診断結果を保存し、AI相談を始めましょう。
              </p>
              <SignInButton
                mode="modal"
                forceRedirectUrl={redirectUrl || (typeof window !== 'undefined' ? window.location.href : '/')}
              >
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  結果を保存してAI相談を始める
                </button>
              </SignInButton>
              <p className="text-xs text-gray-500 mt-3">
                ログイン後、この結果ページに戻ります
              </p>
            </>
          )}

          {/* ログイン済み時 */}
          {isSignedIn && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                🤖 AI相談を始めましょう
              </h2>
              <p className="text-gray-600 mb-6">
                あなたの性格診断結果をもとに、AIがキャリアの悩みに寄り添います。
              </p>
              <a
                href="/ai-chat"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                AI相談を始める
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
