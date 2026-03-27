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
 * Iteration-04 Phase 1 改善版: ビジネスロジック分離、テスト可能性向上
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';
import { handleClerkWebhookEvent, type ClerkWebhookEvent } from '@/lib/webhooks/clerk-handler';

const prisma = new PrismaClient();

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

    // 2. イベント処理（ビジネスロジックは分離）
    const result = await handleClerkWebhookEvent(event, prisma);
    console.log(result.message);

    // 3. 成功レスポンス
    return NextResponse.json({ success: result.success }, { status: 200 });
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
