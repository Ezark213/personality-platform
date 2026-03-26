'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

/**
 * MobileMenuコンポーネント
 *
 * Portfolio Wise風のモバイルメニュー（ハンバーガーメニュー）。
 * レスポンシブデザインの一環として、モバイルビューで表示されます。
 *
 * 機能:
 * - ハンバーガーアイコンボタン
 * - スライドインアニメーション
 * - ナビゲーションリンク
 * - 認証ボタン（ログイン/ダッシュボード）
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* ハンバーガーボタン */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        aria-label="メニューを開く"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // 閉じるアイコン (X)
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // ハンバーガーアイコン
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* モバイルメニュー */}
      <div
        className={`
          fixed top-16 right-0 bottom-0 w-64 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <nav className="flex flex-col p-6 space-y-6">
          {/* ナビゲーションリンク */}
          <Link
            href="#features"
            onClick={closeMenu}
            className="text-base font-medium text-gray-700 hover:text-primary-600 transition"
          >
            機能
          </Link>
          <Link
            href="#pricing"
            onClick={closeMenu}
            className="text-base font-medium text-gray-700 hover:text-primary-600 transition"
          >
            価格
          </Link>
          <Link
            href="/blog"
            onClick={closeMenu}
            className="text-base font-medium text-gray-700 hover:text-primary-600 transition"
          >
            ブログ
          </Link>

          {/* 区切り線 */}
          <div className="border-t border-gray-200" />

          {/* 認証ボタン */}
          {isSignedIn ? (
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              ダッシュボード
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition"
              >
                ログイン
              </Link>
              <Link
                href="/sign-up"
                onClick={closeMenu}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                無料で始める
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
