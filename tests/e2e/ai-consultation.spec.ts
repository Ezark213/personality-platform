import { test, expect } from '@playwright/test';

/**
 * AI相談機能 E2Eテスト
 *
 * テストシナリオ:
 * 1. ログイン → AI相談ページ → メッセージ送信 → 返信受信
 * 2. 未ログイン → AI相談ページ → ログイン画面にリダイレクト
 * 3. クライシスキーワード → セーフティレスポンス
 */

test.describe('AI相談機能', () => {
  test.beforeEach(async ({ page }) => {
    // ホームページに移動
    await page.goto('/');
  });

  test('未ログイン時、AI相談ページにアクセスするとログイン画面にリダイレクトされる', async ({ page }) => {
    // AI相談ページにアクセス
    await page.goto('/ai-chat');

    // ログイン画面にリダイレクトされることを確認
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('ログイン後、AI相談ページにアクセスできる', async ({ page }) => {
    // テスト用ログイン（Clerkのテストモードまたはモックを使用）
    // 実際の実装では、Clerk のテスト環境設定が必要
    test.skip();

    // AI相談ページにアクセス
    await page.goto('/ai-chat');

    // ページタイトルを確認
    await expect(page.locator('h1')).toContainText('ココロ');

    // 初期メッセージを確認
    await expect(page.locator('text=こんにちは！ココロです')).toBeVisible();
  });

  test('メッセージを送信し、AI返信を受信できる', async ({ page }) => {
    // テスト用ログイン
    test.skip();

    // AI相談ページにアクセス
    await page.goto('/ai-chat');

    // メッセージを入力
    const messageInput = page.locator('input[placeholder*="メッセージ"]');
    await messageInput.fill('キャリアについて相談したいです');

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // ユーザーメッセージが表示されることを確認
    await expect(page.locator('text=キャリアについて相談したいです')).toBeVisible();

    // ローディング表示を確認
    await expect(page.locator('.animate-bounce')).toBeVisible();

    // AI返信を待機（最大30秒）
    await expect(page.locator('text=/.*AIからの返信.*/i')).toBeVisible({ timeout: 30000 });
  });

  test('クライシスキーワードに対してセーフティレスポンスが表示される', async ({ page }) => {
    // テスト用ログイン
    test.skip();

    // AI相談ページにアクセス
    await page.goto('/ai-chat');

    // クライシスキーワードを含むメッセージを送信
    const messageInput = page.locator('input[placeholder*="メッセージ"]');
    await messageInput.fill('もう死にたい');

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // セーフティレスポンスを確認
    await expect(page.locator('text=いのちの電話')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=0570-783-556')).toBeVisible();
  });

  test('長いメッセージは送信できない', async ({ page }) => {
    // テスト用ログイン
    test.skip();

    // AI相談ページにアクセス
    await page.goto('/ai-chat');

    // 1001文字の長いメッセージを入力
    const longMessage = 'a'.repeat(1001);
    const messageInput = page.locator('input[placeholder*="メッセージ"]');
    await messageInput.fill(longMessage);

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click();

    // エラーメッセージを確認
    await expect(page.locator('text=/.*エラー.*/i')).toBeVisible({ timeout: 5000 });
  });

  test('会話履歴が表示される', async ({ page }) => {
    // テスト用ログイン
    test.skip();

    // AI相談ページにアクセス
    await page.goto('/ai-chat');

    // 初期メッセージを確認
    const messages = page.locator('[class*="rounded-lg"]');
    await expect(messages.first()).toBeVisible();

    // 複数のメッセージを送信
    const messageInput = page.locator('input[placeholder*="メッセージ"]');

    await messageInput.fill('こんにちは');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);

    await messageInput.fill('転職について教えてください');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);

    // 複数のメッセージが表示されていることを確認
    const allMessages = await messages.count();
    expect(allMessages).toBeGreaterThan(2);
  });
});
