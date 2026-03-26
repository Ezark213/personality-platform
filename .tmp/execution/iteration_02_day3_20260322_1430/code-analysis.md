# 既存の結果ページコード分析

## ファイル
`app/tests/bigfive/result/page.tsx`

## 主要な機能

### 1. スコア計算ロジック

**関数**: `calculateScores(answers: BigFiveAnswer[])`

**処理フロー**:
```typescript
1. sessionStorageから回答を取得
2. 各次元の質問をフィルタリング
3. 回答値を取得（1-5）
4. 0-4に変換（正規化）
5. 逆転項目の処理
6. 平均を計算（0-4の範囲）
7. 0-100にスケーリング（× 25）
8. レベル判定（high: >= 60, low: <= 40, neutral: その他）
```

**出力**:
```typescript
{
  [dimension]: {
    average: number,      // 1-5スケール
    normalized: number,   // 0-100スケール
    level: string,        // high/low/neutral
    questionCount: number
  }
}
```

### 2. 状態管理

**useState**:
- `result`: 計算されたスコア（型: any）
- `loading`: ローディング状態（型: boolean）

**useEffect**:
- 初回レンダリング時に実行
- sessionStorageから`bigfive-answers`を取得
- スコア計算を実行
- `result`ステートに保存

### 3. データ構造

**sessionStorageキー**: `bigfive-answers`

**データ型**:
```typescript
BigFiveAnswer[] = [
  {
    questionId: number,
    value: number (1-5)
  },
  ...
]
```

### 4. UI構造

```
min-h-screen (グラデーション背景: purple-50 to blue-50)
  └── max-w-4xl mx-auto
      ├── Header (診断結果タイトル)
      ├── Results (5次元のスコアカード)
      │   └── dimension card × 5
      │       ├── 絵文字 + 次元名 + レベルバッジ
      │       ├── スコアバー（プログレスバー）
      │       └── 説明文
      └── Actions (もう一度診断するボタン)
```

### 5. スタイリング

**Tailwind CSSクラス**:
- グラデーション背景: `bg-gradient-to-br from-purple-50 to-blue-50`
- カード: `bg-white rounded-lg shadow-md`
- ボタン: `bg-gradient-to-r from-purple-600 to-blue-600`
- レスポンシブ: `px-4`, `max-w-4xl`

**カラーパレット**:
- High level: red-100, red-800, red-400, red-600
- Low level: blue-100, blue-800, blue-400, blue-600
- Neutral level: gray-100, gray-800, gray-400, gray-600

## Day 3で追加する内容

### 追加位置

**Actionsセクションの下**（Line 220の後）に新しいセクションを追加：

```
└── max-w-4xl mx-auto
    ├── Header
    ├── Results
    ├── Actions (もう一度診断するボタン)
    └── **Share Section (新規追加)** ← ここ！
        ├── カードプレビュー
        ├── Twitter共有ボタン
        ├── Instagram共有ボタン
        └── URLコピーボタン
```

### 必要な追加import

```typescript
import { classifyType } from '@/lib/tests/bigfive-type-classifier'
import { generateShareText } from '@/lib/tests/bigfive-share-text'
import type { BigFiveResult, BigFiveType } from '@/types/bigfive'
```

### 必要な追加state

```typescript
const [shareText, setShareText] = useState('')
const [resultType, setResultType] = useState<BigFiveType | null>(null)
const [showCopyToast, setShowCopyToast] = useState(false)
```

### 必要な追加useEffect

```typescript
useEffect(() => {
  if (result) {
    // BigFiveResult型に変換
    const bigFiveResult: BigFiveResult = {
      scores: result,
      totalQuestions: 20,
      completedAt: new Date()
    }

    // タイプ分類
    const type = classifyType(bigFiveResult)
    setResultType(type)

    // 共有テキスト生成
    const text = generateShareText(type, window.location.href)
    setShareText(text)
  }
}, [result])
```

## 技術的決定事項

### 1. 既存コードを壊さない

- `calculateScores` 関数はそのまま使用
- 既存の `result` ステートを活用
- 新しいセクションを追加（既存のUIを変更しない）

### 2. sessionStorageからデータ取得

- クライアント側で取得（`useEffect`内）
- サーバー側では取得不可（sessionStorageはブラウザAPI）

### 3. タイプ分類の統合

- Day 1の `classifyType` 関数を使用
- `result` を `BigFiveResult` 型に変換してから分類

### 4. OG画像の表示

- Day 2.5の `/api/og/bigfive/card/[resultId]` エンドポイントを使用
- モックデータのため、resultIdは固定値またはタイムスタンプを使用

## 次のステップ

1. ✅ 既存コード確認完了
2. ⏳ シェアセクションUI実装
3. ⏳ イベントハンドラー実装
4. ⏳ E2Eテスト実施
