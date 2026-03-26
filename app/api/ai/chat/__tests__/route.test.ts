import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';

/**
 * AI Chat API ユニットテスト
 *
 * テスト対象:
 * - POST /api/ai/chat: 正常系、バリデーション、エラーハンドリング
 * - GET /api/ai/chat: ヘルスチェック
 */

// Clerkのモック
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' }),
}));

// Gemini Clientのモック
vi.mock('@/lib/ai/gemini-client', () => ({
  sendGeminiChat: vi.fn().mockResolvedValue('AIからの返信です'),
}));

// Prompt Builderのモック
vi.mock('@/lib/ai/prompt-builder', () => ({
  buildSystemPrompt: vi.fn().mockReturnValue('System prompt'),
  detectCrisisKeywords: vi.fn().mockReturnValue(false),
}));

describe('AI Chat API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/ai/chat', () => {
    it('should return AI reply for valid request', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'キャリアについて相談したいです',
          theme: 'career',
          history: [],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reply).toBe('AIからの返信です');
      expect(data.isCrisis).toBe(false);
    });

    it('should handle crisis keywords', async () => {
      // クライシス検出をモック
      const { detectCrisisKeywords } = await import('@/lib/ai/prompt-builder');
      vi.mocked(detectCrisisKeywords).mockReturnValueOnce(true);

      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: '死にたい',
          theme: 'career',
          history: [],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.isCrisis).toBe(true);
      expect(data.reply).toContain('いのちの電話');
      expect(data.reply).toContain('0570-783-556');
    });

    it('should return 401 when user is not authenticated', async () => {
      // 認証失敗をモック
      const { auth } = await import('@clerk/nextjs/server');
      vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any);

      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test',
          theme: 'career',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 for invalid request (missing message)', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          theme: 'career',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request');
      expect(data.details).toBeDefined();
    });

    it('should return 400 for invalid request (message too long)', async () => {
      const longMessage = 'a'.repeat(1001);
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: longMessage,
          theme: 'career',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request');
    });

    it('should return 400 for invalid theme', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test',
          theme: 'invalid-theme',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request');
    });

    it('should handle history correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: '転職について教えてください',
          theme: 'career',
          history: [
            { role: 'user', content: 'こんにちは' },
            { role: 'assistant', content: 'こんにちは！' },
          ],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reply).toBeDefined();
    });

    it('should return 429 when rate limit is exceeded', async () => {
      // レート制限エラーをモック
      const { sendGeminiChat } = await import('@/lib/ai/gemini-client');
      const error = new Error('Rate limit exceeded');
      (error as any).statusCode = 429;
      vi.mocked(sendGeminiChat).mockRejectedValueOnce(error);

      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test',
          theme: 'career',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('制限');
    });

    it('should return 500 for internal errors', async () => {
      // 内部エラーをモック
      const { sendGeminiChat } = await import('@/lib/ai/gemini-client');
      vi.mocked(sendGeminiChat).mockRejectedValueOnce(new Error('Internal error'));

      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test',
          theme: 'career',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('エラー');
    });

    it('should use default theme when not specified', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle BigFive scores in request', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test',
          theme: 'career',
          bigFiveScores: {
            scores: {
              neuroticism: { average: 3.5, normalized: 70, level: 'high' },
              extraversion: { average: 2.5, normalized: 50, level: 'neutral' },
              openness: { average: 4.0, normalized: 80, level: 'high' },
              agreeableness: { average: 3.0, normalized: 60, level: 'neutral' },
              conscientiousness: { average: 4.5, normalized: 90, level: 'high' },
            },
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reply).toBeDefined();
    });
  });

  describe('GET /api/ai/chat', () => {
    it('should return health check status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.message).toContain('AI Chat API');
    });
  });
});
