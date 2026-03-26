---LEADER OUTPUT START---

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-03
- 参照レビュー: 初回（AI相談機能の新規実装）
- 作成日時: 2026-03-26 19:00
- ゴール: Gemini APIを使用したAI相談機能のMVP実装
- 成功判定: キャリア相談テーマでBigFiveスコアを活用した対話が動作し、E2Eテストが成功する

---PROJECT PLAN---

# イテレーション計画: AI相談機能 MVP

## 概要

Personality PlatformにGemini API（無料枠）を統合し、性格診断結果を活かしたAI相談機能を実装します。Z世代ユーザー向けに「自己発見ナビゲーター」というコンセプトで、診断結果を「ラベル」ではなく「行動改善のきっかけ」として活用する継続価値を提供します。

**市場機会**:
- 日本のZ世代の67.3%がMBTIを認知、41.3%が実施済み
- 既存サービス（16Personalities、mgram）は診断後の継続価値が薄い
- 性格診断×AIの統合サービスは日本市場で未開拓

**参照ドキュメント**: `docs/ai-consultation-design.md`（詳細な設計提案）

## スコープ

### 含まれる対象（MVP - Phase 1）
- **Gemini 2.5 Flash統合**: 無料枠（~250 RPD, 10 RPM）で実装
- **単一相談テーマ**: キャリア・仕事（最優先、Z世代の43%がニーズあり）
- **モバイルファーストチャットUI**:
  - 診断結果ページからの自然な導線
  - BigFiveスコアを動的に注入したシステムプロンプト
  - サジェスチョンチップ（3つの開始プロンプト）
  - タイピングインジケーター
  - メッセージ履歴の保存
- **AIキャラクター設定**:
  - 名前: ココロ（Kokoro） - 温かく支援的な先輩（senpai）アーキタイプ
  - トーン: 丁寧カジュアル（です/ます + 温かさ）
  - 顔文字（kaomoji）の自然な使用
- **安全対策**:
  - クライシスキーワード検出
  - 免責事項表示
  - 診断ではなく探索としてのフレーミング

### 対象外（Phase 2以降）
- 複数テーマ（人間関係、自己成長）
- キャラクターアバター
- インサイト保存機能
- 有料プラン制限（月3回）
- 会話要約・継続性
- 相性診断連携

## 引き継ぎ情報
- 前回レビュー: なし（初回）
- 前提条件:
  - BigFive診断システムが稼働中（20問短縮版、15タイプ分類）
  - Clerk認証が実装済み
  - ユーザーの診断結果がローカルストレージまたはDBに保存されている前提
- 技術的制約:
  - Gemini 1.5は廃止済み → **Gemini 2.5 Flash**または**2.5 Flash-Lite**を使用
  - 無料枠: Flash（~250 RPD, 10 RPM）、Flash-Lite（1,000 RPD, 15 RPM）
  - 会話履歴管理で5往復ごとに要約してトークン削減（60-70%削減）

## テストファースト戦略

### 先に書くべきテスト

#### 1. Gemini API統合テスト（優先度: High）
```typescript
// lib/ai/__tests__/gemini-client.test.ts
describe('GeminiClient', () => {
  it('should generate response with BigFive context', async () => {
    const client = new GeminiClient(process.env.GEMINI_API_KEY);
    const response = await client.generateResponse({
      userMessage: 'キャリアについて相談したい',
      bigFiveScores: { openness: 78, conscientiousness: 62, ... },
      theme: 'career'
    });
    expect(response).toContain('開放性');
    expect(response.length).toBeGreaterThan(50);
  });

  it('should handle API errors gracefully', async () => {
    // エラーハンドリングのテスト
  });
});
```

#### 2. システムプロンプト生成テスト（優先度: High）
```typescript
// lib/ai/__tests__/prompt-builder.test.ts
describe('PromptBuilder', () => {
  it('should inject BigFive scores into system prompt', () => {
    const prompt = buildSystemPrompt({
      bigFiveScores: { openness: 78, ... },
      personalityType: 'Thoughtful Creator',
      theme: 'career'
    });
    expect(prompt).toContain('Openness 78');
    expect(prompt).toContain('career');
  });

  it('should adapt tone for high neuroticism users', () => {
    const prompt = buildSystemPrompt({
      bigFiveScores: { neuroticism: 85, ... }
    });
    expect(prompt).toContain('extra validating');
  });
});
```

#### 3. チャットUIコンポーネントテスト（優先度: Medium）
```typescript
// components/ai-chat/__tests__/ChatInterface.test.tsx
describe('ChatInterface', () => {
  it('should display suggestion chips on initial load', () => {
    render(<ChatInterface />);
    expect(screen.getByText('就活について相談したい')).toBeInTheDocument();
  });

  it('should show typing indicator while AI responds', async () => {
    // タイピングインジケーターのテスト
  });
});
```

#### 4. E2Eテスト（優先度: Medium）
```typescript
// tests/e2e/ai-consultation.spec.ts
test('user can start AI consultation from results page', async ({ page }) => {
  // 診断結果ページに移動
  // 「AI相談を開始」ボタンをクリック
  // チャットインターフェースが表示される
  // メッセージを送信してAIの応答を受け取る
  expect(await page.locator('.ai-message').first()).toBeVisible();
});
```

### 失敗させたい代表入力
- APIキーが無効な場合のエラーハンドリング
- 空のメッセージ送信
- BigFiveスコアが未定義の場合
- ネットワークタイムアウト
- RPM制限超過時の処理

### テスト環境・ツール
- **ユニットテスト**: Vitest
- **コンポーネントテスト**: React Testing Library
- **E2Eテスト**: Playwright
- **APIモック**: Mock Service Worker (MSW) または Vitest mock

### データ準備
- **モックBigFiveスコア**:
  ```typescript
  const mockScores = {
    openness: 78,
    conscientiousness: 62,
    extraversion: 35,
    agreeableness: 71,
    neuroticism: 58
  };
  ```
- **モックGemini応答**:
  ```typescript
  const mockAIResponse = '〇〇さん、こんにちは！ココロです ✨ ...';
  ```

## タスクボード

| # | アイテム | 種別 | 完了条件 | 優先度 |
|---|----------|------|----------|---------|
| 1 | Gemini API統合テスト作成 | Test | API呼び出しが成功し、BigFiveコンテキストが反映される | High |
| 2 | システムプロンプトビルダーテスト作成 | Test | BigFiveスコアが正しくプロンプトに注入される | High |
| 3 | Gemini APIクライアント実装 | Code | テストがパスし、エラーハンドリングが動作 | High |
| 4 | システムプロンプトビルダー実装 | Code | 5層プロンプト構造が実装される（Role/Context/Style/Theme/Safety） | High |
| 5 | チャットUIコンポーネントテスト作成 | Test | サジェスチョンチップ、タイピングインジケーターが表示 | Medium |
| 6 | チャットUIコンポーネント実装 | Code | モバイルファースト、ボトム固定入力、メッセージバブル | Medium |
| 7 | 診断結果ページへの導線追加 | Code | 「AI相談を開始」ボタンが表示され、遷移が動作 | Medium |
| 8 | E2Eテスト作成 | Test | 診断→AI相談の一連のフローが動作 | Medium |
| 9 | 環境変数設定（GEMINI_API_KEY） | Config | .env.localに設定、ドキュメント化 | High |
| 10 | 会話履歴管理実装 | Code | メッセージがDBまたはローカルストレージに保存 | Low |
| 11 | 実装ドキュメント作成 | Doc | API仕様、プロンプト設計、UX設計が文書化 | Medium |

## リスクと前提

### 技術的リスク
1. **Gemini API無料枠の制限**
   - Flash: ~250 RPD（1日83セッション想定）
   - 対策: Flash-Lite（1,000 RPD）に切り替え可能、有料Tier 1は月¥1,000以下
2. **レスポンス遅延**
   - Gemini応答時間が2-4秒
   - 対策: タイピングインジケーター必須、体感品質の確保
3. **プロンプトインジェクション**
   - ユーザーが悪意あるプロンプトを送信
   - 対策: 入力サニタイゼーション、コンテキスト長制限
4. **診断結果の取得**
   - 現状、診断結果がどこに保存されているか不明
   - 対策: ローカルストレージまたはDBスキーマを確認・実装

### 依存関係
- BigFive診断結果が取得可能であること
- Clerk認証が動作していること
- Next.js App Router環境

### 時間/リソース制約
- MVP実装: 4-8時間想定
- テスト込み: 12時間程度

---EXECUTION INSTRUCTION---

# 実行指示: Iteration-03 AI相談機能 MVP

## 最優先事項

1. **テストファースト**: Gemini API統合テストとプロンプトビルダーテストを最初に作成し、失敗を確認する
2. **仕様の明確化**: BigFive診断結果の保存場所を確認し、取得方法を決定する（仮定を文書化）
3. **完全なドキュメント化**: すべての成果物を `.tmp/execution/iteration_03_20260326_1900/` に保存し、`---CREATED FILES---` で完全パスを列挙する

## 作成/更新すべき成果物

### 1. テスト（優先度順）

#### A. Gemini API統合テスト
**ファイル**: `lib/ai/__tests__/gemini-client.test.ts`

**テストケース**:
- ✅ BigFiveコンテキストを含むプロンプトで応答生成
- ✅ APIエラー時のエラーハンドリング
- ✅ RPM制限超過時のリトライ
- ✅ 空メッセージのバリデーション

#### B. システムプロンプトビルダーテスト
**ファイル**: `lib/ai/__tests__/prompt-builder.test.ts`

**テストケース**:
- ✅ BigFiveスコアが正しくプロンプトに注入される
- ✅ パーソナリティタイプが反映される
- ✅ テーマごとにコンテキストが変わる
- ✅ 高神経症傾向ユーザーへの適応的トーン

#### C. チャットUIコンポーネントテスト
**ファイル**: `components/ai-chat/__tests__/ChatInterface.test.tsx`

**テストケース**:
- ✅ サジェスチョンチップが表示される
- ✅ タイピングインジケーターが表示される
- ✅ メッセージバブルが正しく表示される
- ✅ 送信ボタンが無効/有効を切り替える

#### D. E2Eテスト
**ファイル**: `tests/e2e/ai-consultation.spec.ts`

**テストケース**:
- ✅ 診断結果ページから「AI相談を開始」ボタンをクリック
- ✅ チャットインターフェースが表示される
- ✅ メッセージを送信してAI応答を受け取る
- ✅ サジェスチョンチップをクリックして送信

### 2. 実装

#### A. Gemini APIクライアント
**ファイル**: `lib/ai/gemini-client.ts`

**実装内容**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateResponse(params: {
    userMessage: string;
    bigFiveScores: BigFiveScores;
    personalityType: string;
    theme: 'career' | 'relationships' | 'growth';
    conversationHistory?: Message[];
  }): Promise<string> {
    const systemPrompt = buildSystemPrompt(params);
    const chat = this.model.startChat({
      history: params.conversationHistory || [],
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(params.userMessage);
    return result.response.text();
  }
}
```

**エラーハンドリング**:
- API key invalid
- Rate limit exceeded
- Network timeout
- Invalid response format

#### B. システムプロンプトビルダー
**ファイル**: `lib/ai/prompt-builder.ts`

**5層プロンプト構造**:
```typescript
export function buildSystemPrompt(params: {
  bigFiveScores: BigFiveScores;
  personalityType: string;
  theme: 'career' | 'relationships' | 'growth';
}): string {
  // Layer 1: ROLE
  const role = `あなたはココロ、若い大人向けの温かく洞察力のある性格コンサルタントです。
  丁寧でカジュアルな日本語（です/ます + 温かさ）で話します。
  顔文字を自然に使います。支援的な先輩であり、講師ではありません。`;

  // Layer 2: USER CONTEXT
  const context = `ユーザーのBigFiveスコア:
  開放性 ${params.bigFiveScores.openness}/100
  誠実性 ${params.bigFiveScores.conscientiousness}/100
  外向性 ${params.bigFiveScores.extraversion}/100
  協調性 ${params.bigFiveScores.agreeableness}/100
  神経症傾向 ${params.bigFiveScores.neuroticism}/100
  性格タイプ: ${params.personalityType}`;

  // Layer 3: ADAPTIVE STYLE
  const style = buildAdaptiveStyle(params.bigFiveScores);

  // Layer 4: THEME CONTEXT
  const themeContext = getThemeContext(params.theme);

  // Layer 5: SAFETY
  const safety = `クライシス検出キーワード: 「死にたい」「消えたい」など
  → すぐにクライシスリソースを提供（いのちの電話: 0120-783-556）
  診断はしない。人生を変える指示は出さない。
  アドバイスは探索としてフレーミングする。`;

  return `${role}\n\n${context}\n\n${style}\n\n${themeContext}\n\n${safety}`;
}
```

#### C. チャットUIコンポーネント
**ファイル**: `components/ai-chat/ChatInterface.tsx`

**UIコンポーネント**:
- `<MessageBubble>`: ユーザー/AIメッセージの表示
- `<SuggestionChips>`: 3つの開始プロンプト
- `<TypingIndicator>`: AI応答生成中のアニメーション
- `<ChatInput>`: ボトム固定、ソフトキーボード最適化

**モバイルファースト設計**:
- ボトム固定入力
- スクロール自動調整
- タッチ最適化

#### D. 診断結果ページへの導線
**ファイル**: `app/tests/bigfive/result/page.tsx`（既存）

**追加内容**:
```tsx
<button
  onClick={() => router.push('/ai-chat?theme=career')}
  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
>
  AI相談を開始 ✨
</button>
```

#### E. AI相談ページ
**ファイル**: `app/ai-chat/page.tsx`（新規）

**実装内容**:
- BigFive診断結果の取得（ローカルストレージまたはDB）
- ChatInterfaceコンポーネントの配置
- テーマパラメータの受け取り

#### F. 会話履歴管理
**ファイル**: `lib/utils/conversation-storage.ts`

**実装内容**:
- メッセージの保存（ローカルストレージまたはDB）
- 会話履歴の取得
- 5往復ごとの要約（トークン削減）

### 3. ドキュメント

#### A. 実装ドキュメント
**ファイル**: `.tmp/execution/iteration_03_20260326_1900/document.md`

**内容**:
- API仕様（Gemini Client、Prompt Builder）
- プロンプト設計（5層構造の詳細）
- UX設計（チャットフロー、サジェスチョンチップ）
- データフロー（診断結果 → プロンプト → AI応答）
- エラーハンドリング戦略
- 技術選定理由

#### B. セットアップガイド
**ファイル**: `.tmp/execution/iteration_03_20260326_1900/setup_guide.md`

**内容**:
- Gemini API Keyの取得方法
- 環境変数設定（.env.local）
- 依存関係のインストール（`@google/generative-ai`）
- ローカル開発サーバーの起動

#### C. テスト実行レポート
**ファイル**: `.tmp/execution/iteration_03_20260326_1900/test_logs/`

**内容**:
- 初回テスト失敗ログ（initial_test_failure.log）
- テスト成功ログ（success_test.log）
- E2Eテスト結果

## 推奨手順

### Phase 1: テスト作成（Red）
1. Gemini API統合テストを作成 → 失敗を確認
2. プロンプトビルダーテストを作成 → 失敗を確認
3. チャットUIコンポーネントテストを作成 → 失敗を確認
4. 失敗ログを保存（`initial_test_failure.log`）

### Phase 2: 最小実装（Green）
1. Gemini APIクライアントを実装
2. システムプロンプトビルダーを実装
3. テストが成功することを確認
4. チャットUIコンポーネントを実装
5. すべてのテストが成功することを確認
6. 成功ログを保存（`success_test.log`）

### Phase 3: 統合（Refactor）
1. 診断結果ページへの導線を追加
2. AI相談ページを実装
3. E2Eテストを実行
4. エラーハンドリングを強化
5. コードリファクタリング

### Phase 4: ドキュメント化
1. 実装ドキュメントを作成
2. セットアップガイドを作成
3. テスト結果を整理

## 品質基準

### テスト
- ✅ ユニットテスト: 20件以上、100%成功
- ✅ コンポーネントテスト: 10件以上、100%成功
- ✅ E2Eテスト: 5件以上、100%成功
- ✅ 境界値テスト: BigFiveスコア0/100の極端なケース
- ✅ 異常系テスト: APIエラー、ネットワークエラー、空入力

### 実装
- ✅ TypeScriptエラー0件
- ✅ ビルドエラー0件
- ✅ ESLint/Prettier準拠
- ✅ エラーハンドリング完備
- ✅ ローディング状態の適切な管理

### ドキュメント
- ✅ API仕様が明確
- ✅ プロンプト設計が文書化
- ✅ セットアップ手順が明確
- ✅ `.tmp` パスが完全に列挙

## 技術スタック

### 新規追加
- **@google/generative-ai**: Gemini API Node.js SDK
- **ai**: Vercel AI SDK（オプション、ストリーミング対応）

### 既存
- Next.js 15
- TypeScript 5.9
- Tailwind CSS
- Vitest（テスト）
- Playwright（E2E）

---LEADER OUTPUT END---

---CREATED FILES---
- C:\Users\yiwao\personality-platform\.tmp\leader_instructions\iteration_03_ai_consultation_plan.md

---NEXT AGENT INSTRUCTION---

## 📋 次のステップ：実行エージェントへ

以下の手順で実行を依頼してください：

### 1. 実行エージェント（ターミナル2）に貼り付ける内容

まず、上記の「---EXECUTION INSTRUCTION---」セクション全体をコピーしてください。

次に、実行プロンプト全体（https://github.com/Rih0z/Job-Automate/blob/main/Coding/Base/実行プロンプト.md）を貼り付けてください。

### 2. 貼り付け順序

```
【イテレーション計画】
[上記の ---EXECUTION INSTRUCTION--- セクション全体]

---

【実行プロンプト】
[実行プロンプト全体]
```

### 3. 実行後の流れ

実行エージェントが成果物を作成（テストファースト） → レビューエージェント（ターミナル3）で評価 → 100点でリーダーに戻る

### 4. 重要な注意事項

- **テストファースト厳守**: Gemini API統合テストとプロンプトビルダーテストを最初に作成し、失敗を確認すること
- **BigFive診断結果の取得方法を確認**: 現状の実装を調査し、取得方法を決定すること（仮定を文書化）
- **Gemini 2.5 Flash使用**: Gemini 1.5は廃止済みのため、2.5 Flashまたは2.5 Flash-Liteを使用
- **完全なドキュメント化**: すべてのファイルパスを `.tmp/execution/iteration_03_20260326_1900/` 配下に保存

---LONG TERM PLAN---

## 📍 実行中の長期的計画
- **パス**: C:\Users\yiwao\personality-platform\README.md（開発ロードマップセクション）
- **現在位置**: Phase 1: MVP + バイラル導線（2-4週間、P0）
- **このイテレーションの目標**: AI相談テンプレ（回数制限付き、Iteration-03）の実装
- **進捗更新**:
  - [x] BigFive性格診断（完了）
  - [x] 15タイプ性格分類（完了）
  - [x] OG画像生成API（完了）
  - [x] グラデーション配色システム（完了）
  - [x] 認証（Clerk、完了）
  - [ ] **AI相談テンプレ** ← 現在ここ（Iteration-03）
  - [ ] SNS共有テンプレ統合
  - [ ] 招待リンクで相性機能解放
  - [ ] データベース（Prisma + Supabase）

**参照**: README.md の「🗺️ 開発ロードマップ」セクション

**計画変更**: なし（計画通りに進行中）
