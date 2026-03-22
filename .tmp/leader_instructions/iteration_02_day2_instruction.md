---EXECUTION INSTRUCTION START---

# 実行指示: Iteration-02 Day 2（OG画像生成API実装）

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-02, Day 2
- 前回実行: Day 1完了（100点達成、2026-03-19）
- 作成日時: 2026-03-19 12:00
- ゴール: OG画像生成APIの実装と動作確認
- 成功判定: localhost:3002/api/og/bigfive/testで画像が生成され、結果が美しく表示されること

## Day 1の引き継ぎ

### 完了した成果物
- ✅ 15タイプ性格分類定義（`data/tests/bigfive-types.ts`）
- ✅ タイプ分類ロジック（`lib/tests/bigfive-type-classifier.ts`）
- ✅ 共有テキスト生成（`lib/tests/bigfive-share-text.ts`）
- ✅ テスト27個全パス

### Day 1の評価
- **レビュースコア**: 100/100点（完璧）
- **所要時間**: 約8分
- **テスト成功率**: 100%（27/27）

### 利用可能なリソース
```typescript
// タイプ分類
import { classifyType, extractStrengths } from '@/lib/tests/bigfive-type-classifier'
import { bigFiveTypes, getTypeById } from '@/data/tests/bigfive-types'
import type { BigFiveType } from '@/data/tests/bigfive-types'

// 共有テキスト
import { generateShareText } from '@/lib/tests/bigfive-share-text'
```

## Day 2の最優先事項

1. **@vercel/ogをインストールする**（最優先）
2. **OG画像生成APIを段階的に実装する**（シンプル → 複雑）
3. **localhost:3002で動作確認を随時行う**
4. **エラーハンドリングを適切に実装する**
5. **すべての成果物を `.tmp/execution/iteration_02/` 配下に保存し、`---CREATED FILES---` で完全パスを列挙する**

## Day 2のスコープ

### 含まれる対象

1. **依存関係のインストール**
   - @vercel/og
   - （必要に応じて）@vercel/og用のフォント

2. **基本OG画像生成API**
   - エンドポイント: `/api/og/bigfive/[resultId]/route.tsx`
   - サイズ: 1200×630px（Twitter/Facebook OG標準）
   - 基本レイアウト実装

3. **1:1正方形カード生成API**
   - エンドポイント: `/api/og/bigfive/card/[resultId]/route.tsx`
   - サイズ: 1080×1080px（Instagram最適化）
   - より洗練されたデザイン

4. **テスト用エンドポイント**
   - エンドポイント: `/api/og/bigfive/test/route.tsx`
   - モックデータを使用
   - ブラウザでプレビュー可能

### 対象外（Day 3以降）

- 結果ページへの統合 → Day 3
- シェアボタンの実装 → Day 3
- 9:16ストーリーズ版 → Day 3（時間があれば）
- データベースからのデータ取得 → Iteration-05

## 推奨手順

### フェーズ1: 環境準備（30分）

#### 1. @vercel/ogインストール
```bash
cd personality-platform
npm install @vercel/og
```

#### 2. 動作確認
```bash
npm run dev
# localhost:3002が起動することを確認
```

### フェーズ2: テスト用エンドポイント作成（1時間）

**目的**: @vercel/ogの動作確認と基本的なレイアウトテスト

#### 1. ファイル作成
- **パス**: `app/api/og/bigfive/test/route.tsx`
- **内容**: シンプルな静的画像生成

**実装例:**
```tsx
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#f3f4f6',
        }}
      >
        <h1 style={{ fontSize: '72px', color: '#1f2937' }}>
          OG画像生成テスト
        </h1>
        <p style={{ fontSize: '32px', color: '#6b7280' }}>
          @vercel/og 動作確認
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

#### 2. 動作確認
```bash
# ブラウザで以下にアクセス
http://localhost:3002/api/og/bigfive/test
# 画像が表示されることを確認
```

### フェーズ3: OG画像生成API実装（2-3時間）

**目的**: 診断結果からOG画像を動的生成

#### 1. ファイル作成
- **パス**: `app/api/og/bigfive/[resultId]/route.tsx`

**実装内容:**
```tsx
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import type { BigFiveResult } from '@/types/bigfive'
import { classifyType } from '@/lib/tests/bigfive-type-classifier'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  try {
    // TODO: 将来的にはDBから取得。現在はモックデータ
    const mockResult: BigFiveResult = {
      scores: {
        neuroticism: {
          average: 2.5,
          normalized: 50,
          level: 'neutral',
          questionCount: 4
        },
        extraversion: {
          average: 4.2,
          normalized: 84,
          level: 'high',
          questionCount: 4
        },
        openness: {
          average: 3.8,
          normalized: 76,
          level: 'high',
          questionCount: 4
        },
        agreeableness: {
          average: 3.5,
          normalized: 70,
          level: 'neutral',
          questionCount: 4
        },
        conscientiousness: {
          average: 3.2,
          normalized: 64,
          level: 'neutral',
          questionCount: 4
        }
      },
      totalQuestions: 20,
      completedAt: new Date()
    }

    const type = classifyType(mockResult)

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1200px',
            height: '630px',
            backgroundColor: '#f3f4f6',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '60px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#1f2937',
                textAlign: 'center',
              }}
            >
              {type.name}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#6b7280',
                marginBottom: '40px',
                textAlign: 'center',
              }}
            >
              {type.catchphrase}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {type.strengths.map((strength, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '28px'
                  }}
                >
                  <span style={{ marginRight: '12px' }}>✅</span>
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
          <p
            style={{
              marginTop: '30px',
              fontSize: '20px',
              color: '#9ca3af',
            }}
          >
            personality-platform.com
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
```

#### 2. 動作確認
```bash
# ブラウザで以下にアクセス
http://localhost:3002/api/og/bigfive/test-result-001
# タイプ名、キャッチコピー、強み3つが表示されることを確認
```

#### 3. デザイン調整
- フォントサイズの調整
- 余白の調整
- 色の調整（タイプごとに背景色を変える等）

### フェーズ4: 1:1正方形カード生成（2-3時間）

**目的**: Instagram用の正方形カード生成

#### 1. ファイル作成
- **パス**: `app/api/og/bigfive/card/[resultId]/route.tsx`

**実装内容:**
```tsx
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import type { BigFiveResult } from '@/types/bigfive'
import { classifyType } from '@/lib/tests/bigfive-type-classifier'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  try {
    // モックデータ（OG画像と同じ）
    const mockResult: BigFiveResult = {
      // ... 同じモックデータ
    }

    const type = classifyType(mockResult)

    // タイプごとの背景色を決定
    const getBackgroundGradient = (dimensionId: string) => {
      const gradients: Record<string, string> = {
        'neuroticism': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'extraversion': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'openness': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'agreeableness': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'conscientiousness': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      }
      return gradients[dimensionId] || gradients['extraversion']
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '1080px',
            height: '1080px',
            background: getBackgroundGradient(type.id.split('-')[1]),
            padding: '80px',
          }}
        >
          {/* ヘッダー */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              {type.name}
            </h1>
            <p
              style={{
                fontSize: '36px',
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {type.catchphrase}
            </p>
          </div>

          {/* 強み */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {type.strengths.map((strength, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '32px',
                  color: '#1f2937',
                }}
              >
                <span style={{ marginRight: '16px', fontSize: '36px' }}>✅</span>
                <span>{strength}</span>
              </div>
            ))}
          </div>

          {/* フッター */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p
              style={{
                fontSize: '20px',
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
              }}
            >
              ※これはあくまで傾向です。状況や成長で変わります。
            </p>
            <p
              style={{
                fontSize: '28px',
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              personality-platform.com
            </p>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      }
    )
  } catch (error) {
    console.error('Card image generation error:', error)
    return new Response('Failed to generate card image', { status: 500 })
  }
}
```

#### 2. 動作確認
```bash
# ブラウザで以下にアクセス
http://localhost:3002/api/og/bigfive/card/test-result-001
# 正方形カードが表示されることを確認
```

#### 3. デザイン改善
- グラデーション背景の調整
- フォントサイズの最適化
- シャドウ・透明度の調整

### フェーズ5: ドキュメント作成（30分）

#### 1. 実装決定事項の記録
- **ファイル**: `.tmp/execution/iteration_02/day2_decisions.md`
- **内容**:
  - OG画像サイズの選定理由
  - レイアウト設計の根拠
  - タイプごとの配色選定
  - モックデータの使用理由

#### 2. テスト結果の記録
- **ファイル**: `.tmp/execution/iteration_02/day2_test-results.md`
- **内容**:
  - 各エンドポイントの動作確認結果
  - スクリーンショット（画像URL）
  - 遭遇したエラーと解決方法

#### 3. 進捗ログの更新
- **ファイル**: `.tmp/execution/iteration_02/progress.md`（既存ファイルに追記）
- **内容**:
  - Day 2の開始・完了時刻
  - 完了したタスク一覧
  - 所要時間
  - 次のステップ（Day 3）

## 品質基準

### 実装
- ✅ TypeScript strictモード準拠
- ✅ Edge Runtimeで動作する
- ✅ エラーハンドリングが適切
- ✅ モックデータが妥当（Day 1のテストデータと整合）
- ✅ レスポンシブでない（画像サイズ固定）

### デザイン
- ✅ タイプ名、キャッチコピー、強み3つが明確に表示
- ✅ フォントサイズが適切（可読性が高い）
- ✅ 配色が美しい（グラデーション推奨）
- ✅ 「決めつけ禁止」文言が含まれる（1:1カードのみ）
- ✅ ロゴ・URLが表示される

### 動作確認
- ✅ localhost:3002/api/og/bigfive/test で画像が表示される
- ✅ localhost:3002/api/og/bigfive/[任意のID] で画像が表示される
- ✅ localhost:3002/api/og/bigfive/card/[任意のID] で正方形カードが表示される
- ✅ 画像が正しいサイズで生成される（1200×630, 1080×1080）
- ✅ エラー時に500レスポンスが返る

### ドキュメント
- ✅ day2_decisions.mdが作成されている
- ✅ day2_test-results.mdが作成されている
- ✅ progress.mdが更新されている
- ✅ ファイルパスが `---CREATED FILES---` で列挙されている

## トラブルシューティング

### @vercel/ogのインストールエラー
```bash
# エラーが発生した場合
npm cache clean --force
npm install @vercel/og --legacy-peer-deps
```

### フォントが読み込めない
- 初期実装ではシステムフォントを使用（Noto Sans JPは後回し）
- カスタムフォントは Day 3 で対応

### 画像が生成されない
1. Edge Runtimeの設定を確認（`export const runtime = 'edge'`）
2. コンソールエラーを確認
3. モックデータの型定義を確認

### サイズが合わない
- width/heightを明示的に指定
- flexbox layoutを使用
- padding/marginを調整

## 注意事項

1. **テストファーストは不要**
   - OG画像生成は視覚的な実装のため、ユニットテストは後回し
   - 手動確認を重視

2. **データベース連携は後回し**
   - 現時点ではモックデータを使用
   - sessionStorageからのデータ取得は Day 3

3. **9:16ストーリーズ版は任意**
   - Day 2で時間があれば実装
   - なければ Day 3 に回す

4. **デザインの完璧さは求めない**
   - Day 2は「動作すること」が最優先
   - デザインの洗練は Day 3-4 で改善

## Day 2完了の定義

以下がすべて満たされたら Day 2 完了：

- [ ] @vercel/ogがインストールされている
- [ ] `/api/og/bigfive/test` で画像が表示される
- [ ] `/api/og/bigfive/[resultId]` で動的画像が生成される（1200×630px）
- [ ] `/api/og/bigfive/card/[resultId]` で正方形カードが生成される（1080×1080px）
- [ ] タイプ名、キャッチコピー、強み3つが正しく表示される
- [ ] タイプごとに背景色が変わる（1:1カードのみ）
- [ ] ドキュメント3種類が作成されている
- [ ] progress.mdが更新されている
- [ ] `---CREATED FILES---` セクションが記載されている

---EXECUTION INSTRUCTION END---

---EXPECTED OUTPUT FORMAT---

実行エージェントは、Day 2 完了時に以下のフォーマットで出力してください：

```markdown
---OUTPUT START---

## 実行情報
- イテレーション: Iteration-02, Day 2
- 実行日時: [開始時刻] - [完了時刻]
- 所要時間: [X時間Y分]
- ステータス: 完了

---OUTPUT DOCUMENT---

# Iteration-02 Day 2 実行レポート

## 概要
[Day 2で実装した内容の概要]

## 完了した成果物
- ✅ @vercel/ogインストール
- ✅ OG画像生成API実装
- ✅ 1:1正方形カード実装
- ✅ 動作確認完了

## 動作確認結果
- [スクリーンショットのURL or 説明]

## 技術的決定事項
- [重要な実装判断]

## 遭遇した問題と解決策
- [問題1] → [解決策1]
- [問題2] → [解決策2]

## 次のステップ（Day 3）
- 結果ページへの統合
- シェアボタンの実装
- ...

---OUTPUT END---

---CREATED FILES---
- app/api/og/bigfive/test/route.tsx
- app/api/og/bigfive/[resultId]/route.tsx
- app/api/og/bigfive/card/[resultId]/route.tsx
- .tmp/execution/iteration_02/day2_decisions.md
- .tmp/execution/iteration_02/day2_test-results.md
- .tmp/execution/iteration_02/progress.md（更新）

---NEXT STEPS---
[Day 3の準備事項]
```

---QUALITY CHECKLIST---

実行エージェントは、以下をチェックしてから提出してください：

- [ ] すべてのAPIエンドポイントが動作する
- [ ] 画像が正しいサイズで生成される
- [ ] タイプ分類が正しく動作する（Day 1の成果物を使用）
- [ ] エラーハンドリングが実装されている
- [ ] ドキュメントが完全に記載されている
- [ ] `---CREATED FILES---` が完全パスで列挙されている
- [ ] progress.mdが最新状態に更新されている
