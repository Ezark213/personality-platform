// lib/ai/message-service.ts
// Task 2-2: メッセージ保存API拡張 - ビジネスロジック

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * メッセージ保存の結果型
 */
export interface SaveMessagesResult {
  userMessageId: string;
  aiMessageId: string;
}

/**
 * ユーザーメッセージとAIレスポンスを保存
 *
 * @param conversationId - 会話ID
 * @param userMessage - ユーザーメッセージ
 * @param aiResponse - AIレスポンス
 * @param model - AIモデル名（例: 'gemini-2.5-flash'）
 * @returns 保存されたメッセージID
 * @throws {Error} Conversation not found - 会話が存在しない場合
 * @throws {Error} User message is required - userMessageが空の場合
 * @throws {Error} AI response is required - aiResponseが空の場合
 */
export async function saveMessages(
  conversationId: string,
  userMessage: string,
  aiResponse: string,
  model: string = 'gemini-2.5-flash'
): Promise<SaveMessagesResult> {
  // バリデーション
  if (!userMessage || userMessage.trim() === '') {
    throw new Error('User message is required');
  }

  if (!aiResponse || aiResponse.trim() === '') {
    throw new Error('AI response is required');
  }

  // 会話存在確認
  const conversation = await prisma.aiConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // トークン数推定（文字数 * 1.3）
  const userTokenCount = Math.ceil(userMessage.length * 1.3);
  const aiTokenCount = Math.ceil(aiResponse.length * 1.3);

  // ユーザーメッセージ保存
  const userMsg = await prisma.aiMessage.create({
    data: {
      conversationId,
      role: 'user',
      content: userMessage,
      tokenCount: userTokenCount,
      model: null, // ユーザーメッセージにはモデル情報なし
    },
  });

  // AIレスポンス保存
  const aiMsg = await prisma.aiMessage.create({
    data: {
      conversationId,
      role: 'assistant',
      content: aiResponse,
      tokenCount: aiTokenCount,
      model,
    },
  });

  return {
    userMessageId: userMsg.id,
    aiMessageId: aiMsg.id,
  };
}
