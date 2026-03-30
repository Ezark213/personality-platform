import { test, expect } from '@playwright/test';

test.describe('BigFive診断結果 SNS共有機能', () => {
  // テスト用の診断結果URLを生成
  const getTestResultUrl = () => {
    // 簡易的なモックデータ（実際の診断結果形式に準拠）
    const mockResultData = {
      result: {
        scores: {
          neuroticism: { average: 3.5, normalized: 70, level: 'high' },
          extraversion: { average: 2.5, normalized: 50, level: 'medium' },
          openness: { average: 4.0, normalized: 80, level: 'high' },
          agreeableness: { average: 3.0, normalized: 60, level: 'medium' },
          conscientiousness: { average: 3.5, normalized: 70, level: 'high' },
        },
      },
    };

    // Base64エンコード（実際のアプリケーションと同じ形式）
    const encodedData = Buffer.from(JSON.stringify(mockResultData)).toString('base64');
    const testId = 'e2e-test-' + Date.now();

    return `/tests/bigfive/result?data=${encodedData}&id=${testId}`;
  };

  test('シナリオ1: Twitter/X共有ボタンのクリック', async ({ page, context }) => {
    // 診断結果ページに遷移
    await page.goto(getTestResultUrl());

    // ページが読み込まれるまで待機
    await page.waitForSelector('text=診断結果');

    // 共有セクションまでスクロール
    await page.locator('text=診断結果をシェア').scrollIntoViewIfNeeded();

    // 新しいページ（ウィンドウ）を監視
    const newPagePromise = context.waitForEvent('page');

    // Twitter/Xボタンをクリック
    await page.click('button:has-text("X (Twitter) でシェア")');

    // 新しいウィンドウが開かれることを確認
    const newPage = await newPagePromise;

    // Twitter/XのツイートURLが開かれることを確認
    const newPageUrl = newPage.url();
    expect(newPageUrl).toContain('twitter.com/intent/tweet');
    expect(newPageUrl).toContain('text=');

    // 新しいウィンドウを閉じる
    await newPage.close();
  });

  test('シナリオ2: LINEボタンのクリック', async ({ page, context }) => {
    await page.goto(getTestResultUrl());
    await page.waitForSelector('text=診断結果');
    await page.locator('text=診断結果をシェア').scrollIntoViewIfNeeded();

    const newPagePromise = context.waitForEvent('page');
    await page.click('button:has-text("LINEでシェア")');

    const newPage = await newPagePromise;
    const newPageUrl = newPage.url();

    // LINE共有URLが開かれることを確認
    expect(newPageUrl).toContain('social-plugins.line.me/lineit/share');
    expect(newPageUrl).toContain('url=');

    await newPage.close();
  });

  test('シナリオ3: クリップボードコピー', async ({ page, context }) => {
    // クリップボード権限を付与
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto(getTestResultUrl());
    await page.waitForSelector('text=診断結果');
    await page.locator('text=診断結果をシェア').scrollIntoViewIfNeeded();

    // コピーボタンをクリック
    await page.click('button:has-text("URLをコピー")');

    // トースト通知の表示確認
    await expect(page.locator('text=URLをコピーしました')).toBeVisible({ timeout: 3000 });

    // クリップボードの内容確認
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('/tests/bigfive/result');
    expect(clipboardText).toContain('id=e2e-test-');
  });
});
