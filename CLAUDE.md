# CLAUDE.md -- Personality Platform v1

## あなたの役割

あなた（Claude Code）はこのプロジェクトの **テクニカルリード**。
目標: 性格診断×AI相談の統合プラットフォームを開発し、Z世代ユーザーに継続価値を提供する。

## プロジェクト概要

- **プロダクト名**: Personality Platform
- **コンセプト**: 「診断で入口、AI相談で継続価値」
- **ターゲット**: 日本のZ世代（18-29歳）、MBTI認知率67.3%の市場
- **差別化**: BigFive診断 + 性格適応型AI相談（Gemini 2.5 Flash）

## 絶対ルール

### 基本原則
| # | ルール | 参照 |
|---|--------|------|
| 1 | **テストファースト（TDD）** -- Red-Green-Refactorサイクル厳守。テストなき実装禁止 | `docs/` |
| 2 | **品質最優先** -- 100点になるまで妥協しない。同じ失敗を二度としない | `.tmp/review/` |
| 3 | **ドキュメント駆動** -- 非自明なタスクは計画・設計を立ててから実装 | `docs/` |
| 4 | **TypeScript必須** -- 型安全性を最優先。any禁止 | `tsconfig.json` |
| 5 | **Next.js App Router** -- Server ActionsとRoute Handlers活用 | |
| 6 | **環境変数管理** -- `.env.local`経由のみ。ハードコード絶対禁止 | `.env.example` |
| 7 | **Gitコミット規約** -- Conventional Commits準拠、Co-Authored-By必須 | |

### 開発ルール
| # | ルール | 参照 |
|---|--------|------|
| 8 | **3セッション分離** -- リーダー/実行/レビューを別セッションで行う | `.tmp/leader_instructions/`, `.tmp/review/` |
| 9 | **レビュー80点必達** -- 全成果物は別エージェントレビューで80点を超えるまで改善 | `.tmp/review/` |
| 10 | **イテレーション計画主導** -- `iteration_XX_*_plan.md`に従って実装 | `.tmp/leader_instructions/` |
| 11 | **`.tmp`保存必須** -- 全成果物・ログを`.tmp/`配下に保存し、完全パスを`---CREATED FILES---`で報告 | `.tmp/` |
| 12 | **モバイルファースト** -- すべてのUIはモバイル最適化を優先 | |
| 13 | **アクセシビリティ** -- WCAG 2.1 AA準拠 | |

### AI相談機能ルール（Iteration-03以降）
| # | ルール | 参照 |
|---|--------|------|
| 14 | **Gemini 2.5 Flash必須** -- Gemini 1.5は廃止済み。Flash or Flash-Liteのみ使用 | `docs/ai-consultation-design.md` |
| 15 | **5層プロンプト構造** -- Role/Context/Style/Theme/Safetyの順で構築 | `docs/ai-prompt-design-v2.md` |
| 16 | **BigFiveスコア動的注入** -- システムプロンプトにユーザーのスコアを注入 | 同上 |
| 17 | **ココロキャラクター厳守** -- 温かく支援的な先輩トーン、顔文字使用 | 同上 |
| 18 | **会話要約必須** -- 5往復ごとに要約してトークン削減（60-70%） | `docs/api-design.md` |
| 19 | **クライシス検出** -- 自傷・自殺キーワード検出→専門リソース提示 | `docs/ai-prompt-design-v2.md` |

### 品質ルール
| # | ルール | 参照 |
|---|--------|------|
| 20 | **E2Eテスト必須** -- Playwrightで主要フローを検証 | `tests/e2e/` |
| 21 | **ビルドエラー0件** -- TypeScriptエラー0件、ESLint/Prettier準拠 | |
| 22 | **レスポンシブテスト** -- モバイル（375px）、タブレット（768px）、デスクトップ（1280px）で検証 | |
| 23 | **Lighthouse 90点以上** -- Performance, Accessibility, Best Practices | |

## ドキュメント整理ルール

| 配置先 | 置くもの | 例 |
|--------|---------|-----|
| `docs/` | **現行**の設計・計画・戦略ドキュメント | `docs/ai-consultation-design.md` |
| `docs/archive/` | **旧版**・非推奨ドキュメント（参考用） | `docs/archive/project-plan-v1.md` |
| `.tmp/leader_instructions/` | イテレーション計画ファイル | `.tmp/leader_instructions/iteration_03_ai_consultation_plan.md` |
| `.tmp/execution/` | 実行エージェントの成果物 | `.tmp/execution/iteration_03_20260326_1900/` |
| `.tmp/review/` | レビューエージェントの結果 | `.tmp/review/iteration_03_20260326_2000_review/` |

**原則**: 現行ドキュメントは`docs/`、旧版は`docs/archive/`、作業中ファイルは`.tmp/`

## 業務別ドキュメント索引

**該当業務を行う際は、必ず対応ドキュメントを読んでから作業すること。**

> **全ドキュメント一覧** → [`docs/README.md`](docs/README.md)

### プロジェクト計画・戦略
| ドキュメント | パス |
|-------------|------|
| **プロジェクト計画書 v2** | `docs/project-plan-v2.md` |
| **収益化戦略** | `docs/monetization-strategy.md` |
| **価格実験計画** | `docs/pricing-experiment-plan.md` |

### AI相談機能（Iteration-03）
| ドキュメント | パス |
|-------------|------|
| **AI相談機能 詳細設計（英語）** | `docs/ai-consultation-design.md` |
| **AI相談機能 要約（日本語）** | `docs/ai-consultation-summary-ja.md` |
| **AIプロンプト設計書 v2.0** | `docs/ai-prompt-design-v2.md` |

**推奨閲読順序**:
1. `ai-consultation-summary-ja.md` - 概要把握
2. `ai-prompt-design-v2.md` - 実装詳細
3. `ai-consultation-design.md` - 背景・市場分析

### 技術設計
| ドキュメント | パス |
|-------------|------|
| **API設計書** | `docs/api-design.md` |
| **データベーススキーマ** | `docs/database-schema.md` |

### イテレーション計画（.tmp/leader_instructions/）
| イテレーション | 計画ファイル | ステータス |
|--------------|-------------|----------|
| Iteration-01 | `iteration_01_ui_auth_plan.md` | ✅ 完了（93点） |
| Iteration-03 | `iteration_03_ai_consultation_plan.md` | 📋 計画済み |

## イテレーション開発フロー

### 3セッション分離の原則

```
┌─────────────────┐
│  ターミナル1    │ リーダーエージェント
│  (リーダー)     │ - 計画策定
└─────────────────┘ - 実行指示生成
        │            - 次フェーズ判断
        ↓
┌─────────────────┐
│  ターミナル2    │ 実行エージェント
│  (実行)         │ - TDD実装
└─────────────────┘ - テスト作成
        │            - ドキュメント化
        ↓
┌─────────────────┐
│  ターミナル3    │ レビューエージェント
│  (レビュー)     │ - 80点必達レビュー
└─────────────────┘ - 改善指示
        │
        ↓
     100点達成
        │
        ↓
  次イテレーションへ
```

### イテレーション実行手順

#### 1. リーダーエージェント（ターミナル1）
```markdown
1. ユーザー要望 or レビュー100点結果を受け取る
2. 計画を策定（`.tmp/leader_instructions/iteration_XX_*_plan.md`）
3. 実行指示を生成（`---EXECUTION INSTRUCTION---`セクション）
4. 実行エージェントへの引き継ぎ指示を出力
```

#### 2. 実行エージェント（ターミナル2）
```markdown
1. 実行指示を受け取る
2. テストファースト（Red-Green-Refactor）で実装
3. 成果物を`.tmp/execution/iteration_XX_YYYYMMDD_HHMM/`に保存
4. `---OUTPUT DOCUMENT---`と`---CREATED FILES---`を出力
5. レビューエージェントへ提出
```

#### 3. レビューエージェント（ターミナル3）
```markdown
1. 実行エージェントの成果物を受け取る
2. 6カテゴリで100点満点評価
   - 目的・スコープ整合性（20点）
   - テスト戦略とカバレッジ（20点）
   - 実装品質と整合性（20点）
   - TDDエビデンス（15点）
   - ドキュメント&トレーサビリティ（15点）
   - 次イテレーション準備度（10点）
3. レビュー結果を`.tmp/review/iteration_XX_YYYYMMDD_HHMM_review/`に保存
4. 80点未満: 実行エージェントへ改善指示
5. 80-99点: 必須改善事項を指摘
6. 100点: リーダーエージェントへ報告
```

## 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **TypeScript 5.9**
- **Tailwind CSS 3**
- **shadcn/ui** (UIコンポーネント)

### AI統合
- **Google Gemini 2.5 Flash** (AI相談のメインモデル)
- **Gemini 2.5 Flash-Lite** (会話要約、分類タスク)

### バックエンド
- **Prisma** (ORM)
- **PostgreSQL** (Supabase推奨)

### 認証・決済
- **Clerk** (認証、Google OAuth)
- **Stripe** (サブスク + 単発課金)

### テスト
- **Vitest** (ユニットテスト)
- **React Testing Library** (コンポーネントテスト)
- **Playwright** (E2Eテスト)

### デプロイ
- **Vercel** (Next.js最適化)
- **Supabase** (PostgreSQL DB)

## プロジェクト構造

```
personality-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証ページ（sign-in, sign-up）
│   ├── (marketing)/              # マーケティングページ（layout）
│   ├── dashboard/                # 保護されたダッシュボード
│   ├── tests/                    # 診断テスト
│   │   └── bigfive/             # BigFive診断
│   ├── ai-chat/                  # AI相談ページ（Iteration-03）
│   └── api/                      # API Routes
│       ├── ai/chat              # AI相談API（Gemini統合）
│       └── og/bigfive/          # OG画像生成
├── components/                   # Reactコンポーネント
│   ├── ui/                      # shadcn/ui
│   ├── layout/                  # Header, MobileMenu
│   └── ai-chat/                 # ChatInterface（Iteration-03）
├── lib/                          # ユーティリティ
│   ├── ai/                      # Gemini Client, Prompt Builder
│   ├── tests/                   # BigFive計算ロジック
│   └── utils/                   # 汎用ユーティリティ
├── types/                        # TypeScript型定義
├── data/                         # 診断データ・質問セット
├── tests/                        # テスト
│   └── e2e/                     # Playwright E2Eテスト
├── docs/                         # 設計ドキュメント
│   ├── README.md                # ドキュメントナビゲーション
│   ├── ai-consultation-design.md
│   ├── ai-prompt-design-v2.md
│   ├── api-design.md
│   ├── database-schema.md
│   └── archive/                 # 旧版ドキュメント
├── .tmp/                         # 作業ファイル（7日後自動削除）
│   ├── leader_instructions/     # イテレーション計画
│   ├── execution/               # 実行エージェント成果物
│   └── review/                  # レビュー結果
├── .claude/                      # Claude Code設定
│   ├── settings.json            # プロジェクト設定
│   ├── hooks/                   # Gitフック
│   └── skills/                  # カスタムスキル
├── CLAUDE.md                     # このファイル
└── README.md                     # プロジェクト概要
```

## コーディング規約

### TypeScript
- `any`型禁止（`unknown`または適切な型を使用）
- すべての関数に型注釈
- `strict: true`設定

### Next.js
- App Router使用（Pages Router禁止）
- Server Actions活用（APIルートは必要最小限）
- `use client`は必要な場合のみ

### スタイリング
- Tailwind CSS優先
- インラインスタイル禁止
- shadcn/uiコンポーネントを積極的に活用

### テスト
- すべての関数にユニットテスト
- E2Eテストで主要フローをカバー
- テストカバレッジ80%以上

### Gitコミット
- Conventional Commits準拠
- 必ず`Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`を付与
- コミット前にビルドエラー0件を確認

## 環境変数管理

```bash
# .env.local（Gitには含めない）
DATABASE_URL=              # Supabase PostgreSQL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
GEMINI_API_KEY=           # Google AI Studio
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

`.env.example`を参考に`.env.local`を作成。
環境変数は`process.env.XXX`経由でのみアクセス。

## 起動時タスク

### 毎セッション実行すること

1. **ステータス確認**
   ```bash
   cd personality-platform
   git status
   npm run build  # ビルドエラーチェック
   ```

2. **最新ドキュメント確認**
   - `docs/README.md`で最新のドキュメント一覧を確認
   - 該当するイテレーション計画を読む

3. **レビュー結果確認**（継続作業の場合）
   - `.tmp/review/`で最新のレビュー結果を確認
   - 改善指示がある場合は対応

## 開発ロードマップ

### Phase 0: プラットフォーム基盤（完了）
- [x] Clerk認証統合（Google OAuth）
- [x] Portfolio Wise風UI
- [x] E2Eテスト基盤（Playwright）

### Phase 1: MVP + バイラル導線（進行中）
- [x] BigFive性格診断（20問短縮版）
- [x] 15タイプ性格分類
- [x] OG画像生成API
- [x] グラデーション配色システム
- [ ] **AI相談機能 MVP** ← 現在ここ（Iteration-03）
  - Gemini 2.5 Flash統合
  - キャリア相談テーマ
  - 5層システムプロンプト
  - モバイルファーストチャットUI
- [ ] SNS共有テンプレ統合
- [ ] データベース（Prisma + Supabase）

### Phase 2: AI相談拡張 + 課金
- [ ] 人間関係・自己成長テーマ追加
- [ ] インサイト保存機能
- [ ] Stripe決済（¥980/月 Standard、¥1,980/月 Premium）
- [ ] 週次サマリー生成
- [ ] 「今週の実験」機能

### Phase 3: SEO + 拡張
- [ ] タイプ別SEOページ
- [ ] 再診断+差分表示
- [ ] PDF詳細レポート

### Phase 4: B2B
- [ ] Team Liteセルフサーブ
- [ ] チームダッシュボード

## 成功指標（KPI）

### MVP成功基準
- **30日リターン率**: >25%
- **1セッションあたり往復数**: 6-10回
- **無料→有料CVR**: 2-3%

### 1年後目標
- **MAU**: 30,000-100,000人
- **有料ユーザー**: 600-3,000人
- **MRR**: ¥600,000-¥3,000,000

## トラブルシューティング

### ビルドエラー
```bash
# TypeScriptエラー確認
npm run type-check

# ESLint確認
npm run lint

# クリーンビルド
rm -rf .next
npm run build
```

### Gemini APIエラー
- API Keyの確認（`.env.local`）
- 無料枠制限の確認（Flash: ~250 RPD）
- モデル名の確認（`gemini-2.5-flash`）

### Clerkエラー
- PublishableKeyとSecretKeyの確認
- Clerk Dashboardでドメイン設定確認

## プロジェクトリンク

- **GitHubリポジトリ**: https://github.com/Ezark213/personality-platform
- **デモサイト**: https://personality-platform.vercel.app（準備中）
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Supabase Dashboard**: https://app.supabase.com
- **Google AI Studio**: https://makersuite.google.com/app/apikey

---

**Built with ❤️ using Next.js and Claude Code**
