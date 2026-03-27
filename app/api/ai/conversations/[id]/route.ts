// app/api/ai/conversations/[id]/route.ts
// Task 2-3: 特定会話のメッセージ取得API - APIルート層

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getConversationMessages } from '@/lib/ai/conversation-service';

/**
 * GET /api/ai/conversations/[id]
 * 特定会話のメッセージを取得
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 認証チェック
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // パラメータ取得
    const { id: conversationId } = await params;

    // クエリパラメータ取得
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    // ビジネスロジック呼び出し
    const result = await getConversationMessages(conversationId, userId, limit);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[GET /api/ai/conversations/[id]] Error:', error);

    // エラーメッセージに応じてステータスコードを変更
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }

    if (errorMessage.includes('Access denied')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/conversations/[id]
 * 会話削除（Task 2-4で実装予定）
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Task 2-4で実装
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  );
}
