/**
 * Prisma Client基本CRUD操作テスト
 *
 * このテストは、TDDサイクルの「Red」フェーズで作成されました。
 * 実装コードがないため、初回実行時は失敗することが期待されます。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// テスト用Prisma Clientインスタンス
const prisma = new PrismaClient();

describe('Prisma Client - User CRUD操作', () => {
  let testUserId: string;

  // 各テスト前にデータをクリーンアップ
  beforeEach(async () => {
    // テストデータクリーンアップ
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
    await prisma.testResult.deleteMany();
    await prisma.user.deleteMany();
  });

  // 全テスト後にクリーンアップと接続解除
  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('Userを作成できること', async () => {
    const user = await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_001',
        email: 'test@example.com',
        name: 'Test User',
        imageUrl: 'https://example.com/avatar.jpg',
      },
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.clerkId).toBe('test_clerk_id_001');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.imageUrl).toBe('https://example.com/avatar.jpg');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);

    testUserId = user.id;
  });

  it('Userを取得できること', async () => {
    // 準備：Userを作成
    const createdUser = await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_002',
        email: 'test2@example.com',
        name: 'Test User 2',
      },
    });

    // 実行：IDで取得
    const user = await prisma.user.findUnique({
      where: { id: createdUser.id },
    });

    // 検証
    expect(user).toBeDefined();
    expect(user?.id).toBe(createdUser.id);
    expect(user?.clerkId).toBe('test_clerk_id_002');
    expect(user?.email).toBe('test2@example.com');
  });

  it('Userを更新できること', async () => {
    // 準備：Userを作成
    const createdUser = await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_003',
        email: 'test3@example.com',
        name: 'Original Name',
      },
    });

    // 実行：名前を更新
    const updatedUser = await prisma.user.update({
      where: { id: createdUser.id },
      data: { name: 'Updated Name' },
    });

    // 検証
    expect(updatedUser.name).toBe('Updated Name');
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
      updatedUser.createdAt.getTime()
    );
  });

  it('Userを削除できること', async () => {
    // 準備：Userを作成
    const createdUser = await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_004',
        email: 'test4@example.com',
        name: 'To Be Deleted',
      },
    });

    // 実行：削除
    await prisma.user.delete({
      where: { id: createdUser.id },
    });

    // 検証：削除されたことを確認
    const deletedUser = await prisma.user.findUnique({
      where: { id: createdUser.id },
    });
    expect(deletedUser).toBeNull();
  });

  it('clerkIdでUserを検索できること', async () => {
    // 準備：Userを作成
    await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_005',
        email: 'test5@example.com',
        name: 'Test User 5',
      },
    });

    // 実行：clerkIdで検索
    const user = await prisma.user.findUnique({
      where: { clerkId: 'test_clerk_id_005' },
    });

    // 検証
    expect(user).toBeDefined();
    expect(user?.clerkId).toBe('test_clerk_id_005');
  });
});

describe('Prisma Client - TestResult CRUD操作', () => {
  let testUserId: string;

  beforeEach(async () => {
    // テストデータクリーンアップ
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
    await prisma.testResult.deleteMany();
    await prisma.user.deleteMany();

    // テスト用Userを作成
    const user = await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_testresult',
        email: 'testresult@example.com',
        name: 'Test Result User',
      },
    });
    testUserId = user.id;
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('TestResultを作成できること', async () => {
    const testResult = await prisma.testResult.create({
      data: {
        userId: testUserId,
        testType: 'BIGFIVE',
        scores: {
          neuroticism: { score: 50, facets: {} },
          extraversion: { score: 70, facets: {} },
          openness: { score: 80, facets: {} },
          agreeableness: { score: 60, facets: {} },
          conscientiousness: { score: 75, facets: {} },
        },
        typeId: '15type-01',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser',
      },
    });

    expect(testResult).toBeDefined();
    expect(testResult.id).toBeDefined();
    expect(testResult.userId).toBe(testUserId);
    expect(testResult.testType).toBe('BIGFIVE');
    expect(testResult.typeId).toBe('15type-01');
    expect(testResult.scores).toBeDefined();
  });

  it('TestResultとUserの関連を取得できること', async () => {
    // 準備：TestResultを作成
    await prisma.testResult.create({
      data: {
        userId: testUserId,
        testType: 'BIGFIVE',
        scores: { test: 'data' },
        typeId: '15type-02',
      },
    });

    // 実行：UserとTestResultを関連取得
    const user = await prisma.user.findUnique({
      where: { id: testUserId },
      include: {
        testResults: true,
      },
    });

    // 検証
    expect(user).toBeDefined();
    expect(user?.testResults).toBeDefined();
    expect(user?.testResults.length).toBe(1);
    expect(user?.testResults[0].typeId).toBe('15type-02');
  });
});

describe('Prisma Client - AiConversation CRUD操作', () => {
  let testUserId: string;
  let testResultId: string;

  beforeEach(async () => {
    // テストデータクリーンアップ
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
    await prisma.testResult.deleteMany();
    await prisma.user.deleteMany();

    // テスト用Userを作成
    const user = await prisma.user.create({
      data: {
        clerkId: 'test_clerk_id_conversation',
        email: 'conversation@example.com',
        name: 'Conversation User',
      },
    });
    testUserId = user.id;

    // テスト用TestResultを作成
    const testResult = await prisma.testResult.create({
      data: {
        userId: testUserId,
        testType: 'BIGFIVE',
        scores: { neuroticism: { score: 50 } },
        typeId: '15type-03',
      },
    });
    testResultId = testResult.id;
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('AiConversationを作成できること', async () => {
    const conversation = await prisma.aiConversation.create({
      data: {
        userId: testUserId,
        testResultId: testResultId,
        theme: 'CAREER',
        title: 'キャリア相談',
        bigFiveSnapshot: {
          neuroticism: 50,
          extraversion: 70,
        },
      },
    });

    expect(conversation).toBeDefined();
    expect(conversation.id).toBeDefined();
    expect(conversation.userId).toBe(testUserId);
    expect(conversation.theme).toBe('CAREER');
    expect(conversation.title).toBe('キャリア相談');
  });

  it('AiConversationにAiMessageを追加できること', async () => {
    // 準備：Conversationを作成
    const conversation = await prisma.aiConversation.create({
      data: {
        userId: testUserId,
        theme: 'SELF_GROWTH',
        title: '自己成長相談',
      },
    });

    // 実行：Messageを追加
    const message = await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: 'こんにちは、相談したいことがあります。',
        tokenCount: 20,
        model: 'gemini-2.5-flash',
      },
    });

    // 検証
    expect(message).toBeDefined();
    expect(message.conversationId).toBe(conversation.id);
    expect(message.role).toBe('user');
    expect(message.content).toBe('こんにちは、相談したいことがあります。');

    // 関連取得の検証
    const conversationWithMessages = await prisma.aiConversation.findUnique({
      where: { id: conversation.id },
      include: { messages: true },
    });
    expect(conversationWithMessages?.messages.length).toBe(1);
  });

  it('Conversation削除時にMessagesもカスケード削除されること', async () => {
    // 準備：ConversationとMessageを作成
    const conversation = await prisma.aiConversation.create({
      data: {
        userId: testUserId,
        theme: 'RELATIONSHIPS',
      },
    });

    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: 'Test message 1',
      },
    });

    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: 'Test message 2',
      },
    });

    // 実行：Conversationを削除
    await prisma.aiConversation.delete({
      where: { id: conversation.id },
    });

    // 検証：Messagesも削除されていることを確認
    const messages = await prisma.aiMessage.findMany({
      where: { conversationId: conversation.id },
    });
    expect(messages.length).toBe(0);
  });
});
