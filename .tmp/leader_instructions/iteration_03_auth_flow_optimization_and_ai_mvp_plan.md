# Iteration-03: 認証フロー最適化 + AI相談機能MVP

作成日時: 2026-03-26
リーダーエージェント: Claude Sonnet 4.5

## 目標

1. **認証フロー最適化**: 診断結果ページを未ログインでも閲覧可能にし、ログイン/SNS共有を選択可能にする
2. **AI相談機能MVP**: Gemini 2.5 Flash統合によるキャリア相談機能を実装する

## 背景・問題点

### 現状の問題
- `middleware.ts` で `/tests/(.*)/result(.*)` が保護ルート指定されている
- 診断完了後、**未ログインユーザーは問答無用でログイン画面にリダイレクト**される
- SNS共有機能は実装済みだが、ログイン前に使えない

### 理想のUXフロー
```
診断完了
  ↓
結果表示（未ログイン可）
  ↓
ユーザーに選択肢を提示:
  1. SNS共有（未ログイン可）
  2. 結果を保存してAI相談（ログイン必要）
  3. もう一度診断する（未ログイン可）
```

## 成功基準

### Phase 1: 認証フロー最適化（P0・必須）
- [ ] 診断結果ページが未ログインで閲覧可能
- [ ] SNS共有機能が未ログインで利用可能
- [ ] 「結果を保存してAI相談」ボタンでログインを促す
- [ ] ログイン後、元の結果ページに戻る（診断データ保持）
- [ ] E2Eテスト: 未ログイン→診断→結果表示→SNS共有が成功
- [ ] E2Eテスト: 未ログイン→診断→結果表示→ログイン→AI相談が成功

### Phase 2: AI相談機能MVP（P1・必須）
- [ ] Gemini 2.5 Flash API統合
- [ ] `/ai-chat` ページ作成（ログイン必須）
- [ ] BigFiveスコアをシステムプロンプトに注入
- [ ] 5層プロンプト構造実装（Role/Context/Style/Theme/Safety）
- [ ] キャリア相談テーマのみサポート
- [ ] 会話履歴の保存（AiConversation, AiMessageモデル）
- [ ] E2Eテスト: ログイン→AI相談→会話送信→返信受信が成功

## タスク分解

### Phase 1: 認証フロー最適化（所要時間: 2-3時間）

#### Task 1-1: ミドルウェア修正（P0）
- **実装内容**:
  - `middleware.ts` から `/tests/(.*)/result(.*)` を削除
  - `/ai-chat(.*)` を保護ルートに追加
  - コメント更新
- **テスト内容**:
  - ユニットテスト: `middleware.test.ts` で保護ルートのマッチングを検証
  - E2Eテスト: 未ログイン状態で `/tests/bigfive/result?data=XXX&id=YYY` にアクセスできることを確認

#### Task 1-2: 診断結果ページにログインCTA追加（P0）
- **実装内容**:
  - `app/tests/bigfive/result/page.tsx` に新しいセクション追加
  - 「結果を保存してAI相談を始める」ボタン（未ログイン時のみ表示）
  - Clerk `<SignInButton>` コンポーネント使用、`redirectUrl` で結果ページに戻る
  - ログイン済みの場合、「AI相談を始める」ボタン（`/ai-chat` へ遷移）
- **テスト内容**:
  - コンポーネントテスト: 未ログイン時にボタンが表示されることを確認
  - コンポーネントテスト: ログイン済み時に `/ai-chat` リンクが表示されることを確認
  - E2Eテスト: ボタンクリック→ログイン→元のページに戻る

#### Task 1-3: 他の診断結果ページにも適用（P1）
- **実装内容**:
  - `app/tests/bigfive/short/result/page.tsx`
  - `app/tests/bigfive/detail/result/page.tsx`
  - `app/tests/aptitude/result/page.tsx`
  - `app/tests/love-type/result/page.tsx`
  - 共通コンポーネント化（`components/tests/ResultAuthCTA.tsx`）
- **テスト内容**:
  - 各診断の結果ページで同じ動作を確認

### Phase 2: AI相談機能MVP（所要時間: 4-6時間）

#### Task 2-1: Gemini API統合（P0）
- **実装内容**:
  - `lib/ai/gemini-client.ts` 作成
  - `@google/generative-ai` パッケージインストール
  - `GEMINI_API_KEY` 環境変数設定
  - エラーハンドリング（APIレート制限、ネットワークエラー）
- **テスト内容**:
  - ユニットテスト: Gemini APIのモック呼び出し成功
  - ユニットテスト: エラーハンドリング（401, 429, 500）

#### Task 2-2: システムプロンプトビルダー（P0）
- **実装内容**:
  - `lib/ai/prompt-builder.ts` 作成
  - 5層構造実装（Role/Context/Style/Theme/Safety）
  - BigFiveスコア動的注入
  - `docs/ai-prompt-design-v2.md` の仕様に準拠
- **テスト内容**:
  - ユニットテスト: 各層が正しく生成されることを確認
  - ユニットテスト: BigFiveスコアが正しく注入されることを確認
  - スナップショットテスト: プロンプト全体の構造確認

#### Task 2-3: データベーススキーマ実装（P0）
- **実装内容**:
  - Prismaスキーマに以下を追加:
    - `AiConversation` モデル
    - `AiMessage` モデル
    - `AiInsight` モデル（将来拡張用）
  - `prisma migrate dev` で適用
- **テスト内容**:
  - マイグレーション成功確認
  - Prisma Clientで各モデルのCRUD操作確認

#### Task 2-4: AI相談API実装（P0）
- **実装内容**:
  - `app/api/ai/chat/route.ts` 作成
  - POST /api/ai/chat エンドポイント
  - リクエスト検証（Zod）
  - Gemini API呼び出し
  - 会話履歴の保存
  - レスポンス形式: `{ reply: string, conversationId: string }`
- **テスト内容**:
  - APIテスト: 正常系（会話送信→返信受信）
  - APIテスト: 異常系（無効なリクエスト、APIエラー）
  - ユニットテスト: バリデーションロジック

#### Task 2-5: AI相談ページUI実装（P0）
- **実装内容**:
  - `app/ai-chat/page.tsx` 作成
  - チャットUI（モバイルファースト）
  - メッセージ送信フォーム
  - 会話履歴表示
  - ローディング状態
  - エラー表示
- **テスト内容**:
  - コンポーネントテスト: メッセージ送信フォーム
  - コンポーネントテスト: 会話履歴表示
  - E2Eテスト: ログイン→メッセージ送信→返信受信

#### Task 2-6: 診断結果とAI相談の連携（P1）
- **実装内容**:
  - 診断結果ページから `/ai-chat` に遷移時、BigFiveスコアを引き継ぐ
  - URLパラメータ or sessionStorage でスコア渡す
  - AI相談開始時に会話履歴に診断結果を自動追加
- **テスト内容**:
  - E2Eテスト: 診断完了→ログイン→AI相談開始→スコア反映確認

## テスト戦略

### ユニットテスト
- `middleware.test.ts`: 保護ルートのマッチング
- `lib/ai/gemini-client.test.ts`: Gemini API呼び出し、エラーハンドリング
- `lib/ai/prompt-builder.test.ts`: 5層プロンプト生成、スコア注入
- `app/api/ai/chat/route.test.ts`: APIバリデーション、ビジネスロジック

### コンポーネントテスト
- `components/tests/ResultAuthCTA.test.tsx`: ログイン状態別の表示
- `app/ai-chat/page.test.tsx`: チャットUI、メッセージ送信

### E2Eテスト（Playwright）
- `tests/e2e/auth-flow.spec.ts`:
  - 未ログイン診断→結果表示→SNS共有
  - 未ログイン診断→結果表示→ログイン→AI相談
- `tests/e2e/ai-consultation.spec.ts`:
  - ログイン→AI相談ページ→メッセージ送信→返信受信
  - 診断完了→ログイン→AI相談→スコア反映確認

## ドキュメント更新

- [ ] `README.md`: Phase 1進捗更新（AI相談機能MVP追加）
- [ ] `docs/api-design.md`: `/api/ai/chat` エンドポイント追加
- [ ] `docs/database-schema.md`: AiConversation/AiMessage/AiInsight追加確認
- [ ] `.env.example`: `GEMINI_API_KEY` 追加

## レビュー観点

レビューエージェントが確認すべき6カテゴリ:

### 1. 目的・スコープ整合性（20点）
- Phase 1: 診断結果ページが未ログインで閲覧可能
- Phase 2: AI相談機能が動作する
- スコープ外実装がない（会話要約、複数テーマは未実装）

### 2. テスト戦略とカバレッジ（20点）
- ユニットテスト: Gemini API、プロンプトビルダー、API検証
- E2Eテスト: 認証フロー、AI相談フロー
- 全テストが実際に実行され、結果が記録されている

### 3. 実装品質と整合性（20点）
- TypeScriptエラー0件
- ESLint/Prettier準拠
- ビルド成功
- `docs/ai-prompt-design-v2.md` の仕様に準拠

### 4. TDDエビデンス（15点）
- Red-Green-Refactorサイクルの証跡
- テストファーストで実装

### 5. ドキュメント&トレーサビリティ（15点）
- 実行レポート完全（OUTPUT DOCUMENT形式）
- CREATED FILESに全成果物の完全パス
- コードコメント適切

### 6. 次イテレーション準備度（10点）
- 会話要約機能の拡張可能性（Phase 3準備）
- 複数テーマ対応の拡張可能性
- 技術的負債が最小限

## 技術スタック

- **フロントエンド**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash (`@google/generative-ai`)
- **認証**: Clerk (`@clerk/nextjs`)
- **データベース**: Prisma + PostgreSQL (Supabase)
- **テスト**: Vitest (ユニット), React Testing Library (コンポーネント), Playwright (E2E)

## 依存関係

### 新規パッケージインストール
```bash
npm install @google/generative-ai zod
npm install -D @types/node
```

### 環境変数追加（`.env.local`）
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## リスクと対策

### リスク1: Gemini API無料枠制限
- **リスク**: Flash無料枠は約250 RPD（Requests Per Day）
- **対策**: 会話回数をセッションあたり10往復に制限、超過時は翌日再試行を促す

### リスク2: 診断データの引き継ぎ
- **リスク**: URLパラメータが長すぎる、sessionStorageが消える
- **対策**: 診断完了時にPrismaで結果を保存、ログイン後にDBから取得

### リスク3: プロンプトインジェクション
- **リスク**: ユーザー入力がシステムプロンプトを破壊
- **対策**: ユーザー入力のサニタイズ、Gemini Safety Settings有効化

## 次イテレーション準備（Phase 3）

以下の機能は今回実装せず、Phase 3以降に拡張:

- [ ] 会話要約機能（5往復ごとに要約）
- [ ] 人間関係・自己成長テーマ追加
- [ ] インサイト保存機能
- [ ] 週次サマリー生成
- [ ] Stripe決済統合

---

## EXECUTION INSTRUCTION

**実行エージェント（ターミナル2）へ**:

### 実行手順

1. **このファイル全体を読み、Phase 1から順に実装してください**
2. **TDDサイクル（Red-Green-Refactor）を厳守してください**:
   - Red: 失敗するテストを書く
   - Green: テストをパスさせる最小実装
   - Refactor: コードを改善
3. **各タスク完了後、該当するテストを実行し、結果を記録してください**
4. **すべての成果物を `.tmp/execution/iteration_03_YYYYMMDD_HHMM/` に保存してください**
5. **実装完了後、以下のフォーマットで成果物を報告してください**:

---OUTPUT DOCUMENT---

# Iteration-03 実行レポート

作成日時: YYYY-MM-DD HH:MM
実行エージェント: Claude Sonnet 4.5

## 実装完了タスク

### Phase 1: 認証フロー最適化

- [x] Task 1-1: ミドルウェア修正
  - 実装内容: `/tests/(.*)/result(.*)` を保護ルートから削除、`/ai-chat(.*)` を追加
  - テスト結果: PASS (X tests)
  - ファイル: `middleware.ts`, `middleware.test.ts`

- [x] Task 1-2: 診断結果ページにログインCTA追加
  - 実装内容: `<SignInButton>` 統合、ログイン済み時は `/ai-chat` リンク
  - テスト結果: PASS (X tests)
  - ファイル: `app/tests/bigfive/result/page.tsx`

- [x] Task 1-3: 他の診断結果ページにも適用
  - 実装内容: 共通コンポーネント `ResultAuthCTA.tsx` 作成
  - テスト結果: PASS (X tests)
  - ファイル: `components/tests/ResultAuthCTA.tsx`

### Phase 2: AI相談機能MVP

- [x] Task 2-1: Gemini API統合
  - 実装内容: `@google/generative-ai` 統合、エラーハンドリング
  - テスト結果: PASS (X tests)
  - ファイル: `lib/ai/gemini-client.ts`, `lib/ai/gemini-client.test.ts`

- [x] Task 2-2: システムプロンプトビルダー
  - 実装内容: 5層構造、BigFiveスコア注入
  - テスト結果: PASS (X tests)
  - ファイル: `lib/ai/prompt-builder.ts`, `lib/ai/prompt-builder.test.ts`

- [x] Task 2-3: データベーススキーマ実装
  - 実装内容: AiConversation, AiMessage, AiInsight追加
  - テスト結果: Migration success
  - ファイル: `prisma/schema.prisma`, `prisma/migrations/...`

- [x] Task 2-4: AI相談API実装
  - 実装内容: POST /api/ai/chat エンドポイント
  - テスト結果: PASS (X tests)
  - ファイル: `app/api/ai/chat/route.ts`, `app/api/ai/chat/route.test.ts`

- [x] Task 2-5: AI相談ページUI実装
  - 実装内容: チャットUI（モバイルファースト）
  - テスト結果: PASS (X tests)
  - ファイル: `app/ai-chat/page.tsx`

- [x] Task 2-6: 診断結果とAI相談の連携
  - 実装内容: BigFiveスコア引き継ぎ
  - テスト結果: PASS (X tests)
  - ファイル: 複数ファイル修正

## TDDサイクル証跡

### Task 1-1: ミドルウェア修正

#### Red（失敗するテスト）
```bash
$ npm test -- middleware.test.ts
FAIL tests/middleware.test.ts
  ✕ should allow access to /tests/bigfive/result without auth (X ms)
```

#### Green（テストパス）
```bash
$ npm test -- middleware.test.ts
PASS tests/middleware.test.ts
  ✓ should allow access to /tests/bigfive/result without auth (X ms)
```

[... 他のタスクのTDDサイクルも同様に記載 ...]

## テスト実行結果

### ユニットテスト
```
Test Suites: X passed, X total
Tests:       X passed, X total
Time:        X.XXs
```

### コンポーネントテスト
```
Test Suites: X passed, X total
Tests:       X passed, X total
Time:        X.XXs
```

### E2Eテスト
```
Running X test(s)
  ✓ Auth flow: unauthenticated → test → result → SNS share (Xms)
  ✓ Auth flow: unauthenticated → test → result → login → AI chat (Xms)
  ✓ AI consultation: login → chat → send message → receive reply (Xms)
X passed (Xs)
```

## ビルド結果

```bash
$ npm run build
✓ Compiled successfully
```

## 成功基準達成状況

### Phase 1: 認証フロー最適化
- [x] 診断結果ページが未ログインで閲覧可能
- [x] SNS共有機能が未ログインで利用可能
- [x] 「結果を保存してAI相談」ボタンでログインを促す
- [x] ログイン後、元の結果ページに戻る
- [x] E2Eテスト成功

### Phase 2: AI相談機能MVP
- [x] Gemini 2.5 Flash API統合
- [x] `/ai-chat` ページ作成（ログイン必須）
- [x] BigFiveスコアをシステムプロンプトに注入
- [x] 5層プロンプト構造実装
- [x] キャリア相談テーマのみサポート
- [x] 会話履歴の保存
- [x] E2Eテスト成功

## 成果物

---CREATED FILES---
/absolute/path/to/middleware.ts
/absolute/path/to/middleware.test.ts
/absolute/path/to/app/tests/bigfive/result/page.tsx
/absolute/path/to/components/tests/ResultAuthCTA.tsx
/absolute/path/to/components/tests/ResultAuthCTA.test.tsx
/absolute/path/to/lib/ai/gemini-client.ts
/absolute/path/to/lib/ai/gemini-client.test.ts
/absolute/path/to/lib/ai/prompt-builder.ts
/absolute/path/to/lib/ai/prompt-builder.test.ts
/absolute/path/to/prisma/schema.prisma
/absolute/path/to/prisma/migrations/...
/absolute/path/to/app/api/ai/chat/route.ts
/absolute/path/to/app/api/ai/chat/route.test.ts
/absolute/path/to/app/ai-chat/page.tsx
/absolute/path/to/app/ai-chat/page.test.tsx
/absolute/path/to/tests/e2e/auth-flow.spec.ts
/absolute/path/to/tests/e2e/ai-consultation.spec.ts
.tmp/execution/iteration_03_YYYYMMDD_HHMM/execution_report.md
.tmp/execution/iteration_03_YYYYMMDD_HHMM/test_output.log
.tmp/execution/iteration_03_YYYYMMDD_HHMM/screenshots/
---END CREATED FILES---

## ドキュメント更新

- [x] README.md: Phase 1進捗更新
- [x] docs/api-design.md: `/api/ai/chat` 追加
- [x] .env.example: `GEMINI_API_KEY` 追加

## 次のステップ

レビューエージェントによる80点必達レビューを依頼します。

---END OUTPUT DOCUMENT---

### 注意事項

1. **Phase 1を完了してからPhase 2に進むこと**
2. **各タスクでRed-Green-Refactorサイクルを実行すること**
3. **テスト結果を必ず記録すること**
4. **ビルドエラーが0件であることを確認すること**
5. **E2Eテストは最後に実行すること**

### 実行開始

このファイルを読み終えたら、すぐに実装を開始してください。
TDDを厳守し、品質最優先で進めてください。

実装完了後、レビューエージェント（ターミナル3）に提出してください。

---

**計画策定完了**: 2026-03-26
**リーダーエージェント**: Claude Sonnet 4.5
