import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { sendGeminiChat } from '@/lib/ai/gemini-client';
import { buildSystemPrompt, detectCrisisKeywords, type ConsultationTheme } from '@/lib/ai/prompt-builder';
import type { BigFiveResult } from '@/types/bigfive';

/**
 * AI Chat API - Gemini 2.5 Flash統合
 *
 * Iteration-03で追加:
 * - POST /api/ai/chat エンドポイント
 * - リクエスト検証（Zod）
 * - Gemini API呼び出し
 * - クライシス検出
 * - エラーハンドリング
 */

/**
 * リクエストスキーマ
 */
const ChatRequestSchema = z.object({
  message: z.string().min(1, 'メッセージは必須です').max(1000, 'メッセージは1000文字以内にしてください'),
  theme: z.enum(['career', 'relationships', 'self-growth']).default('career'),
  bigFiveScores: z.any().optional(), // BigFiveResult型の検証は簡略化
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

/**
 * POST /api/ai/chat
 *
 * AI相談メッセージを送信し、Geminiからの返信を取得します。
 *
 * @param request - NextRequest
 * @returns AI返信とconversationId
 */
export async function POST(request: NextRequest) {
  try {
    // 認証確認
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // リクエストボディ取得
    const body = await request.json();

    // バリデーション
    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { message, theme, bigFiveScores, history } = validation.data;

    // クライシスキーワード検出
    if (detectCrisisKeywords(message)) {
      const crisisResponse = `とても辛い状況なんですね😢 あなたの気持ちを大切に思っています。

今すぐ専門家に相談することをおすすめします:
- **いのちの電話**: 0570-783-556（24時間対応）
- **こころの健康相談統一ダイヤル**: 0570-064-556

一人で抱え込まないでくださいね💙 専門家があなたを支えてくれます。`;

      return NextResponse.json({
        reply: crisisResponse,
        isCrisis: true,
      });
    }

    // システムプロンプト生成
    const systemPrompt = buildSystemPrompt(theme as ConsultationTheme, bigFiveScores as BigFiveResult | undefined);

    // Gemini API呼び出し
    const reply = await sendGeminiChat(systemPrompt, history, message);

    // 成功レスポンス
    return NextResponse.json({
      reply,
      isCrisis: false,
    });
  } catch (error: any) {
    console.error('AI Chat API Error:', error);

    // エラーレスポンス
    if (error.statusCode === 429) {
      return NextResponse.json(
        { error: 'APIリクエスト制限に達しました。しばらく待ってから再試行してください。' },
        { status: 429 }
      );
    }

    if (error.statusCode === 401) {
      return NextResponse.json({ error: 'Gemini API認証エラー' }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'AI相談の処理中にエラーが発生しました。再試行してください。' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/chat
 *
 * ヘルスチェック用エンドポイント
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'AI Chat API is running' });
}
