// lib/ai/conversation-service.ts
// Task 2-1: 会話作成API - ビジネスロジック
// TDDサイクル: Green - テストを通す最小限の実装

import { PrismaClient, AiConversationTheme, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 会話テーマに応じたタイトルを生成
 */
function generateTitle(theme: AiConversationTheme): string {
  const titleMap: Record<AiConversationTheme, string> = {
    CAREER: 'キャリア相談',
    RELATIONSHIPS: '人間関係相談',
    SELF_GROWTH: '自己成長相談',
  };
  return titleMap[theme];
}

/**
 * 会話作成の返り値型
 */
export interface ConversationCreationResult {
  conversationId: string;
  theme: string;
  title: string;
  bigFiveSnapshot?: Prisma.JsonValue;
  createdAt: Date;
}

/**
 * 新しい会話を作成
 *
 * @param userId - ユーザーID
 * @param theme - 会話テーマ（CAREER, RELATIONSHIPS, SELF_GROWTH）
 * @param testResultId - 診断結果ID（任意）
 * @returns 作成された会話情報
 * @throws {Error} User ID is required - userIdが空の場合
 * @throws {Error} User not found - ユーザーが存在しない場合
 * @throws {Error} Test result not found - 診断結果が存在しない場合
 */
export async function createConversation(
  userId: string,
  theme: AiConversationTheme,
  testResultId?: string
): Promise<ConversationCreationResult> {
  // バリデーション
  if (!userId || userId.trim() === '') {
    throw new Error('User ID is required');
  }

  // ユーザー存在確認
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // testResultIdが指定されている場合、診断結果を取得
  let bigFiveSnapshot: Prisma.InputJsonValue | undefined;

  if (testResultId) {
    const testResult = await prisma.testResult.findUnique({
      where: { id: testResultId },
    });

    if (!testResult) {
      throw new Error('Test result not found');
    }

    // BigFiveスコアをスナップショットとして保存
    bigFiveSnapshot = testResult.scores as Prisma.InputJsonValue;
  }

  // タイトル生成
  const title = generateTitle(theme);

  // 会話作成
  const conversation = await prisma.aiConversation.create({
    data: {
      userId,
      theme,
      title,
      bigFiveSnapshot: bigFiveSnapshot,
      testResultId: testResultId,
    },
  });

  return {
    conversationId: conversation.id,
    theme: conversation.theme,
    title: conversation.title || '',
    bigFiveSnapshot: bigFiveSnapshot as Prisma.JsonValue | undefined,
    createdAt: conversation.createdAt,
  };
}

/**
 * ユーザーの会話一覧を取得
 *
 * @param userId - ユーザーID
 * @param limit - 取得件数（デフォルト: 20）
 * @returns 会話一覧
 * @throws {Error} User ID is required - userIdが空の場合
 */
export async function getUserConversations(
  userId: string,
  limit: number = 20
): Promise<Array<{
  id: string;
  theme: string;
  title: string | null;
  createdAt: Date;
  messageCount: number;
}>> {
  // バリデーション
  if (!userId || userId.trim() === '') {
    throw new Error('User ID is required');
  }

  // 会話一覧取得（メッセージ数を含む）
  const conversations = await prisma.aiConversation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  return conversations.map((conv) => ({
    id: conv.id,
    theme: conv.theme,
    title: conv.title,
    createdAt: conv.createdAt,
    messageCount: conv._count.messages,
  }));
}

/**
 * 特定会話のメッセージを取得
 *
 * @param conversationId - 会話ID
 * @param userId - ユーザーID（権限チェック用）
 * @param limit - 取得件数（デフォルト: 50）
 * @returns 会話情報とメッセージ一覧
 * @throws {Error} Conversation not found - 会話が存在しない場合
 * @throws {Error} Access denied - 他人の会話にアクセスしようとした場合
 */
export async function getConversationMessages(
  conversationId: string,
  userId: string,
  limit: number = 50
): Promise<{
  conversation: {
    id: string;
    theme: string;
    title: string | null;
    bigFiveSnapshot: Prisma.JsonValue | null;
    createdAt: Date;
  };
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }>;
}> {
  // 会話取得
  const conversation = await prisma.aiConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // 権限チェック
  if (conversation.userId !== userId) {
    throw new Error('Access denied');
  }

  // メッセージ取得
  const messages = await prisma.aiMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });

  return {
    conversation: {
      id: conversation.id,
      theme: conversation.theme,
      title: conversation.title,
      bigFiveSnapshot: conversation.bigFiveSnapshot,
      createdAt: conversation.createdAt,
    },
    messages: messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt,
    })),
  };
}
