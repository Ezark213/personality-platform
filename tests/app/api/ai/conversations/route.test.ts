// tests/app/api/ai/conversations/route.test.ts
// Task 2-1: 会話作成API - APIルートのテスト

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '@/app/api/ai/conversations/route';
import { PrismaClient, AiConversationTheme } from '@prisma/client';
import { NextRequest } from 'next/server';

// Clerk認証のモック
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

const prisma = new PrismaClient();
const { auth } = await import('@clerk/nextjs/server');

describe('POST /api/ai/conversations', () => {
  const testUserId = 'test-user-api-conversation';
  const testClerkId = 'clerk-test-user-api';

  beforeEach(async () => {
    // テスト用ユーザー作成
    await prisma.user.create({
      data: {
        id: testUserId,
        clerkId: testClerkId,
        email: `${testUserId}@test.com`,
        name: 'Test User API',
      },
    });

    // Clerk認証モックをデフォルト設定
    vi.mocked(auth).mockResolvedValue({ userId: testUserId } as any);
  });

  afterEach(async () => {
    // クリーンアップ
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
    vi.clearAllMocks();
  });

  it('正常系: POST成功→201 Created', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/conversations', {
      method: 'POST',
      body: JSON.stringify({
        theme: AiConversationTheme.CAREER,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('conversationId');
    expect(data.theme).toBe('CAREER');
    expect(data.title).toBe('キャリア相談');
  });

  it('正常系: testResultId付きで作成→bigFiveSnapshot保存', async () => {
    // テスト用の診断結果を作成
    const testResult = await prisma.testResult.create({
      data: {
        userId: testUserId,
        testType: 'BIGFIVE',
        typeId: '15type-api-test',
        scores: {
          neuroticism: { score: 50 },
          extraversion: { score: 70 },
          openness: { score: 65 },
          agreeableness: { score: 55 },
          conscientiousness: { score: 60 },
        },
      },
    });

    const request = new NextRequest('http://localhost:3000/api/ai/conversations', {
      method: 'POST',
      body: JSON.stringify({
        theme: AiConversationTheme.RELATIONSHIPS,
        testResultId: testResult.id,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.bigFiveSnapshot).toBeTruthy();
    expect(data.bigFiveSnapshot).toEqual(testResult.scores);
  });

  it('異常系: 未認証→401 Unauthorized', async () => {
    // 認証失敗をモック
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/ai/conversations', {
      method: 'POST',
      body: JSON.stringify({
        theme: AiConversationTheme.CAREER,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('異常系: 無効なtheme→400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/conversations', {
      method: 'POST',
      body: JSON.stringify({
        theme: 'INVALID_THEME',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid theme');
  });

  it('異常系: themeが空→400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/conversations', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid theme');
  });

  it('異常系: 存在しないtestResultId→404 Not Found', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/conversations', {
      method: 'POST',
      body: JSON.stringify({
        theme: AiConversationTheme.CAREER,
        testResultId: 'non-existent-result-id',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain('not found');
  });
});
