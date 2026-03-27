// app/api/ai/conversations/route.ts
// Task 2-1: 会話作成API - APIルート層

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createConversation } from '@/lib/ai/conversation-service';
import { AiConversationTheme } from '@prisma/client';

/**
 * POST /api/ai/conversations
 * 新しい会話を作成
 */
export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // リクエストボディ取得
    const body = await req.json();
    const { theme, testResultId } = body;

    // バリデーション
    if (!theme || !Object.values(AiConversationTheme).includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme. Must be CAREER, RELATIONSHIPS, or SELF_GROWTH' },
        { status: 400 }
      );
    }

    // ビジネスロジック呼び出し
    const result = await createConversation(userId, theme, testResultId);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[POST /api/ai/conversations] Error:', error);

    // エラーメッセージに応じてステータスコードを変更
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }

    if (errorMessage.includes('required')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/conversations
 * ユーザーの会話一覧を取得
 */
export async function GET(req: NextRequest) {
  try {
    // 認証チェック
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // クエリパラメータ取得
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    // ビジネスロジック呼び出し
    const { getUserConversations } = await import('@/lib/ai/conversation-service');
    const conversations = await getUserConversations(userId, limit);

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/ai/conversations] Error:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
