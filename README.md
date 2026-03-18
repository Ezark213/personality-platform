# Personality Platform - 性格診断総合サイト

複数の性格診断テストを提供し、AIで結果を分析できるWebアプリケーション。

## 🚀 技術スタック

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 19**

## 📋 提供する診断テスト

1. **MBTI** - 16タイプ性格診断
2. **ビッグファイブ** - 5因子性格診断
3. **ラブタイプ** - 恋愛傾向診断
4. **適性検査** - キャリア・職業診断

## 🏗️ プロジェクト構造

```
personality-platform/
├── app/                      # Next.js App Router
│   ├── tests/               # 診断テストページ
│   │   ├── mbti/
│   │   ├── big-five/
│   │   ├── love-type/
│   │   └── aptitude/
│   ├── results/             # 診断結果ページ
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # トップページ
│   └── globals.css          # グローバルCSS
├── components/              # Reactコンポーネント
│   ├── ui/                 # UIコンポーネント
│   ├── tests/              # 診断用コンポーネント
│   └── charts/             # グラフ・ビジュアライゼーション
├── lib/                     # ユーティリティ
│   ├── db/                 # データベース関連
│   ├── ai/                 # AI統合
│   └── tests/              # 診断ロジック
├── types/                   # TypeScript型定義
└── data/                    # 診断データ
    └── tests/              # 質問セット
```

## 🛠️ セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## 📝 開発状況

- [x] プロジェクト初期化
- [x] 基本構造作成
- [x] トップページ実装
- [ ] MBTI診断実装
- [ ] ビッグファイブ診断実装
- [ ] ラブタイプ診断実装
- [ ] 適性検査実装
- [ ] AI相談機能
- [ ] ユーザー認証
- [ ] データベース統合
- [ ] 決済機能

## 📚 ドキュメント

- [プロジェクト計画書](./PROJECT_PLAN.md)
- [収益化戦略](./MONETIZATION_STRATEGY.md)

## 🎯 今後の予定

詳細は [PROJECT_PLAN.md](./PROJECT_PLAN.md) を参照してください。

## 📄 ライセンス

ISC
