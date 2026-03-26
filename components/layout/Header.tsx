import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { MobileMenu } from './MobileMenu';

/**
 * Headerコンポーネント
 *
 * Portfolio Wise風のクリーンなヘッダーデザイン。
 * 認証状態に応じてログインボタンまたはユーザーメニューを表示します。
 * レスポンシブデザイン対応（モバイルメニュー付き）。
 *
 * 構成:
 * - 左: ロゴ
 * - 中央: ナビゲーション（機能、価格、ブログ） - デスクトップのみ
 * - 右:
 *   - デスクトップ: ログインボタン（未認証時）/ ユーザーボタン（認証時）
 *   - モバイル: ハンバーガーメニュー
 */
export async function Header() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline-block">
              Personality Platform
            </span>
          </Link>
        </div>

        {/* ナビゲーション（デスクトップ） */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            機能
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            価格
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            ブログ
          </Link>
        </nav>

        {/* 認証ボタン（デスクトップ） */}
        <div className="hidden md:flex items-center space-x-4">
          {userId ? (
            // 認証済み: ユーザーボタン
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                ダッシュボード
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          ) : (
            // 未認証: ログインボタン
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                  ログイン
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 transition"
              >
                無料で始める
              </Link>
            </div>
          )}
        </div>

        {/* モバイルメニュー */}
        <MobileMenu />
      </div>
    </header>
  );
}
