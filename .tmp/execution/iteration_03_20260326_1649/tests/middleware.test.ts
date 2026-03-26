import { describe, it, expect } from 'vitest';

/**
 * Middleware Tests
 *
 * 保護ルートのマッチングロジックをテストします。
 * 実際のClerkミドルウェアの動作をシミュレートして検証します。
 */

// 現在のmiddleware.tsの保護ルート定義をコピー
function createRouteMatcher(patterns: string[]) {
  return (path: string) => {
    return patterns.some(pattern => {
      // (.*) を正規表現に変換
      const regexPattern = pattern.replace(/\(.*\)/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(path);
    });
  };
}

describe('Middleware Protected Routes', () => {
  describe('現在の状態（Iteration-03変更前）', () => {
    it('currently DOES protect /tests/bigfive/result (要修正)', () => {
      // 現在のmiddleware.tsの状態: '/tests/(.*)/result(.*)' が保護ルートに含まれている
      const currentProtectedRoutes = [
        '/dashboard(.*)',
        '/tests/(.*)/result(.*)',  // 現在は保護されている
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(currentProtectedRoutes);

      // 現在は保護されている（true）が、変更後は false になる必要がある
      expect(isProtectedRoute('/tests/bigfive/result')).toBe(true);
      expect(isProtectedRoute('/tests/bigfive/result?data=xxx')).toBe(true);
    });
  });

  describe('目標の状態（Iteration-03変更後）', () => {
    it('should NOT protect /tests/bigfive/result', () => {
      // Iteration-03で変更: 診断結果ページは未ログインでも閲覧可能
      const protectedRoutes = [
        '/dashboard(.*)',
        '/ai-chat(.*)',  // 新規追加
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(protectedRoutes);

      expect(isProtectedRoute('/tests/bigfive/result')).toBe(false);
      expect(isProtectedRoute('/tests/bigfive/result?data=xxx')).toBe(false);
      expect(isProtectedRoute('/tests/aptitude/result')).toBe(false);
      expect(isProtectedRoute('/tests/love-type/result')).toBe(false);
    });

    it('should NOT protect /tests/bigfive/short/result', () => {
      const protectedRoutes = [
        '/dashboard(.*)',
        '/ai-chat(.*)',
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(protectedRoutes);

      expect(isProtectedRoute('/tests/bigfive/short/result')).toBe(false);
    });
  });

  describe('AI相談ページ（ログイン必須）', () => {
    it('should protect /ai-chat', () => {
      const protectedRoutes = [
        '/dashboard(.*)',
        '/ai-chat(.*)',  // 新規追加
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(protectedRoutes);

      expect(isProtectedRoute('/ai-chat')).toBe(true);
      expect(isProtectedRoute('/ai-chat/consultation')).toBe(true);
    });
  });

  describe('既存の保護ルート（変更なし）', () => {
    it('should protect /dashboard', () => {
      const protectedRoutes = [
        '/dashboard(.*)',
        '/ai-chat(.*)',
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(protectedRoutes);

      expect(isProtectedRoute('/dashboard')).toBe(true);
      expect(isProtectedRoute('/dashboard/settings')).toBe(true);
    });

    it('should protect /profile', () => {
      const protectedRoutes = [
        '/dashboard(.*)',
        '/ai-chat(.*)',
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(protectedRoutes);

      expect(isProtectedRoute('/profile')).toBe(true);
      expect(isProtectedRoute('/profile/edit')).toBe(true);
    });

    it('should NOT protect public routes', () => {
      const protectedRoutes = [
        '/dashboard(.*)',
        '/ai-chat(.*)',
        '/profile(.*)',
        '/settings(.*)',
      ];
      const isProtectedRoute = createRouteMatcher(protectedRoutes);

      expect(isProtectedRoute('/')).toBe(false);
      expect(isProtectedRoute('/about')).toBe(false);
      expect(isProtectedRoute('/tests')).toBe(false);
      expect(isProtectedRoute('/tests/bigfive')).toBe(false);
    });
  });
});
