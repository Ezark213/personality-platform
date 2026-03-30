'use client';

import { useState } from 'react';

/**
 * SNS共有ボタンのプロパティ型定義
 */
export interface ShareButtonsProps {
  /** 共有テキスト（Twitter/X用） */
  shareText: string;
  /** 共有URL（LINE、クリップボード用） */
  shareUrl: string;
  /** 診断結果ID（将来的な分析用） */
  resultId: string;
}

/**
 * SNS共有ボタンコンポーネント
 *
 * BigFive診断結果を Twitter/X、LINE、クリップボードで共有できるボタンセット。
 * モバイルファースト設計で、各SNSのブランドカラーを使用。
 *
 * @example
 * ```tsx
 * <ShareButtons
 *   shareText="あなたは挑戦者タイプ\n#性格診断 https://example.com/result"
 *   shareUrl="https://example.com/tests/bigfive/result?id=abc123"
 *   resultId="abc123"
 * />
 * ```
 */
export default function ShareButtons({
  shareText,
  shareUrl,
  resultId,
}: ShareButtonsProps) {
  const [showCopyToast, setShowCopyToast] = useState(false);

  /**
   * Twitter/X共有ハンドラー
   * 新しいウィンドウでTwitterのツイート作成画面を開く
   */
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  /**
   * LINE共有ハンドラー
   * LINEの共有ダイアログを新しいウィンドウで開く
   */
  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  /**
   * クリップボードコピーハンドラー
   * URLをクリップボードにコピーし、3秒間トースト通知を表示
   */
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Twitter/X共有ボタン */}
      <button
        onClick={handleTwitterShare}
        className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
        aria-label="X (Twitter) でシェア"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X (Twitter) でシェア</span>
      </button>

      {/* LINEボタン */}
      <button
        onClick={handleLineShare}
        className="w-full bg-[#06C755] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#05b34a] transition-all flex items-center justify-center space-x-2"
        aria-label="LINEでシェア"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
        <span>LINEでシェア</span>
      </button>

      {/* URLコピーボタン */}
      <button
        onClick={handleCopyToClipboard}
        className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
        aria-label="URLをコピー"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>URLをコピー</span>
      </button>

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
  );
}
