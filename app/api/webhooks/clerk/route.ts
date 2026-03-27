/**
 * Clerk Webhook エンドポイント
 *
 * Clerkのuser.created/updated/deletedイベントを受信し、
 * データベースのUserレコードと同期します。
 *
 * セキュリティ:
 * - Svix署名検証必須
 * - CLERK_WEBHOOK_SECRET環境変数で検証
 *
 * Iteration-04 Phase 1: データベース基盤構築
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Clerk Webhookイベント型定義
type ClerkWebhookEvent = {
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
 * POST /api/webhooks/clerk
 *
 * Clerk Webhookイベントを処理します。
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Webhook署名検証
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Svix署名ヘッダーを取得
    const headerPayload = await headers();
    const svixId = headerPayload.get('svix-id');
    const svixTimestamp = headerPayload.get('svix-timestamp');
    const svixSignature = headerPayload.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing Svix headers');
      return NextResponse.json(
        { error: 'Missing webhook signature headers' },
        { status: 400 }
      );
    }

    // リクエストボディを取得
    const payload = await req.text();

    // Svix Webhookインスタンスを作成
    const wh = new Webhook(webhookSecret);

    let event: ClerkWebhookEvent;
    try {
      // 署名検証
      event = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // 2. イベントタイプに応じた処理
    const eventType = event.type;
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data;

    console.log(`Processing webhook event: ${eventType} for user ${clerkId}`);

    switch (eventType) {
      case 'user.created': {
        // user.created: 新しいUserレコードを作成
        const email = email_addresses?.[0]?.email_address;
        if (!email) {
          console.error('No email address found in user.created event');
          return NextResponse.json(
            { error: 'Email address is required' },
            { status: 400 }
          );
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
          console.log(`Created user: ${user.id} (${user.email})`);
        } catch (error) {
          // clerkIdが重複している場合（既に存在する）
          if ((error as { code?: string }).code === 'P2002') {
            console.warn(`User with clerkId ${clerkId} already exists, skipping creation`);
          } else {
            throw error; // その他のエラーは再スロー
          }
        }
        break;
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
          console.log(`Updated user: ${user.id} (${user.email})`);
        } catch (error) {
          // ユーザーが見つからない場合
          if ((error as { code?: string }).code === 'P2025') {
            console.warn(`User with clerkId ${clerkId} not found, skipping update`);
          } else {
            throw error;
          }
        }
        break;
      }

      case 'user.deleted': {
        // user.deleted: Userレコードを削除（onDelete: Cascadeで関連データも削除）
        try {
          const user = await prisma.user.delete({
            where: { clerkId },
          });
          console.log(`Deleted user: ${user.id} (${user.email})`);
        } catch (error) {
          // ユーザーが見つからない場合
          if ((error as { code?: string }).code === 'P2025') {
            console.warn(`User with clerkId ${clerkId} not found, skipping deletion`);
          } else {
            throw error;
          }
        }
        break;
      }

      default: {
        // 未知のイベントタイプ（ログのみ、200を返してClerkへの再送を防ぐ）
        console.warn(`Unhandled webhook event type: ${eventType}`);
      }
    }

    // 3. 成功レスポンス
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
