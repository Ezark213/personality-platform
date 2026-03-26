import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendGeminiChat, GeminiAPIError, checkGeminiHealth } from '../gemini-client';

/**
 * Gemini Client ユニットテスト
 *
 * テスト対象:
 * - sendGeminiChat(): 正常系、エラーハンドリング
 * - checkGeminiHealth(): ヘルスチェック
 * - GeminiAPIError: カスタムエラークラス
 */

// Google Generative AIのモック
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          startChat: vi.fn().mockReturnValue({
            sendMessage: vi.fn().mockResolvedValue({
              response: {
                text: vi.fn().mockReturnValue('AIからの返信です'),
              },
            }),
          }),
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: vi.fn().mockReturnValue('Hello'),
            },
          }),
        }),
      };
    }),
  };
});

describe('Gemini Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 環境変数をモック
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  describe('sendGeminiChat()', () => {
    it('should send message and receive reply', async () => {
      const systemPrompt = 'You are a helpful assistant';
      const history = [
        { role: 'user' as const, content: 'こんにちは' },
        { role: 'assistant' as const, content: 'こんにちは！' },
      ];
      const userMessage = 'キャリアについて相談したいです';

      const reply = await sendGeminiChat(systemPrompt, history, userMessage);

      expect(reply).toBe('AIからの返信です');
    });

    it('should handle empty history', async () => {
      const systemPrompt = 'You are a helpful assistant';
      const history: any[] = [];
      const userMessage = 'こんにちは';

      const reply = await sendGeminiChat(systemPrompt, history, userMessage);

      expect(reply).toBe('AIからの返信です');
    });

    it('should throw GeminiAPIError when API key is missing', async () => {
      delete process.env.GEMINI_API_KEY;

      const systemPrompt = 'Test';
      const history: any[] = [];
      const userMessage = 'Test';

      await expect(sendGeminiChat(systemPrompt, history, userMessage)).rejects.toThrow(
        GeminiAPIError
      );
      await expect(sendGeminiChat(systemPrompt, history, userMessage)).rejects.toThrow(
        'GEMINI_API_KEY is not defined'
      );
    });

    it('should throw GeminiAPIError when response is empty', async () => {
      // 空のレスポンスをモック
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      vi.mocked(GoogleGenerativeAI).mockImplementationOnce(() => {
        return {
          getGenerativeModel: vi.fn().mockReturnValue({
            startChat: vi.fn().mockReturnValue({
              sendMessage: vi.fn().mockResolvedValue({
                response: {
                  text: vi.fn().mockReturnValue(''),
                },
              }),
            }),
          }),
        } as any;
      });

      const systemPrompt = 'Test';
      const history: any[] = [];
      const userMessage = 'Test';

      await expect(sendGeminiChat(systemPrompt, history, userMessage)).rejects.toThrow(
        'Empty response from Gemini API'
      );
    });

    it('should handle API errors with proper error codes', async () => {
      // APIエラーをモック
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      vi.mocked(GoogleGenerativeAI).mockImplementationOnce(() => {
        return {
          getGenerativeModel: vi.fn().mockReturnValue({
            startChat: vi.fn().mockReturnValue({
              sendMessage: vi.fn().mockRejectedValue(new Error('quota exceeded')),
            }),
          }),
        } as any;
      });

      const systemPrompt = 'Test';
      const history: any[] = [];
      const userMessage = 'Test';

      try {
        await sendGeminiChat(systemPrompt, history, userMessage);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(GeminiAPIError);
        expect(error.statusCode).toBe(429);
        expect(error.message).toContain('rate limit');
      }
    });
  });

  describe('checkGeminiHealth()', () => {
    it('should return true when API is healthy', async () => {
      const isHealthy = await checkGeminiHealth();
      expect(isHealthy).toBe(true);
    });

    it('should return false when API is unavailable', async () => {
      // APIエラーをモック
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      vi.mocked(GoogleGenerativeAI).mockImplementationOnce(() => {
        return {
          getGenerativeModel: vi.fn().mockReturnValue({
            generateContent: vi.fn().mockRejectedValue(new Error('API Error')),
          }),
        } as any;
      });

      const isHealthy = await checkGeminiHealth();
      expect(isHealthy).toBe(false);
    });
  });

  describe('GeminiAPIError', () => {
    it('should create error with message and status code', () => {
      const error = new GeminiAPIError('Test error', 429);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(429);
      expect(error.name).toBe('GeminiAPIError');
    });

    it('should create error with cause', () => {
      const cause = new Error('Original error');
      const error = new GeminiAPIError('Wrapped error', 500, cause);

      expect(error.message).toBe('Wrapped error');
      expect(error.statusCode).toBe(500);
      expect(error.cause).toBe(cause);
    });
  });
});
