# ユーザーアクションチェックリスト

## 🎯 目的
レビュー改善（71点 → 100点）のために、以下のアクションを完了させてください。

---

## ✅ アクション #1: Clerk APIキーの設定（最優先）

### 所要時間: 約10分

### 手順

#### 1. Clerk ダッシュボードにアクセス
```
https://dashboard.clerk.com/
```
- アカウントがない場合: 「Sign up」から無料アカウントを作成
- 既にある場合: 「Sign in」からログイン

#### 2. プロジェクトの作成
1. 「+ Create application」をクリック
2. アプリケーション名: `Personality Platform`
3. **Google OAuth を有効化** ✅
4. 「Create application」をクリック

#### 3. APIキーの取得
1. 左サイドバー → 「API Keys」をクリック
2. 以下の2つのキーをコピー:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`（「Show secret key」をクリック）

#### 4. `.env.local` ファイルの更新
1. プロジェクトルート `C:\Users\yiwao\personality-platform\.env.local` を開く
2. 以下の行を見つけて、実際のキーに置き換え:

```bash
# 変更前
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# 変更後（実際のキーに置き換える）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_abcd1234...
CLERK_SECRET_KEY=sk_test_xyz9876...
```

3. ファイルを保存

---

## ✅ アクション #2: E2Eテストの実行

### 所要時間: 約5分

### 手順

#### 1. 開発サーバーの起動
```bash
cd C:\Users\yiwao\personality-platform
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして、トップページが表示されることを確認。

#### 2. E2Eテストの実行（別ターミナル）
```bash
cd C:\Users\yiwao\personality-platform
npx playwright test
```

または、UIモードで実行（推奨）:
```bash
npx playwright test --ui
```

#### 3. テスト結果の記録
テストがすべて緑（✓）になることを確認し、結果をコピー:
```bash
npx playwright test > .tmp/execution/iteration_01_20260326_1500/test_logs/success_test.log 2>&1
```

---

## ✅ アクション #3: スクリーンショットの取得

### 所要時間: 約3分

### 手順

#### 1. 開発サーバーが起動していることを確認
```bash
npm run dev
```

#### 2. Playwrightで自動スクリーンショット取得
```bash
cd C:\Users\yiwao\personality-platform
npx playwright screenshot http://localhost:3000 .tmp/execution/iteration_01_20260326_1500/screenshots/implementation/top_page.png --full-page
```

#### 3. 比較画像の準備
Portfolio Wise参考画像:
```
C:\Users\yiwao\Downloads\portfolio-wise-screenshots\01_top_page.png
```

これを以下にコピー:
```bash
copy "C:\Users\yiwao\Downloads\portfolio-wise-screenshots\01_top_page.png" ".tmp\execution\iteration_01_20260326_1500\screenshots\comparison\portfolio_wise_reference.png"
```

---

## ✅ アクション #4: デザイン再現度の検証

### 所要時間: 約5分

### 手順

1. 以下の2つの画像を並べて比較:
   - `.tmp/execution/iteration_01_20260326_1500/screenshots/comparison/portfolio_wise_reference.png`（参考）
   - `.tmp/execution/iteration_01_20260326_1500/screenshots/implementation/top_page.png`（実装）

2. design_verification.md を開き、検証項目にチェックとスコアを記入

3. 総合スコアを計算

---

## 📊 完了チェック

- [ ] Clerk APIキーを設定した
- [ ] 開発サーバーが起動している
- [ ] E2Eテストが実行され、すべて緑になった
- [ ] テスト結果ログが保存された（success_test.log）
- [ ] スクリーンショットが取得された
- [ ] デザイン再現度の検証が完了した

---

## 🚀 すべて完了したら

実行エージェントに以下を報告:
```
✅ すべてのアクション完了
- Clerk APIキー: 設定完了
- E2Eテスト: すべて緑（結果ログ: success_test.log）
- スクリーンショット: 取得完了
- デザイン再現度: ?/100点
```

実行エージェントが最終レポートを更新し、再度レビューを受けます。

---

**作成日時**: 2026-03-26 17:45
