// tests/lib/ai/conversation-service.test.ts
// Task 2-1: 会話作成API - ビジネスロジックのユニットテスト
// TDDサイクル: Red - このテストは実装がないため失敗する

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient, AiConversationTheme, TestType } from '@prisma/client';
import { createConversation, getUserConversations, getConversationMessages } from '@/lib/ai/conversation-service';

const prisma = new PrismaClient();

describe('conversation-service: createConversation', () => {
  const testUserId = 'test-user-conversation-create';

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
    // クリーンアップ（カスケード削除により会話も削除される）
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  it('正常系: CAREER themeで会話作成成功', async () => {
    const result = await createConversation(testUserId, AiConversationTheme.CAREER);

    expect(result).toHaveProperty('conversationId');
    expect(result.conversationId).toMatch(/^c[a-z0-9]+$/); // CUID形式
    expect(result.theme).toBe('CAREER');
    expect(result.title).toBe('キャリア相談');
    expect(result.createdAt).toBeInstanceOf(Date);

    // データベース確認
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: result.conversationId },
    });
    expect(conversation).toBeTruthy();
    expect(conversation?.userId).toBe(testUserId);
    expect(conversation?.theme).toBe(AiConversationTheme.CAREER);
    expect(conversation?.title).toBe('キャリア相談');
  });

  it('正常系: RELATIONSHIPS themeで会話作成成功', async () => {
    const result = await createConversation(testUserId, AiConversationTheme.RELATIONSHIPS);

    expect(result.theme).toBe('RELATIONSHIPS');
    expect(result.title).toBe('人間関係相談');
  });

  it('正常系: SELF_GROWTH themeで会話作成成功', async () => {
    const result = await createConversation(testUserId, AiConversationTheme.SELF_GROWTH);

    expect(result.theme).toBe('SELF_GROWTH');
    expect(result.title).toBe('自己成長相談');
  });

  it('正常系: testResultId付きで作成→bigFiveSnapshot保存確認', async () => {
    // テスト用の診断結果を作成
    const testResult = await prisma.testResult.create({
      data: {
        userId: testUserId,
        testType: TestType.BIGFIVE,
        typeId: '15type-test-id',
        scores: {
          neuroticism: { score: 50, facets: { anxiety: 60 } },
          extraversion: { score: 70, facets: { warmth: 80 } },
          openness: { score: 65, facets: { imagination: 75 } },
          agreeableness: { score: 55, facets: { trust: 65 } },
          conscientiousness: { score: 60, facets: { competence: 70 } },
        },
      },
    });

    const result = await createConversation(
      testUserId,
      AiConversationTheme.CAREER,
      testResult.id
    );

    expect(result.bigFiveSnapshot).toBeTruthy();
    expect(result.bigFiveSnapshot).toEqual(testResult.scores);

    // データベース確認
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: result.conversationId },
    });
    expect(conversation?.bigFiveSnapshot).toEqual(testResult.scores);
    expect(conversation?.testResultId).toBe(testResult.id);
  });

  it('異常系: 存在しないtestResultId→エラー', async () => {
    await expect(
      createConversation(testUserId, AiConversationTheme.CAREER, 'non-existent-result-id')
    ).rejects.toThrow('Test result not found');
  });

  it('境界値: userId空文字列→エラー', async () => {
    await expect(
      createConversation('', AiConversationTheme.CAREER)
    ).rejects.toThrow('User ID is required');
  });

  it('境界値: 存在しないuserId→エラー', async () => {
    await expect(
      createConversation('non-existent-user-id', AiConversationTheme.CAREER)
    ).rejects.toThrow('User not found');
  });
});

describe('conversation-service: getUserConversations', () => {
  const testUserId = 'test-user-get-conversations';

  beforeEach(async () => {
    // テスト用ユーザー作成
    await prisma.user.create({
      data: {
        id: testUserId,
        clerkId: `clerk-${testUserId}`,
        email: `${testUserId}@test.com`,
        name: 'Test User Get Conv',
      },
    });
  });

  afterEach(async () => {
    // クリーンアップ
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  it('正常系: 会話一覧取得（3件作成→3件取得）', async () => {
    // 3件の会話を個別に作成（順序保証のため）
    await prisma.aiConversation.create({
      data: { userId: testUserId, theme: AiConversationTheme.CAREER, title: '会話1' },
    });
    await prisma.aiConversation.create({
      data: { userId: testUserId, theme: AiConversationTheme.RELATIONSHIPS, title: '会話2' },
    });
    await prisma.aiConversation.create({
      data: { userId: testUserId, theme: AiConversationTheme.SELF_GROWTH, title: '会話3' },
    });

    const result = await getUserConversations(testUserId);

    expect(result).toHaveLength(3);
    expect(result[0].theme).toBe('SELF_GROWTH'); // 最新が先頭
    expect(result[1].theme).toBe('RELATIONSHIPS');
    expect(result[2].theme).toBe('CAREER');
  });

  it('正常系: messageCountが正しい', async () => {
    // 会話作成
    const conv = await prisma.aiConversation.create({
      data: { userId: testUserId, theme: AiConversationTheme.CAREER, title: 'Test' },
    });

    // メッセージ3件追加
    await prisma.aiMessage.createMany({
      data: [
        { conversationId: conv.id, role: 'user', content: 'msg1' },
        { conversationId: conv.id, role: 'assistant', content: 'msg2' },
        { conversationId: conv.id, role: 'user', content: 'msg3' },
      ],
    });

    const result = await getUserConversations(testUserId);

    expect(result).toHaveLength(1);
    expect(result[0].messageCount).toBe(3);
  });

  it('境界値: limit=0→空配列', async () => {
    const result = await getUserConversations(testUserId, 0);
    expect(result).toHaveLength(0);
  });
});

describe('conversation-service: getConversationMessages', () => {
  const testUserId = 'test-user-get-messages';
  const otherUserId = 'other-user-get-messages';
  let testConversationId: string;

  beforeEach(async () => {
    // テスト用ユーザー作成
    await prisma.user.createMany({
      data: [
        {
          id: testUserId,
          clerkId: `clerk-${testUserId}`,
          email: `${testUserId}@test.com`,
          name: 'Test User',
        },
        {
          id: otherUserId,
          clerkId: `clerk-${otherUserId}`,
          email: `${otherUserId}@test.com`,
          name: 'Other User',
        },
      ],
    });

    // テスト用会話作成
    const conv = await prisma.aiConversation.create({
      data: { userId: testUserId, theme: AiConversationTheme.CAREER, title: 'Test Conv' },
    });
    testConversationId = conv.id;
  });

  afterEach(async () => {
    // クリーンアップ
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, otherUserId] } },
    });
  });

  it('正常系: メッセージ取得（5件作成→5件取得、古い順）', async () => {
    // 5件のメッセージを作成
    await prisma.aiMessage.createMany({
      data: [
        { conversationId: testConversationId, role: 'user', content: 'msg1' },
        { conversationId: testConversationId, role: 'assistant', content: 'msg2' },
        { conversationId: testConversationId, role: 'user', content: 'msg3' },
        { conversationId: testConversationId, role: 'assistant', content: 'msg4' },
        { conversationId: testConversationId, role: 'user', content: 'msg5' },
      ],
    });

    const result = await getConversationMessages(testConversationId, testUserId);

    expect(result.conversation.id).toBe(testConversationId);
    expect(result.messages).toHaveLength(5);
    expect(result.messages[0].content).toBe('msg1'); // 古い順
    expect(result.messages[4].content).toBe('msg5');
  });

  it('異常系: 他人の会話にアクセス→エラー', async () => {
    await expect(
      getConversationMessages(testConversationId, otherUserId)
    ).rejects.toThrow('Access denied');
  });

  it('異常系: 存在しない会話→エラー', async () => {
    await expect(
      getConversationMessages('non-existent-conv-id', testUserId)
    ).rejects.toThrow('Conversation not found');
  });
});
