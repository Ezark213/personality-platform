// app/api/tests/results/route.ts
// Task 3-1: 診断結果保存API - APIルート層

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { saveTestResult } from '@/lib/tests/result-service';
import { TestType } from '@prisma/client';

/**
 * POST /api/tests/results
 * 診断結果を保存
 */
export async function POST(req: NextRequest) {
  try {
    // 認証チェック（任意 - 匿名ユーザーもサポート）
    const { userId } = await auth();

    // リクエストボディ取得
    const body = await req.json();
    const { testType, scores, typeId } = body;

    // バリデーション
    if (!testType || !Object.values(TestType).includes(testType)) {
      return NextResponse.json(
        { error: 'Invalid testType. Must be BIGFIVE, APTITUDE, or LOVE_TYPE' },
        { status: 400 }
      );
    }

    if (!scores || typeof scores !== 'object') {
      return NextResponse.json(
        { error: 'Scores must be an object' },
        { status: 400 }
      );
    }

    if (!typeId || typeof typeId !== 'string' || typeId.trim() === '') {
      return NextResponse.json(
        { error: 'Type ID is required' },
        { status: 400 }
      );
    }

    // メタデータ取得
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;

    // ビジネスロジック呼び出し
    const result = await saveTestResult(
      userId || null,
      testType,
      scores,
      typeId,
      { ipAddress, userAgent }
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tests/results] Error:', error);

    // エラーメッセージに応じてステータスコードを変更
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }

    if (errorMessage.includes('required') || errorMessage.includes('cannot be empty')) {
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
