import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini Client - Gemini 2.5 Flash統合
 *
 * Iteration-03で追加:
 * - Google Gemini 2.5 Flash APIの統合
 * - エラーハンドリング（APIレート制限、ネットワークエラー）
 * - ストリーミング非対応（MVPでは一括レスポンス）
 */

/**
 * Gemini APIクライアントの初期化（遅延初期化）
 */
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Geminiモデルの設定
 */
const MODEL_NAME = 'gemini-2.5-flash';

const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8000, // AI相談で長い返信を可能にするため8000に設定（最大8192）
};

const SAFETY_SETTINGS = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];

/**
 * Gemini APIエラーの型定義
 */
export class GeminiAPIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'GeminiAPIError';
  }
}

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * チャット履歴をGemini形式に変換
 *
 * Note: Gemini APIは履歴の最初のメッセージが必ず'user'ロールでなければならない。
 * そのため、履歴の先頭が'assistant'の場合はスキップする。
 */
function convertToGeminiHistory(messages: ChatMessage[]) {
  // 最初のメッセージがassistantの場合は除外（UIの初期挨拶メッセージなど）
  let validMessages = messages;
  if (messages.length > 0 && messages[0].role === 'assistant') {
    validMessages = messages.slice(1);
  }

  // Gemini形式に変換
  return validMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}

/**
 * Geminiチャット送信
 *
 * @param systemPrompt - システムプロンプト（5層構造）
 * @param history - 会話履歴
 * @param userMessage - ユーザーメッセージ
 * @returns AI返信テキスト
 * @throws {GeminiAPIError} - API呼び出しエラー
 */
export async function sendGeminiChat(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: GENERATION_CONFIG,
      // @ts-ignore - Safety settings型定義の不一致を無視
      safetySettings: SAFETY_SETTINGS,
      systemInstruction: systemPrompt,
    });

    // 会話履歴を変換
    const geminiHistory = convertToGeminiHistory(history);

    // チャットセッション開始
    const chat = model.startChat({
      history: geminiHistory,
    });

    // メッセージ送信
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new GeminiAPIError('Empty response from Gemini API');
    }

    return text;
  } catch (error: any) {
    // エラーハンドリング
    if (error.message?.includes('API key')) {
      throw new GeminiAPIError('Invalid Gemini API Key', 401, error);
    }

    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      throw new GeminiAPIError('Gemini API rate limit exceeded', 429, error);
    }

    if (error.message?.includes('network') || error.message?.includes('timeout')) {
      throw new GeminiAPIError('Network error communicating with Gemini API', 503, error);
    }

    // その他のエラー
    throw new GeminiAPIError(
      `Gemini API error: ${error.message || 'Unknown error'}`,
      500,
      error
    );
  }
}

/**
 * Gemini APIヘルスチェック
 *
 * @returns APIが利用可能な場合true
 */
export async function checkGeminiHealth(): Promise<boolean> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    await model.generateContent('Hello');
    return true;
  } catch {
    return false;
  }
}
