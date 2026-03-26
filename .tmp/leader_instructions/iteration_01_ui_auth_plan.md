---LEADER OUTPUT START---

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-01
- 参照レビュー: 初回
- 作成日時: 2026-03-26 11:00
- ゴール: Portfolio Wise風UIとGoogle OAuth認証の実装
- 成功判定: ログインフローのE2Eテストが緑になり、トップページがPortfolio Wiseのデザインを再現できている

---PROJECT PLAN---

# イテレーション計画

## 概要
Portfolio Wise（https://portfolio-wise.com/）のUI/UXを参考に、personality-platformのトップページと認証機能を実装します。

## スコープ
### 含まれる対象
- トップページのレイアウト・デザイン（Portfolio Wise風）
- ヘッダーナビゲーション
- Google OAuth認証（Clerk使用）
- ログイン/ログアウトフロー
- レスポンシブデザイン（モバイル対応）
- カラースキームの適用（青系プライマリ）

### 対象外
- ダッシュボード機能（次回イテレーション）
- 診断テスト機能（次回イテレーション）
- AI相談機能（次回イテレーション）
- 決済機能（次回イテレーション）

## 引き継ぎ情報
- 初回イテレーション
- Portfolio Wiseのスクリーンショット取得完了（C:\Users\yiwao\Downloads\portfolio-wise-screenshots\）
- プロジェクト計画書v2に基づく開発
- 既存技術スタック: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui

## テストファースト戦略

### 先に書くべきテスト
1. **E2Eテスト（Playwright）**:
   - ログインフローのテスト
     - トップページにアクセス
     - ログインボタンをクリック
     - Google OAuthにリダイレクト
     - 認証後にダッシュボードにリダイレクト
   - ログアウトフローのテスト
     - ログイン状態からログアウト
     - トップページに戻る

2. **コンポーネントテスト（Vitest + React Testing Library）**:
   - Header コンポーネント
     - ロゴが表示される
     - ナビゲーションリンクが正しく表示される
     - ログイン状態に応じてボタンが切り替わる
   - HeroSection コンポーネント
     - 見出しと説明が表示される
     - CTAボタンが表示される

### 失敗させたい代表入力
- 未認証状態でダッシュボードにアクセス → ログインページにリダイレクト
- ログイン後にトップページにアクセス → ログイン状態が保持される
- ログアウト後に保護されたページにアクセス → ログインページにリダイレクト

### テスト環境・ツール
- E2Eテスト: Playwright
- コンポーネントテスト: Vitest + React Testing Library
- 認証モック: Clerk のテストユーティリティ

### データ準備
- Clerk のテストユーザー
- 認証トークンのモック

## タスクボード

| # | アイテム | 種別 | 完了条件 | 優先度 |
|---|----------|------|----------|---------|
| 1 | E2Eテスト（ログインフロー）作成 | Test | テストが失敗することを確認 | High |
| 2 | Clerk認証セットアップ | Code | Clerkがプロジェクトに統合され、環境変数が設定される | High |
| 3 | ヘッダーコンポーネント実装 | Code | テストが緑になる | High |
| 4 | トップページレイアウト実装 | Code | Portfolio Wiseのデザインを再現 | High |
| 5 | カラースキーム適用 | Code | Tailwind設定で青系プライマリを定義 | Medium |
| 6 | レスポンシブデザイン対応 | Code | モバイル/タブレットで正しく表示される | Medium |
| 7 | ログイン/ログアウトボタン実装 | Code | ボタンクリックでClerkのモーダルが開く | High |
| 8 | 全テストの確認 | Test | すべてのテストが緑になる | High |
| 9 | UI実装ドキュメント作成 | Doc | デザインシステムとコンポーネント構成を記録 | Low |

## UI設計詳細

### カラーパレット（Portfolio Wise参考）
```css
/* Tailwind設定に追加 */
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // メインブルー
    600: '#2563eb',  // Portfolio Wiseのプライマリ
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: '#10b981',  // 緑（正の数値）
  danger: '#ef4444',   // 赤（負の数値）
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    // ...
  }
}
```

### レイアウト構成
1. **ヘッダー**:
   - 高さ: 64px
   - 左: ロゴ（青いアイコン + テキスト）
   - 中央: ナビゲーション（機能/価格/ブログ）
   - 右: ログインボタン（未認証時）/ ユーザーメニュー（認証時）

2. **ヒーローセクション**:
   - 背景: グラデーション（白 → 薄い青）
   - 見出し: 大きなテキスト（48px）
   - サブ見出し: 説明文（18px）
   - CTA: 青いボタン（"無料で始める"）

3. **機能紹介セクション**:
   - カード型レイアウト（3列グリッド）
   - アイコン + タイトル + 説明
   - 影付き、ホバーエフェクト

## 技術実装詳細

### ディレクトリ構成
```
src/
├── app/
│   ├── (auth)/
│   │   └── sign-in/
│   │       └── [[...sign-in]]/
│   │           └── page.tsx
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── marketing/
│   │   ├── HeroSection.tsx
│   │   ├── FeatureCard.tsx
│   │   └── PricingSection.tsx
│   └── ui/
│       └── (shadcn/ui components)
├── lib/
│   └── clerk.ts
└── middleware.ts
```

### Clerk設定
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/tests(.*)',
  '/results(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### 環境変数
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## リスクと前提

### 技術的リスク
- Clerk の無料枠制限（月間10,000 MAU）
- Google OAuth の設定ミス
- Next.js 15 の App Router との互換性

### 時間/リソース制約
- UIデザインの完全再現は難しい場合、方向性を合わせる
- アニメーションは後回し（まず静的なレイアウトを完成）

### 前提
- Clerk アカウントは作成済み
- Google Cloud Console での OAuth 設定は完了済み
- Portfolio Wise のデザインは参考であり、完全コピーではない（差別化要素を残す）

---EXECUTION INSTRUCTION---

# 実行指示: Iteration-01

## 最優先事項
1. **テストファーストで進める**: E2Eテスト（ログインフロー）を先に書き、失敗することを確認してから実装する
2. **段階的な実装**: Clerk → Header → HeroSection の順に進める
3. **すべての成果物を `.tmp` 配下に保存し、`---CREATED FILES---` で完全パスを列挙する**

## 作成/更新すべき成果物

### 1. テスト
- `tests/e2e/auth.spec.ts` - ログイン/ログアウトのE2Eテスト
- `src/components/layout/__tests__/Header.test.tsx` - Headerコンポーネントテスト
- `src/components/marketing/__tests__/HeroSection.test.tsx` - HeroSectionテスト

### 2. 実装

#### Clerk認証セットアップ
- `package.json` - @clerk/nextjs の追加
- `src/app/layout.tsx` - ClerkProvider の追加
- `src/middleware.ts` - 認証ミドルウェア
- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` - サインインページ
- `.env.local` - Clerk環境変数（テンプレート）

#### UIコンポーネント
- `src/components/layout/Header.tsx` - ヘッダー
- `src/components/layout/Navigation.tsx` - ナビゲーション
- `src/components/marketing/HeroSection.tsx` - ヒーローセクション
- `src/components/marketing/FeatureCard.tsx` - 機能紹介カード
- `src/app/(marketing)/page.tsx` - トップページ
- `src/app/(marketing)/layout.tsx` - マーケティングレイアウト

#### スタイリング
- `tailwind.config.ts` - カラーパレット設定
- `src/app/globals.css` - グローバルスタイル

### 3. ドキュメント
- `.tmp/execution/iteration_01/design_system.md` - デザインシステムドキュメント
- `.tmp/execution/iteration_01/component_inventory.md` - コンポーネント一覧
- `.tmp/execution/iteration_01/implementation_notes.md` - 実装メモ・決定事項

## 推奨手順

### Phase 1: 環境セットアップ
1. Clerk のインストールと設定
   ```bash
   npm install @clerk/nextjs
   ```
2. 環境変数の設定（.env.local）
3. middleware.ts の作成

### Phase 2: テストの作成
1. Playwright の設定確認
2. E2Eテスト（auth.spec.ts）を作成
3. テストを実行して失敗することを確認

### Phase 3: 最小実装
1. ClerkProvider の統合
2. サインインページの作成
3. Header コンポーネント（ログインボタン付き）
4. テストを実行して緑になることを確認

### Phase 4: UIの拡張
1. Tailwind カラーパレット設定
2. HeroSection 実装
3. FeatureCard 実装
4. トップページの完成

### Phase 5: レスポンシブ対応
1. モバイルナビゲーション
2. ブレークポイントの調整
3. タブレット/モバイルでの表示確認

### Phase 6: 最終確認
1. すべてのテストを実行
2. ブラウザで手動確認
3. ドキュメント作成
4. 成果物のパス一覧作成

## 品質基準
- すべてのE2Eテストが緑
- コンポーネントテストが緑
- TypeScriptのビルドエラーなし
- ESLintエラーなし
- Portfolio Wiseのデザイン方向性が再現されている（完全一致不要）
- レスポンシブデザインが機能している
- ドキュメントに実装詳細と決定事項が記録されている

---LEADER OUTPUT END---

---CREATED FILES---
- C:\Users\yiwao\personality-platform\.tmp\leader_instructions\iteration_01_ui_auth_plan.md

---NEXT AGENT INSTRUCTION---

## 📋 次のステップ：実行エージェントへ

以下の手順で実行を依頼してください：

### 1. 実行エージェント（新しいターミナル）に貼り付ける内容

まず、上記の「---EXECUTION INSTRUCTION---」セクション全体をコピーしてください。

### 2. 実行プロンプトと一緒に貼り付け

```
[上記の ---EXECUTION INSTRUCTION--- セクション全体]

---

[実行プロンプト全体を貼り付け]
```

### 3. 実行後の流れ

実行エージェントが成果物を作成 → レビューエージェント（別ターミナル）で評価 → 100点でリーダーに戻る

### 4. 重要な注意事項

- **テストファーストを厳守**: 必ずE2Eテストを先に書いて失敗させてから実装する
- **段階的に進める**: Clerk → Header → HeroSection の順に進め、各ステップでテストを確認
- **完全パス報告**: すべての成果物のパスを `---CREATED FILES---` で報告する

---LONG TERM PLAN---

## 📍 実行中の長期的計画
- **パス**: C:\Users\yiwao\personality-platform\docs\project-plan-v2.md
- **現在位置**: Phase 1 - MVP開発（P0）
- **次の目標**: 恋愛・相性診断の実装（Phase 1の次のステップ）
- **進捗更新**:
  - [進行中] 認証機能とUIの基盤構築（Iteration-01）
  - [ ] 恋愛・相性診断（Big Fiveベース）
  - [ ] 結果カード生成
  - [ ] SNS共有機能
  - [ ] AI相談テンプレート

---

## 🎯 補足: Portfolio Wise UI参考資料

スクリーンショット保存先: C:\Users\yiwao\Downloads\portfolio-wise-screenshots\

主要な学び:
1. **認証**: Google OAuth（Clerkで実装可能）
2. **カラー**: 青系プライマリ（#2563eb）
3. **レイアウト**: カード型、中央配置、十分な余白
4. **ダッシュボード**: 大きな数値 + グラフ + テーブル
5. **フォント**: 大きく読みやすい、明確なヒエラルキー
