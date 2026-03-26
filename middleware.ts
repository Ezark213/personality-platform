import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Clerk認証ミドルウェア
 *
 * 保護されたルート（/dashboard, /tests/results など）にアクセスする際に、
 * 認証が必要かどうかを判定します。
 *
 * Portfolio Wise風のログインフローを実現するため、
 * 未認証ユーザーは自動的にログインページにリダイレクトされます。
 */

// 保護されたルートの定義
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/tests/(.*)/result(.*)', // 診断結果ページ
  '/profile(.*)',
  '/settings(.*)',
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
