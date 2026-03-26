import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Clerk認証ミドルウェア（Iteration-03: 認証フロー最適化）
 *
 * 保護されたルートにアクセスする際に認証が必要かどうかを判定します。
 *
 * 変更点（Iteration-03）:
 * - 診断結果ページ（/tests/*​/result）は未ログインでもアクセス可能に変更
 *   → SNS共有を促進し、バイラル導線を強化
 * - AI相談ページ（/ai-chat）をログイン必須に設定
 *   → 個別化されたAI相談体験を提供
 */

// 保護されたルートの定義
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/ai-chat(.*)',    // AI相談ページ（Iteration-03で追加）
  '/profile(.*)',
  '/settings(.*)',
  // '/tests/(.*)/result(.*)'  削除: 診断結果ページは未ログインでも閲覧可能
]);

export default clerkMiddleware(async (auth, req) => {
  // 保護されたルートの場合、認証を要求
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // マッチャー設定: 静的ファイル以外のすべてのルートに適用
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
