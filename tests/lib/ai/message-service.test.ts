// tests/lib/ai/message-service.test.ts
// Task 2-2: メッセージ保存API拡張 - ビジネスロジックのユニットテスト

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient, AiConversationTheme } from '@prisma/client';
import { saveMessages } from '@/lib/ai/message-service';

const prisma = new PrismaClient();

describe('message-service: saveMessages', () => {
  const testUserId = 'test-user-message-save';
  let testConversationId: string;

  beforeEach(async () => {
    // テスト用ユーザー作成
    await prisma.user.create({
      data: {
        id: testUserId,
        clerkId: `clerk-${testUserId}`,
        email: `${testUserId}@test.com`,
        name: 'Test User Message',
      },
    });

    // テスト用会話作成
    const conversation = await prisma.aiConversation.create({
      data: {
        userId: testUserId,
        theme: AiConversationTheme.CAREER,
        title: 'Test Conversation',
      },
    });
    testConversationId = conversation.id;
  });

  afterEach(async () => {
    // クリーンアップ
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  it('正常系: メッセージ保存成功', async () => {
    const result = await saveMessages(
      testConversationId,
      'こんにちは',
      'こんにちは！どのようなご相談でしょうか？',
      'gemini-2.5-flash'
    );

    expect(result).toHaveProperty('userMessageId');
    expect(result).toHaveProperty('aiMessageId');
    expect(result.userMessageId).toMatch(/^c[a-z0-9]+$/);
    expect(result.aiMessageId).toMatch(/^c[a-z0-9]+$/);

    // データベース確認
    const userMsg = await prisma.aiMessage.findUnique({
      where: { id: result.userMessageId },
    });
    expect(userMsg?.role).toBe('user');
    expect(userMsg?.content).toBe('こんにちは');
    expect(userMsg?.tokenCount).toBeGreaterThan(0);
    expect(userMsg?.model).toBeNull();

    const aiMsg = await prisma.aiMessage.findUnique({
      where: { id: result.aiMessageId },
    });
    expect(aiMsg?.role).toBe('assistant');
    expect(aiMsg?.content).toBe('こんにちは！どのようなご相談でしょうか？');
    expect(aiMsg?.tokenCount).toBeGreaterThan(0);
    expect(aiMsg?.model).toBe('gemini-2.5-flash');
  });

  it('正常系: tokenCount推定が正しい（文字数 * 1.3）', async () => {
    const userMessage = 'テスト'; // 3文字 → 約3.9トークン → 4トークン
    const aiResponse = 'テストレスポンス'; // 7文字 → 約9.1トークン → 10トークン

    const result = await saveMessages(
      testConversationId,
      userMessage,
      aiResponse
    );

    const userMsg = await prisma.aiMessage.findUnique({
      where: { id: result.userMessageId },
    });
    expect(userMsg?.tokenCount).toBe(Math.ceil(userMessage.length * 1.3));

    const aiMsg = await prisma.aiMessage.findUnique({
      where: { id: result.aiMessageId },
    });
    expect(aiMsg?.tokenCount).toBe(Math.ceil(aiResponse.length * 1.3));
  });

  it('異常系: 存在しないconversationId→エラー', async () => {
    await expect(
      saveMessages(
        'non-existent-conversation-id',
        'test message',
        'test response'
      )
    ).rejects.toThrow('Conversation not found');
  });

  it('境界値: 空メッセージ（userMessage）→エラー', async () => {
    await expect(
      saveMessages(
        testConversationId,
        '',
        'test response'
      )
    ).rejects.toThrow('User message is required');
  });

  it('境界値: 空メッセージ（aiResponse）→エラー', async () => {
    await expect(
      saveMessages(
        testConversationId,
        'test message',
        ''
      )
    ).rejects.toThrow('AI response is required');
  });

  it('正常系: 複数メッセージを連続保存', async () => {
    // 1回目
    const result1 = await saveMessages(
      testConversationId,
      'メッセージ1',
      'レスポンス1'
    );

    // 2回目
    const result2 = await saveMessages(
      testConversationId,
      'メッセージ2',
      'レスポンス2'
    );

    // データベース確認
    const messages = await prisma.aiMessage.findMany({
      where: { conversationId: testConversationId },
      orderBy: { createdAt: 'asc' },
    });

    expect(messages).toHaveLength(4); // ユーザー2件 + AI2件
    expect(messages[0].content).toBe('メッセージ1');
    expect(messages[1].content).toBe('レスポンス1');
    expect(messages[2].content).toBe('メッセージ2');
    expect(messages[3].content).toBe('レスポンス2');
  });
});
