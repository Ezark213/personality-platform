# Clerk APIキー設定ガイド

## 概要
E2Eテストを実行するために、Clerk のAPIキーを設定する必要があります。

## ステップバイステップ手順

### 1. Clerk ダッシュボードにアクセス
1. https://dashboard.clerk.com/ にアクセス
2. アカウントがない場合は、「Sign up」から無料アカウントを作成
3. 既にアカウントがある場合は、「Sign in」からログイン

### 2. プロジェクトの作成
1. ダッシュボードで「+ Create application」をクリック
2. アプリケーション名を入力（例: "Personality Platform"）
3. Google OAuth を有効化（推奨）
4. 「Create application」をクリック

### 3. APIキーの取得
1. 左サイドバーから「API Keys」をクリック
2. 以下の2つのキーをコピー:
   - **Publishable key**: `pk_test_...` で始まるキー
   - **Secret key**: `sk_test_...` で始まるキー（「Show secret key」をクリックして表示）

### 4. `.env.local` ファイルの更新
1. プロジェクトルートの `.env.local` ファイルを開く
2. 以下の行を見つけて、コピーしたキーに置き換える:

```bash
# 変更前（プレースホルダー）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# 変更後（実際のキーに置き換え）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_abcd1234...
CLERK_SECRET_KEY=sk_test_xyz9876...
```

3. ファイルを保存

### 5. 開発サーバーの起動
```bash
npm run dev
```

### 6. E2Eテストの実行
別のターミナルで以下を実行:
```bash
npx playwright test
```

または、UIモードで実行:
```bash
npx playwright test --ui
```

### 7. テスト結果の確認
- すべてのテストが緑（✓）になることを確認
- 失敗した場合は、エラーメッセージを確認して修正

## トラブルシューティング

### Google OAuth の設定
Clerk ダッシュボードで Google OAuth を有効化する必要があります:

1. 左サイドバーから「User & Authentication」→「Social Connections」をクリック
2. 「Google」をONに切り替え
3. （オプション）Google Cloud Console で OAuth 2.0 クライアント ID を作成し、Clerk に設定

### テストが失敗する場合
1. 開発サーバーが起動していることを確認
2. `.env.local` のキーが正しいことを確認
3. ブラウザのキャッシュをクリア
4. Clerk ダッシュボードでアプリケーションが正しく設定されていることを確認

## 参考リンク
- Clerk ドキュメント: https://clerk.com/docs
- Clerk + Next.js App Router: https://clerk.com/docs/quickstarts/nextjs
- Playwright ドキュメント: https://playwright.dev/

---

**注意**: APIキーは機密情報です。`.env.local` ファイルは `.gitignore` に含まれているため、Git にコミットされません。
