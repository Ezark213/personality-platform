# Iteration-03 実行指示書

**宛先**: 実行エージェント（ターミナル2）
**発行元**: リーダーエージェント
**発行日時**: 2026-03-26

---

## 📌 実行する内容

**Iteration-03: 認証フロー最適化 + AI相談機能MVP**

計画書: `.tmp/leader_instructions/iteration_03_auth_flow_optimization_and_ai_mvp_plan.md`

---

## 🎯 目標

1. **Phase 1（認証フロー最適化）**: 診断結果ページを未ログインで閲覧可能にし、ログイン/SNS共有を選択可能にする
2. **Phase 2（AI相談機能MVP）**: Gemini 2.5 Flash統合によるキャリア相談機能を実装する

---

## 📝 実行手順

### ステップ1: 環境準備

```bash
cd personality-platform

# 作業ディレクトリ作成
mkdir -p .tmp/execution/iteration_03_$(date +%Y%m%d_%H%M)
cd .tmp/execution/iteration_03_$(date +%Y%m%d_%H%M)

# 計画書確認
cat ../../leader_instructions/iteration_03_auth_flow_optimization_and_ai_mvp_plan.md
```

### ステップ2: Phase 1実装（認証フロー最適化）

#### Task 1-1: ミドルウェア修正

**Red（失敗するテストを書く）**:
```bash
# tests/middleware.test.ts を作成
# - 保護ルート: /dashboard, /profile, /settings, /ai-chat
# - 公開ルート: /tests/*/result, /tests, /
```

**Green（テストをパスさせる）**:
```bash
# middleware.ts を修正
# - /tests/(.*)/result(.*)' を削除
# - /ai-chat(.*)' を追加
```

**Refactor（コードを改善）**:
```bash
# コメント更新、コード整理
```

**テスト実行**:
```bash
npm test -- tests/middleware.test.ts
```

#### Task 1-2: 診断結果ページにログインCTA追加

**Red**:
```bash
# tests/components/tests/ResultAuthCTA.test.tsx を作成
# - 未ログイン時: 「結果を保存してAI相談を始める」ボタン表示
# - ログイン済み: 「AI相談を始める」リンク表示
```

**Green**:
```bash
# components/tests/ResultAuthCTA.tsx を作成
# - Clerk <SignInButton> 使用
# - useUser() でログイン状態判定
# - redirectUrl で結果ページに戻る
```

**Refactor**:
```bash
# app/tests/bigfive/result/page.tsx に統合
# - 既存のシェアセクションの下に配置
```

**テスト実行**:
```bash
npm test -- tests/components/tests/ResultAuthCTA.test.tsx
```

#### Task 1-3: 他の診断結果ページにも適用

```bash
# 以下のページに ResultAuthCTA コンポーネントを追加:
# - app/tests/bigfive/short/result/page.tsx
# - app/tests/bigfive/detail/result/page.tsx
# - app/tests/aptitude/result/page.tsx
# - app/tests/love-type/result/page.tsx
```

### ステップ3: Phase 2実装（AI相談機能MVP）

#### Task 2-1: Gemini API統合

**パッケージインストール**:
```bash
npm install @google/generative-ai zod
```

**Red**:
```bash
# tests/lib/ai/gemini-client.test.ts を作成
# - APIモック呼び出し成功
# - エラーハンドリング（401, 429, 500）
```

**Green**:
```bash
# lib/ai/gemini-client.ts を作成
# - GoogleGenerativeAI クライアント初期化
# - sendMessage() 関数実装
# - エラーハンドリング
```

**環境変数**:
```bash
# .env.local に追加
GEMINI_API_KEY=your_api_key_here

# .env.example に追加
GEMINI_API_KEY=
```

#### Task 2-2: システムプロンプトビルダー

**Red**:
```bash
# tests/lib/ai/prompt-builder.test.ts を作成
# - 5層プロンプト生成
# - BigFiveスコア注入
# - スナップショットテスト
```

**Green**:
```bash
# lib/ai/prompt-builder.ts を作成
# - buildSystemPrompt() 関数実装
# - docs/ai-prompt-design-v2.md の仕様に準拠
```

#### Task 2-3: データベーススキーマ実装

**既存スキーマ確認**:
```bash
cat prisma/schema.prisma | grep -A 20 "model AiConversation"
```

**マイグレーション**:
```bash
# すでに存在する場合はスキップ
# 存在しない場合:
npx prisma migrate dev --name add_ai_conversation_models
```

#### Task 2-4: AI相談API実装

**Red**:
```bash
# tests/app/api/ai/chat/route.test.ts を作成
# - リクエスト検証（Zod）
# - 正常系: 会話送信→返信受信
# - 異常系: 無効なリクエスト
```

**Green**:
```bash
# app/api/ai/chat/route.ts を作成
# - POST /api/ai/chat エンドポイント
# - Gemini API呼び出し
# - 会話履歴の保存（Prisma）
```

#### Task 2-5: AI相談ページUI実装

**Red**:
```bash
# tests/app/ai-chat/page.test.tsx を作成
# - メッセージ送信フォーム
# - 会話履歴表示
```

**Green**:
```bash
# app/ai-chat/page.tsx を作成
# - チャットUI（モバイルファースト）
# - メッセージ送信
# - ローディング状態
```

#### Task 2-6: 診断結果とAI相談の連携

```bash
# app/tests/bigfive/result/page.tsx を修正
# - BigFiveスコアをURLパラメータで渡す
# - AI相談開始ボタンに遷移処理追加
```

### ステップ4: E2Eテスト実行

```bash
# E2Eテスト作成・実行
npm run test:e2e -- tests/e2e/auth-flow.spec.ts
npm run test:e2e -- tests/e2e/ai-consultation.spec.ts
```

### ステップ5: ビルドチェック

```bash
# TypeScriptエラー確認
npm run type-check

# ESLint確認
npm run lint

# ビルド実行
npm run build
```

---

## 📤 報告形式（OUTPUT DOCUMENT）

実装完了後、以下の形式で報告してください:

```markdown
---OUTPUT DOCUMENT---

# Iteration-03 実行レポート

作成日時: YYYY-MM-DD HH:MM
実行エージェント: Claude Sonnet 4.5

## 実装完了タスク

### Phase 1: 認証フロー最適化

- [x] Task 1-1: ミドルウェア修正
  - 実装内容: [詳細]
  - テスト結果: PASS (X tests)
  - ファイル: `middleware.ts`, `tests/middleware.test.ts`

- [x] Task 1-2: 診断結果ページにログインCTA追加
  - 実装内容: [詳細]
  - テスト結果: PASS (X tests)
  - ファイル: [リスト]

[... 他のタスクも同様に記載 ...]

## TDDサイクル証跡

### Task 1-1: ミドルウェア修正

#### Red（失敗するテスト）
```bash
$ npm test -- tests/middleware.test.ts
FAIL tests/middleware.test.ts
  ✕ should allow unauthenticated access to BigFive result page (X ms)
```

#### Green（テストパス）
```bash
$ npm test -- tests/middleware.test.ts
PASS tests/middleware.test.ts
  ✓ should allow unauthenticated access to BigFive result page (X ms)
```

[... 他のタスクも同様に ...]

## テスト実行結果

### ユニットテスト
```
[npm test の出力をコピー]
```

### E2Eテスト
```
[npm run test:e2e の出力をコピー]
```

## ビルド結果

```bash
$ npm run build
[ビルド出力をコピー]
```

## 成功基準達成状況

### Phase 1: 認証フロー最適化
- [x] 診断結果ページが未ログインで閲覧可能
- [x] SNS共有機能が未ログインで利用可能
- [x] 「結果を保存してAI相談」ボタンでログインを促す
- [x] E2Eテスト成功

### Phase 2: AI相談機能MVP
- [x] Gemini 2.5 Flash API統合
- [x] `/ai-chat` ページ作成
- [x] BigFiveスコア注入
- [x] 5層プロンプト構造実装
- [x] E2Eテスト成功

## 成果物

---CREATED FILES---
/absolute/path/to/middleware.ts
/absolute/path/to/tests/middleware.test.ts
/absolute/path/to/components/tests/ResultAuthCTA.tsx
/absolute/path/to/tests/components/tests/ResultAuthCTA.test.tsx
/absolute/path/to/lib/ai/gemini-client.ts
/absolute/path/to/tests/lib/ai/gemini-client.test.ts
/absolute/path/to/lib/ai/prompt-builder.ts
/absolute/path/to/tests/lib/ai/prompt-builder.test.ts
/absolute/path/to/app/api/ai/chat/route.ts
/absolute/path/to/tests/app/api/ai/chat/route.test.ts
/absolute/path/to/app/ai-chat/page.tsx
/absolute/path/to/tests/app/ai-chat/page.test.tsx
/absolute/path/to/tests/e2e/auth-flow.spec.ts
/absolute/path/to/tests/e2e/ai-consultation.spec.ts
.tmp/execution/iteration_03_YYYYMMDD_HHMM/execution_report.md
---END CREATED FILES---

## ドキュメント更新

- [x] README.md: Phase 1進捗更新
- [x] .env.example: GEMINI_API_KEY追加

## 次のステップ

レビューエージェント（ターミナル3）による80点必達レビューを依頼します。

---END OUTPUT DOCUMENT---
```

---

## ⚠️ 重要な注意事項

### 1. TDDサイクル厳守

- 各タスクで**必ず**Red-Green-Refactorサイクルを実行
- テストファーストで実装（実装コードを書く前にテストを書く）
- TDDサイクルの証跡を記録（Red/Green/Refactorの各段階でテスト出力を保存）

### 2. Phase順守

- **Phase 1を完全に完了してからPhase 2に進むこと**
- Phase 1のE2Eテストが全てパスしてから次へ

### 3. 品質基準

- TypeScriptエラー: 0件必須
- ESLint/Prettier: 準拠必須
- ビルド: 成功必須
- テストカバレッジ: 主要機能をカバー

### 4. 成果物保存

- 全ての成果物を `.tmp/execution/iteration_03_YYYYMMDD_HHMM/` に保存
- テスト出力ログも保存
- スクリーンショット（E2Eテスト）も保存

### 5. エラー発生時

- エラーメッセージを記録
- 解決方法を試す
- 解決できない場合、リーダーエージェント（ターミナル1）に報告

---

## 🚀 実行開始

この指示書を読み終えたら、すぐに実装を開始してください。

**実装完了後、OUTPUT DOCUMENT形式で報告し、レビューエージェント（ターミナル3）に提出してください。**

---

発行元: リーダーエージェント（Claude Sonnet 4.5）
発行日時: 2026-03-26
