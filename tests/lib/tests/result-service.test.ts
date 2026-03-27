// tests/lib/tests/result-service.test.ts
// Task 3-1: 診断結果保存API - ビジネスロジックのユニットテスト
// TDDサイクル: Red - このテストは実装がないため失敗する

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient, TestType } from '@prisma/client';
import { saveTestResult } from '@/lib/tests/result-service';

const prisma = new PrismaClient();

describe('result-service: saveTestResult', () => {
  const testUserId = 'test-user-result-save';

  beforeEach(async () => {
    // テスト用ユーザー作成
    await prisma.user.create({
      data: {
        id: testUserId,
        clerkId: `clerk-${testUserId}`,
        email: `${testUserId}@test.com`,
        name: 'Test User',
      },
    });
  });

  afterEach(async () => {
    // クリーンアップ（カスケード削除により診断結果も削除される）
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  it('正常系: ログインユーザーの診断結果を保存', async () => {
    const scores = {
      neuroticism: { score: 50, facets: { anxiety: 60, anger: 40 } },
      extraversion: { score: 70, facets: { warmth: 80, gregariousness: 60 } },
      openness: { score: 65, facets: { imagination: 75, aesthetics: 55 } },
      agreeableness: { score: 55, facets: { trust: 65, altruism: 45 } },
      conscientiousness: { score: 60, facets: { competence: 70, order: 50 } },
    };

    const result = await saveTestResult(
      testUserId,
      TestType.BIGFIVE,
      scores,
      '15type-test-id-1',
      { ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' }
    );

    expect(result).toHaveProperty('resultId');
    expect(result.resultId).toMatch(/^c[a-z0-9]+$/); // CUID形式

    // データベース確認
    const testResult = await prisma.testResult.findUnique({
      where: { id: result.resultId },
    });
    expect(testResult).toBeTruthy();
    expect(testResult?.userId).toBe(testUserId);
    expect(testResult?.testType).toBe(TestType.BIGFIVE);
    expect(testResult?.typeId).toBe('15type-test-id-1');
    expect(testResult?.scores).toEqual(scores);
    expect(testResult?.ipAddress).toBe('192.168.1.1');
    expect(testResult?.userAgent).toBe('Mozilla/5.0');
  });

  it('正常系: 匿名ユーザーの診断結果を保存（userId: null）', async () => {
    const scores = {
      neuroticism: { score: 45 },
      extraversion: { score: 75 },
      openness: { score: 60 },
      agreeableness: { score: 50 },
      conscientiousness: { score: 55 },
    };

    const result = await saveTestResult(
      null,
      TestType.BIGFIVE,
      scores,
      '15type-anonymous',
      { ipAddress: '203.0.113.42' }
    );

    expect(result.resultId).toBeTruthy();

    // データベース確認
    const testResult = await prisma.testResult.findUnique({
      where: { id: result.resultId },
    });
    expect(testResult?.userId).toBeNull();
    expect(testResult?.testType).toBe(TestType.BIGFIVE);
    expect(testResult?.ipAddress).toBe('203.0.113.42');
  });

  it('正常系: APTITUDE testTypeで保存', async () => {
    const scores = {
      verbal: { score: 80 },
      numerical: { score: 70 },
      logical: { score: 75 },
    };

    const result = await saveTestResult(
      testUserId,
      TestType.APTITUDE,
      scores,
      'aptitude-type-1'
    );

    const testResult = await prisma.testResult.findUnique({
      where: { id: result.resultId },
    });
    expect(testResult?.testType).toBe(TestType.APTITUDE);
    expect(testResult?.typeId).toBe('aptitude-type-1');
  });

  it('異常系: scoresが空オブジェクト→エラー', async () => {
    await expect(
      saveTestResult(testUserId, TestType.BIGFIVE, {}, '15type-empty')
    ).rejects.toThrow('Scores cannot be empty');
  });

  it('境界値: typeId空文字列→エラー', async () => {
    const scores = { neuroticism: { score: 50 } };

    await expect(
      saveTestResult(testUserId, TestType.BIGFIVE, scores, '')
    ).rejects.toThrow('Type ID is required');
  });

  it('境界値: 存在しないuserId（非null）→エラー', async () => {
    const scores = { neuroticism: { score: 50 } };

    await expect(
      saveTestResult('non-existent-user', TestType.BIGFIVE, scores, '15type-test')
    ).rejects.toThrow('User not found');
  });
});
