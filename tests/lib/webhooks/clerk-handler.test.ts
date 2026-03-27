/**
 * Clerk Webhook ハンドラーテスト（改善版）
 *
 * TDDサイクル（Red-Green-Refactor）を厳守したテスト。
 * プレースホルダーなし、実際のビジネスロジックを検証する。
 *
 * Iteration-04 Phase 1 改善版
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { handleClerkWebhookEvent, type ClerkWebhookEvent } from '@/lib/webhooks/clerk-handler';

const prisma = new PrismaClient();

describe('Clerk Webhook Handler - handleClerkWebhookEvent', () => {
  beforeEach(async () => {
    // テストデータクリーンアップ
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
    await prisma.testResult.deleteMany();
    await prisma.user.deleteMany();
  });

  // afterEach でのdisconnectは削除（同じインスタンスを再利用するため）

  describe('user.created イベント', () => {
    it('新しいUserレコードを作成すること', async () => {
      // 準備: Clerk user.created webhookイベント
      const event: ClerkWebhookEvent = {
        type: 'user.created',
        data: {
          id: 'clerk_test_user_001',
          email_addresses: [
            {
              id: 'email_001',
              email_address: 'test.user@example.com',
            },
          ],
          first_name: 'Test',
          last_name: 'User',
          image_url: 'https://example.com/avatar.jpg',
        },
      };

      // 実行: Webhookイベント処理
      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功結果
      expect(result.success).toBe(true);
      expect(result.message).toContain('Created user');

      // 検証: データベースにUserレコードが作成された
      const user = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_001' },
      });

      expect(user).toBeDefined();
      expect(user?.clerkId).toBe('clerk_test_user_001');
      expect(user?.email).toBe('test.user@example.com');
      expect(user?.name).toBe('Test User');
      expect(user?.imageUrl).toBe('https://example.com/avatar.jpg');
    });

    it('email_addressesが空の場合、エラーをスローすること', async () => {
      // 準備: email_addressesがないイベント
      const event: ClerkWebhookEvent = {
        type: 'user.created',
        data: {
          id: 'clerk_test_user_002',
          email_addresses: [],
          first_name: 'No',
          last_name: 'Email',
        },
      };

      // 実行＆検証: エラーがスローされる
      await expect(handleClerkWebhookEvent(event, prisma)).rejects.toThrow(
        'Email address is required'
      );
    });

    it('重複するclerkIdの場合、スキップして成功を返すこと', async () => {
      // 準備: 既存Userを作成
      await prisma.user.create({
        data: {
          clerkId: 'clerk_duplicate_user',
          email: 'duplicate@example.com',
          name: 'Duplicate User',
        },
      });

      // 実行: 同じclerkIdでuser.createdイベント処理
      const event: ClerkWebhookEvent = {
        type: 'user.created',
        data: {
          id: 'clerk_duplicate_user',
          email_addresses: [
            {
              id: 'email_003',
              email_address: 'new.email@example.com',
            },
          ],
          first_name: 'New',
          last_name: 'User',
        },
      };

      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功だが、スキップされた
      expect(result.success).toBe(true);
      expect(result.message).toContain('already exists');

      // 検証: Userレコードは更新されていない（元のままemailはduplicate@example.com）
      const user = await prisma.user.findUnique({
        where: { clerkId: 'clerk_duplicate_user' },
      });
      expect(user?.email).toBe('duplicate@example.com');
    });

    it('first_nameとlast_nameを結合してnameに設定すること', async () => {
      // 準備: first_nameとlast_nameを持つイベント
      const event: ClerkWebhookEvent = {
        type: 'user.created',
        data: {
          id: 'clerk_test_user_003',
          email_addresses: [
            {
              id: 'email_004',
              email_address: 'fullname@example.com',
            },
          ],
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      // 実行
      await handleClerkWebhookEvent(event, prisma);

      // 検証: nameが"John Doe"になっている
      const user = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_003' },
      });
      expect(user?.name).toBe('John Doe');
    });

    it('first_nameのみの場合、nameに設定すること', async () => {
      // 準備: first_nameのみのイベント
      const event: ClerkWebhookEvent = {
        type: 'user.created',
        data: {
          id: 'clerk_test_user_004',
          email_addresses: [
            {
              id: 'email_005',
              email_address: 'firstname@example.com',
            },
          ],
          first_name: 'Alice',
        },
      };

      // 実行
      await handleClerkWebhookEvent(event, prisma);

      // 検証: nameが"Alice"になっている
      const user = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_004' },
      });
      expect(user?.name).toBe('Alice');
    });

    it('first_nameとlast_nameが両方undefinedの場合、nameをnullに設定すること（新規テスト・TDD Red）', async () => {
      // 準備: first_nameとlast_nameが両方undefinedのイベント
      const event: ClerkWebhookEvent = {
        type: 'user.created',
        data: {
          id: 'clerk_test_user_noname',
          email_addresses: [
            {
              id: 'email_noname',
              email_address: 'noname@example.com',
            },
          ],
          // first_nameとlast_nameはundefined
        },
      };

      // 実行
      await handleClerkWebhookEvent(event, prisma);

      // 検証: nameがnullになっている
      const user = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_noname' },
      });
      expect(user?.name).toBeNull();
    });
  });

  describe('user.updated イベント', () => {
    it('既存Userレコードを更新すること', async () => {
      // 準備: 既存Userを作成
      await prisma.user.create({
        data: {
          clerkId: 'clerk_test_user_005',
          email: 'original@example.com',
          name: 'Original Name',
          imageUrl: 'https://example.com/original.jpg',
        },
      });

      // 実行: user.updatedイベント処理
      const event: ClerkWebhookEvent = {
        type: 'user.updated',
        data: {
          id: 'clerk_test_user_005',
          email_addresses: [
            {
              id: 'email_006',
              email_address: 'updated@example.com',
            },
          ],
          first_name: 'Updated',
          last_name: 'Name',
          image_url: 'https://example.com/updated.jpg',
        },
      };

      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功結果
      expect(result.success).toBe(true);
      expect(result.message).toContain('Updated user');

      // 検証: Userレコードが更新された
      const user = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_005' },
      });
      expect(user?.email).toBe('updated@example.com');
      expect(user?.name).toBe('Updated Name');
      expect(user?.imageUrl).toBe('https://example.com/updated.jpg');
    });

    it('存在しないUserの場合、スキップして成功を返すこと', async () => {
      // 実行: 存在しないユーザーのuser.updatedイベント処理
      const event: ClerkWebhookEvent = {
        type: 'user.updated',
        data: {
          id: 'clerk_nonexistent_user',
          email_addresses: [
            {
              id: 'email_007',
              email_address: 'nonexistent@example.com',
            },
          ],
          first_name: 'Non',
          last_name: 'Existent',
        },
      };

      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功だが、スキップされた
      expect(result.success).toBe(true);
      expect(result.message).toContain('not found');
    });
  });

  describe('user.deleted イベント', () => {
    it('Userレコードを削除すること', async () => {
      // 準備: 既存Userを作成
      const user = await prisma.user.create({
        data: {
          clerkId: 'clerk_test_user_006',
          email: 'delete@example.com',
          name: 'To Be Deleted',
        },
      });

      // 実行: user.deletedイベント処理
      const event: ClerkWebhookEvent = {
        type: 'user.deleted',
        data: {
          id: 'clerk_test_user_006',
        },
      };

      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功結果
      expect(result.success).toBe(true);
      expect(result.message).toContain('Deleted user');

      // 検証: Userレコードが削除された
      const deletedUser = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_006' },
      });
      expect(deletedUser).toBeNull();
    });

    it('削除時に関連データ（TestResult、AiConversation）もカスケード削除されること', async () => {
      // 準備: User、TestResult、AiConversationを作成
      const user = await prisma.user.create({
        data: {
          clerkId: 'clerk_test_user_007',
          email: 'cascade@example.com',
          name: 'Cascade Test',
        },
      });

      const testResult = await prisma.testResult.create({
        data: {
          userId: user.id,
          testType: 'BIGFIVE',
          scores: { test: 'data' },
          typeId: '15type-01',
        },
      });

      const conversation = await prisma.aiConversation.create({
        data: {
          userId: user.id,
          testResultId: testResult.id,
          theme: 'CAREER',
          title: 'Cascade Test Conversation',
        },
      });

      await prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: 'Test message',
        },
      });

      // 実行: user.deletedイベント処理
      const event: ClerkWebhookEvent = {
        type: 'user.deleted',
        data: {
          id: 'clerk_test_user_007',
        },
      };

      await handleClerkWebhookEvent(event, prisma);

      // 検証: Userレコードが削除された
      const deletedUser = await prisma.user.findUnique({
        where: { clerkId: 'clerk_test_user_007' },
      });
      expect(deletedUser).toBeNull();

      // 検証: TestResultも削除された（onDelete: Cascade）
      const testResults = await prisma.testResult.findMany({
        where: { userId: user.id },
      });
      expect(testResults.length).toBe(0);

      // 検証: AiConversationも削除された（onDelete: Cascade）
      const conversations = await prisma.aiConversation.findMany({
        where: { userId: user.id },
      });
      expect(conversations.length).toBe(0);

      // 検証: AiMessageも削除された（onDelete: Cascade経由）
      const messages = await prisma.aiMessage.findMany({
        where: { conversationId: conversation.id },
      });
      expect(messages.length).toBe(0);
    });

    it('存在しないUserの場合、スキップして成功を返すこと', async () => {
      // 実行: 存在しないユーザーのuser.deletedイベント処理
      const event: ClerkWebhookEvent = {
        type: 'user.deleted',
        data: {
          id: 'clerk_nonexistent_user_delete',
        },
      };

      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功だが、スキップされた
      expect(result.success).toBe(true);
      expect(result.message).toContain('not found');
    });
  });

  describe('未知のイベントタイプ', () => {
    it('未知のイベントタイプの場合、成功を返すこと', async () => {
      // 実行: 未知のイベントタイプ
      const event = {
        type: 'unknown.event',
        data: {
          id: 'clerk_test_user_008',
        },
      } as unknown as ClerkWebhookEvent;

      const result = await handleClerkWebhookEvent(event, prisma);

      // 検証: 成功を返す（Clerk再送を防ぐため）
      expect(result.success).toBe(true);
      expect(result.message).toContain('Unhandled webhook event type');
    });
  });
});
