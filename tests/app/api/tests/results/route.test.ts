// tests/app/api/tests/results/route.test.ts
// Task 3-1: 診断結果保存API - APIルートのテスト

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '@/app/api/tests/results/route';
import { PrismaClient, TestType } from '@prisma/client';
import { NextRequest } from 'next/server';

// Clerk認証のモック
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

const prisma = new PrismaClient();
const { auth } = await import('@clerk/nextjs/server');

describe('POST /api/tests/results', () => {
  const testUserId = 'test-user-api-result';
  const testClerkId = 'clerk-test-user-api-result';

  beforeEach(async () => {
    // テスト用ユーザー作成
    await prisma.user.create({
      data: {
        id: testUserId,
        clerkId: testClerkId,
        email: `${testUserId}@test.com`,
        name: 'Test User API Result',
      },
    });

    // Clerk認証モックをデフォルト設定（ログインユーザー）
    vi.mocked(auth).mockResolvedValue({ userId: testUserId } as any);
  });

  afterEach(async () => {
    // クリーンアップ
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
    vi.clearAllMocks();
  });

  it('正常系: POST成功→201 Created（ログインユーザー）', async () => {
    const request = new NextRequest('http://localhost:3000/api/tests/results', {
      method: 'POST',
      headers: {
        'user-agent': 'Mozilla/5.0 Test',
        'x-forwarded-for': '192.168.1.100',
      },
      body: JSON.stringify({
        testType: TestType.BIGFIVE,
        scores: {
          neuroticism: { score: 50 },
          extraversion: { score: 70 },
          openness: { score: 65 },
          agreeableness: { score: 55 },
          conscientiousness: { score: 60 },
        },
        typeId: '15type-api-test-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('resultId');
    expect(data.resultId).toMatch(/^c[a-z0-9]+$/);

    // データベース確認
    const testResult = await prisma.testResult.findUnique({
      where: { id: data.resultId },
    });
    expect(testResult?.userId).toBe(testUserId);
    expect(testResult?.testType).toBe(TestType.BIGFIVE);
    expect(testResult?.ipAddress).toBe('192.168.1.100');
    expect(testResult?.userAgent).toBe('Mozilla/5.0 Test');
  });

  it('正常系: 未認証でも保存可能（匿名ユーザー）', async () => {
    // 認証なしをモック
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/tests/results', {
      method: 'POST',
      body: JSON.stringify({
        testType: TestType.BIGFIVE,
        scores: {
          neuroticism: { score: 45 },
          extraversion: { score: 75 },
          openness: { score: 60 },
          agreeableness: { score: 50 },
          conscientiousness: { score: 55 },
        },
        typeId: '15type-anonymous-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.resultId).toBeTruthy();

    // データベース確認
    const testResult = await prisma.testResult.findUnique({
      where: { id: data.resultId },
    });
    expect(testResult?.userId).toBeNull();
  });

  it('正常系: APTITUDE testTypeで保存', async () => {
    const request = new NextRequest('http://localhost:3000/api/tests/results', {
      method: 'POST',
      body: JSON.stringify({
        testType: TestType.APTITUDE,
        scores: {
          verbal: { score: 80 },
          numerical: { score: 70 },
          logical: { score: 75 },
        },
        typeId: 'aptitude-api-test-1',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);

    const testResult = await prisma.testResult.findUnique({
      where: { id: data.resultId },
    });
    expect(testResult?.testType).toBe(TestType.APTITUDE);
  });

  it('異常系: 無効なtestType→400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/api/tests/results', {
      method: 'POST',
      body: JSON.stringify({
        testType: 'INVALID_TYPE',
        scores: { test: 1 },
        typeId: 'test-id',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid testType');
  });

  it('異常系: scoresが空オブジェクト→400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/api/tests/results', {
      method: 'POST',
      body: JSON.stringify({
        testType: TestType.BIGFIVE,
        scores: {},
        typeId: 'test-id',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('cannot be empty');
  });

  it('異常系: typeId空文字列→400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/api/tests/results', {
      method: 'POST',
      body: JSON.stringify({
        testType: TestType.BIGFIVE,
        scores: { neuroticism: { score: 50 } },
        typeId: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
  });
});
