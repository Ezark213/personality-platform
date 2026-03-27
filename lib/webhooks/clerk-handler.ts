/**
 * Clerk Webhook イベントハンドラー
 *
 * Webhookエンドポイントからビジネスロジックを分離し、
 * テスト可能にするための補助関数。
 */

import { PrismaClient } from '@prisma/client';

// Clerk Webhookイベント型定義
export type ClerkWebhookEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    id: string;
    email_addresses?: Array<{
      id: string;
      email_address: string;
    }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
};

/**
 * Clerk Webhookイベントを処理する（Refactor版）
 *
 * @param event - Clerk Webhookイベント
 * @param prisma - Prisma Clientインスタンス
 * @returns 処理結果（success: 成功/失敗、message: 詳細メッセージ）
 *
 * @throws Error - email_addressesが空の場合（user.createdのみ）
 */
export async function handleClerkWebhookEvent(
  event: ClerkWebhookEvent,
  prisma: PrismaClient
): Promise<{ success: boolean; message: string }> {
  const eventType = event.type;
  const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data;

  console.log(`Processing webhook event: ${eventType} for user ${clerkId}`);

  switch (eventType) {
    case 'user.created': {
      // user.created: 新しいUserレコードを作成
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
        throw new Error('Email address is required for user.created event');
      }

      const name = [first_name, last_name].filter(Boolean).join(' ') || null;

      try {
        const user = await prisma.user.create({
          data: {
            clerkId,
            email,
            name,
            imageUrl: image_url || null,
          },
        });
        return {
          success: true,
          message: `Created user: ${user.id} (${user.email})`,
        };
      } catch (error) {
        // clerkIdが重複している場合（既に存在する）
        if ((error as { code?: string }).code === 'P2002') {
          return {
            success: true,
            message: `User with clerkId ${clerkId} already exists, skipped creation`,
          };
        }
        throw error; // その他のエラーは再スロー
      }
    }

    case 'user.updated': {
      // user.updated: 既存Userレコードを更新
      const email = email_addresses?.[0]?.email_address;
      const name = [first_name, last_name].filter(Boolean).join(' ') || null;

      const updateData: {
        email?: string;
        name?: string | null;
        imageUrl?: string | null;
      } = {};

      if (email) updateData.email = email;
      if (name !== undefined) updateData.name = name;
      if (image_url !== undefined) updateData.imageUrl = image_url || null;

      try {
        const user = await prisma.user.update({
          where: { clerkId },
          data: updateData,
        });
        return {
          success: true,
          message: `Updated user: ${user.id} (${user.email})`,
        };
      } catch (error) {
        // ユーザーが見つからない場合
        if ((error as { code?: string }).code === 'P2025') {
          return {
            success: true,
            message: `User with clerkId ${clerkId} not found, skipped update`,
          };
        }
        throw error;
      }
    }

    case 'user.deleted': {
      // user.deleted: Userレコードを削除（onDelete: Cascadeで関連データも削除）
      try {
        const user = await prisma.user.delete({
          where: { clerkId },
        });
        return {
          success: true,
          message: `Deleted user: ${user.id} (${user.email})`,
        };
      } catch (error) {
        // ユーザーが見つからない場合
        if ((error as { code?: string }).code === 'P2025') {
          return {
            success: true,
            message: `User with clerkId ${clerkId} not found, skipped deletion`,
          };
        }
        throw error;
      }
    }

    default: {
      // 未知のイベントタイプ
      return {
        success: true,
        message: `Unhandled webhook event type: ${eventType}`,
      };
    }
  }
}
