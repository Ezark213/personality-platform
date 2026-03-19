---LEADER OUTPUT START---

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-02
- 参照レビュー: 2026-03-18 / 89点（Iteration-01 Phase 3完了）
- 作成日時: 2026-03-19 11:55
- ゴール: バイラル導線の構築（結果カード生成とSNS共有機能）
- 成功判定: 診断結果からOG画像が生成され、SNSで共有できること

---PROJECT PLAN---

# イテレーション計画: Iteration-02

## 概要

Iteration-01で構築したBigFive診断20問版に、**バイラル導線**を追加します。診断結果を美しいカード画像に変換し、Twitter/X、Instagramで簡単に共有できる機能を実装することで、ユーザー獲得のバイラルループを構築します。

### Iteration-01の成果物
- ✅ BigFive診断20問版（型定義、計算ロジック、データ、UI）
- ✅ 診断ページ（/tests/bigfive）
- ✅ 結果ページ（/tests/bigfive/result）
- ✅ テスト22個（全パス）
- ✅ スコア計算と表示

### Iteration-02で追加する機能
- 🎯 OG画像生成（@vercel/og使用）
- 🎯 結果カード生成（1:1正方形、1080×1080px）
- 🎯 ストーリーズカード生成（9:16縦長、1080×1920px）
- 🎯 Twitter/X共有テンプレート
- 🎯 Instagram共有導線
- 🎯 結果ページのシェアボタン

## スコープ

### 含まれる対象

1. **OG画像生成API**
   - `/api/og/bigfive/[resultId]` エンドポイント
   - @vercel/ogを使用した動的画像生成
   - 5次元スコアのビジュアライゼーション

2. **結果カード生成**
   - 1:1正方形カード（1080×1080px）
     - タイプ分類（最も高い次元をベースに命名）
     - キャッチコピー（AIまたは事前定義）
     - 強み3つ（5次元スコアから抽出）
     - 「決めつけ禁止」短文
     - ロゴ・URL
   - 9:16ストーリーズ（1080×1920px）
     - 正方形カードの要素を縦長に再配置
     - Instagram/TikTok最適化

3. **共有機能**
   - Twitter/X共有ボタン
     - 140-200字の自動生成テキスト
     - 編集可能なテキストエリア
     - ハッシュタグ（#性格診断 #自己理解）
   - Instagram共有ガイド
     - 画像ダウンロードボタン
     - ストーリーズへの投稿手順表示
   - URLコピー機能

4. **結果ページの改善**
   - シェアボタンセクションの追加
   - カードプレビュー表示
   - ダウンロード機能

### 対象外（次イテレーション）

- 招待リンク・相性診断 → Iteration-03
- AI相談機能 → Iteration-04
- 認証機能（Clerk） → Iteration-05
- データベース連携 → Iteration-05
- 120問フルバージョン → Phase 3以降

## 引き継ぎ情報

### Iteration-01からの引き継ぎ
- **評価**: 89点（優秀）
- **完了項目**:
  - BigFive OSS 120問データ（MIT License）
  - 20問短縮版データ（各次元4問、バリデーションテスト6個パス）
  - 型定義、計算ロジック、変換ユーティリティ（テスト16個パス）
  - 診断ページ（/tests/bigfive）
  - 結果ページ（/tests/bigfive/result）
- **改善推奨事項（任意）**:
  - E2Eテストの追加（+4点）
  - UI実装のTDDエビデンス（+4点）
  - スコア計算ロジックの統一（+2点）
- **判断**: 89点は優秀評価で目標達成済み。Iteration-02に進むことをレビュワーが推奨。

### 制約
- サーバー: localhost:3002で稼働中
- Next.js 15 + TypeScript + Tailwind CSS v3
- Vitest導入済み
- @vercel/ogをインストール必要

## テストファースト戦略

### 先に書くべきテスト

#### 1. OG画像生成APIのテスト（優先度: 高）
- **テスト対象**: `/api/og/bigfive/[resultId]/route.tsx`
- **テストケース**:
  - 有効なresultIdで200レスポンスが返ること
  - Content-Typeが`image/png`であること
  - 画像サイズが1200×630px（OG標準）であること
  - 無効なresultIdで404が返ること

#### 2. タイプ分類ロジックのテスト（優先度: 高）
- **テスト対象**: `lib/tests/bigfive-type-classifier.ts`
- **テストケース**:
  - 各次元の最高スコアから適切なタイプ名が生成されること
  - 同点の場合の優先順位が正しいこと
  - キャッチコピーが生成されること
  - 強み3つが抽出されること

#### 3. 共有テキスト生成のテスト（優先度: 中）
- **テスト対象**: `lib/tests/bigfive-share-text.ts`
- **テストケース**:
  - 140-200字の範囲でテキストが生成されること
  - タイプ名、キャッチコピー、URLが含まれること
  - ハッシュタグが適切に付与されること

### 失敗させたい代表入力

```typescript
// タイプ分類テスト
describe('BigFive Type Classifier', () => {
  it('should classify high extraversion as "社交的な" type', () => {
    const result: BigFiveResult = {
      scores: {
        neuroticism: { average: 2.5, normalized: 50, level: 'neutral' },
        extraversion: { average: 4.5, normalized: 90, level: 'high' },
        openness: { average: 3.0, normalized: 60, level: 'neutral' },
        agreeableness: { average: 3.0, normalized: 60, level: 'neutral' },
        conscientiousness: { average: 3.0, normalized: 60, level: 'neutral' }
      }
    }
    const type = classifyType(result)
    expect(type.name).toContain('社交的')
  })
})

// 共有テキスト生成テスト
describe('BigFive Share Text Generator', () => {
  it('should generate text within 140-200 characters', () => {
    const type = { name: '内省的な戦略家', catchphrase: '深く考え、未来を見据える' }
    const text = generateShareText(type)
    expect(text.length).toBeGreaterThanOrEqual(140)
    expect(text.length).toBeLessThanOrEqual(200)
  })
})
```

### テスト環境・ツール
- **単体テスト**: Vitest
- **OG画像生成**: @vercel/og（Satori + Resvg）
- **手動確認**: localhost:3002/api/og/bigfive/test でプレビュー

### データ準備
- サンプルの診断結果データ（テスト用）
- タイプ定義マスターデータ（5次元×3レベル = 15タイプ）

## タスクボード

| # | アイテム | 種別 | 完了条件 | 優先度 |
|---|----------|------|----------|---------|
| 1 | タイプ分類マスターデータ作成 | Data | 15タイプ定義（名前、キャッチコピー、強み） | High |
| 2 | タイプ分類ロジック実装 | Code | `lib/tests/bigfive-type-classifier.ts` | High |
| 3 | タイプ分類テスト作成（失敗させる） | Test | テストが失敗することを確認 | High |
| 4 | タイプ分類テスト修正 | Test | テストが全てパス | High |
| 5 | 共有テキスト生成ロジック実装 | Code | `lib/tests/bigfive-share-text.ts` | High |
| 6 | 共有テキストテスト作成（失敗させる） | Test | テストが失敗することを確認 | Medium |
| 7 | 共有テキストテスト修正 | Test | テストが全てパス | Medium |
| 8 | @vercel/ogインストール | Code | npm install完了 | High |
| 9 | OG画像生成API実装 | Code | `/api/og/bigfive/[resultId]/route.tsx` | High |
| 10 | 1:1正方形カード生成 | Code | 1080×1080px、5次元スコア表示 | High |
| 11 | 9:16ストーリーズカード生成 | Code | 1080×1920px、縦長レイアウト | Medium |
| 12 | 結果ページにシェアセクション追加 | Code | `/tests/bigfive/result/page.tsx`更新 | High |
| 13 | Twitter/X共有ボタン実装 | Code | テキスト生成、Twitter Intent URL | High |
| 14 | Instagram共有ガイド実装 | Code | 画像ダウンロード、手順表示 | Medium |
| 15 | URLコピー機能実装 | Code | クリップボードAPI使用 | Low |
| 16 | OG画像プレビュー実装 | Code | カードプレビュー表示 | Medium |
| 17 | レスポンシブ対応 | Code | モバイルでの共有UX最適化 | Medium |
| 18 | 手動E2Eテスト | Test | 診断→結果→共有フロー確認 | High |
| 19 | ドキュメント作成 | Doc | 実装決定事項、テスト結果 | Medium |

## リスクと前提

### 技術的リスク

1. **OG画像生成のパフォーマンス**
   - リスク: @vercel/ogの初回生成が遅い可能性
   - 対策: 結果ページで非同期読み込み、プレースホルダー表示

2. **タイプ分類の妥当性**
   - リスク: 最高スコアベースの分類が単純すぎる可能性
   - 対策: 初期は15タイプ（5次元×3レベル）で開始、フィードバック収集後に改善

3. **共有テキストの自動生成品質**
   - リスク: AIなしでの自動生成が不自然になる可能性
   - 対策: 事前定義のテンプレート使用、Iteration-04でAI改善

### 依存関係
- Iteration-01の成果物（BigFive診断、結果計算）に依存
- @vercel/ogのインストールが必要
- Vercelデプロイ時にOG画像生成が正常に動作することを確認

### 時間/リソース制約
- 目標: 3-4日で完了
- Day 1: タイプ分類とテスト（1日）
- Day 2: OG画像生成API実装（1日）
- Day 3: 共有機能UI実装（1日）
- Day 4: テストと調整（0.5-1日）

## バイラル設計の詳細

### 共有フォーマット仕様

#### 1:1正方形カード（1080×1080px）

**レイアウト構成:**
```
┌─────────────────────────┐
│  [タイプ名]              │ ← 大きな見出し
│  "キャッチコピー"        │ ← サブタイトル
│                         │
│  ✅ 強み1              │
│  ✅ 強み2              │
│  ✅ 強み3              │
│                         │
│  [5次元レーダーチャート]  │ ← スコアビジュアル
│                         │
│  ※これはあくまで傾向です  │ ← 決めつけ禁止文
│                         │
│  [ロゴ] personality-platform.com │
└─────────────────────────┘
```

**デザイン要件:**
- 背景: グラデーション（タイプごとに色変更）
- フォント: Noto Sans JP（日本語対応）
- アイコン: シンプルなチェックマーク
- 余白: 十分な padding で可読性確保

#### 9:16ストーリーズ（1080×1920px）

**レイアウト構成:**
```
┌───────────────┐
│               │
│  [タイプ名]   │
│  "キャッチ"   │
│               │
│  ✅ 強み1    │
│  ✅ 強み2    │
│  ✅ 強み3    │
│               │
│  [レーダー]   │
│               │
│  ※傾向です   │
│               │
│  [ロゴ・URL]  │
│               │
└───────────────┘
```

**用途:**
- Instagram Stories
- TikTok投稿
- LINE共有

#### Twitter/X共有テキストテンプレート

**フォーマット:**
```
私の性格診断結果は「{タイプ名}」でした！

✅ {強み1}
✅ {強み2}
✅ {強み3}

{一言感想パターン from ["確かに当たってる！", "意外な結果...", "納得です"]}
あなたの結果は？

#性格診断 #自己理解 #BigFive
{結果ページURL}
```

**文字数制限:**
- 140-200字以内
- URLは短縮（t.co経由で自動短縮）

### バイラルループの設計

```
診断完了
  ↓
結果カード生成（自動）
  ↓
シェアボタン表示（Twitter/Instagram）
  ↓
ユーザーが共有
  ↓
友人がクリック
  ↓
診断開始（新規ユーザー）
```

**KPI:**
- share/user（共有率）: 目標 30%以上
- 紹介経由比率: 目標 20%以上
- 診断完了率: 目標 70%以上

## 実装の優先順位

### フェーズ1: 基盤構築（Day 1）
1. タイプ分類マスターデータ作成
2. タイプ分類ロジック実装（TDD）
3. 共有テキスト生成ロジック実装（TDD）

### フェーズ2: 画像生成（Day 2）
1. @vercel/ogインストール
2. OG画像生成API実装
3. 1:1正方形カード生成
4. （時間があれば）9:16ストーリーズ生成

### フェーズ3: UI統合（Day 3）
1. 結果ページにシェアセクション追加
2. Twitter/X共有ボタン実装
3. Instagram共有ガイド実装
4. カードプレビュー表示

### フェーズ4: テスト・調整（Day 4）
1. 手動E2Eテスト
2. バグ修正
3. レスポンシブ調整
4. ドキュメント作成

---EXECUTION INSTRUCTION---

# 実行指示: Iteration-02

## 最優先事項

1. **タイプ分類ロジックを先に実装する**（テストファースト）
2. **OG画像生成は最後に統合する**（基盤が完成してから）
3. **テストを先に書き、失敗させてから実装する**
4. **シンプルさを優先する**（複雑なデザインは後回し）
5. **すべての成果物を `.tmp/execution/iteration_02/` 配下に保存し、`---CREATED FILES---` で完全パスを列挙する**

## 作成/更新すべき成果物

### 1. タイプ分類システム（Day 1, AM）

#### 1-1. タイプ定義マスターデータ
- **ファイル**: `data/tests/bigfive-types.ts`
- **内容**: 15タイプ定義（5次元×3レベル）

**構造:**
```typescript
import type { BigFiveResult } from '@/types/bigfive'

export interface BigFiveType {
  id: string // 例: 'high-extraversion'
  name: string // 例: '社交的なリーダー'
  catchphrase: string // 例: '人と共に成長する'
  strengths: string[] // 3つの強み
  description: string // 詳細説明
  primaryDimension: 'neuroticism' | 'extraversion' | 'openness' | 'agreeableness' | 'conscientiousness'
  level: 'high' | 'low'
}

export const bigFiveTypes: BigFiveType[] = [
  // Extraversion: High
  {
    id: 'high-extraversion',
    name: '社交的なリーダー',
    catchphrase: '人と共に成長する',
    strengths: ['コミュニケーション力', 'チームワーク', 'ポジティブ思考'],
    description: '...',
    primaryDimension: 'extraversion',
    level: 'high'
  },
  // Extraversion: Low
  {
    id: 'low-extraversion',
    name: '内省的な思考家',
    catchphrase: '深く考え、静かに行動する',
    strengths: ['集中力', '分析力', '独立性'],
    description: '...',
    primaryDimension: 'extraversion',
    level: 'low'
  },
  // ... 残り13タイプ
]
```

#### 1-2. タイプ分類ロジック（TDD）
- **ファイル**: `lib/tests/bigfive-type-classifier.ts`
- **テストファイル**: `lib/tests/__tests__/bigfive-type-classifier.test.ts`

**実装:**
```typescript
import type { BigFiveResult } from '@/types/bigfive'
import type { BigFiveType } from '@/data/tests/bigfive-types'
import { bigFiveTypes } from '@/data/tests/bigfive-types'

/**
 * 診断結果から最も適合するタイプを分類
 */
export function classifyType(result: BigFiveResult): BigFiveType {
  // 1. 最もスコアが高い（またはlowの場合は低い）次元を特定
  // 2. その次元に対応するタイプを返す
  // 3. 同点の場合の優先順位: extraversion > conscientiousness > openness > agreeableness > neuroticism
}

/**
 * 5次元スコアから強み3つを抽出
 */
export function extractStrengths(result: BigFiveResult): string[] {
  // タイプの強みを返す（タイプ定義から取得）
}
```

**テスト（先に書く）:**
```typescript
import { describe, it, expect } from 'vitest'
import { classifyType, extractStrengths } from '../bigfive-type-classifier'
import type { BigFiveResult } from '@/types/bigfive'

describe('BigFive Type Classifier', () => {
  it('should classify high extraversion as "社交的な" type', () => {
    const result: BigFiveResult = {
      scores: {
        neuroticism: { average: 2.5, normalized: 50, level: 'neutral' },
        extraversion: { average: 4.5, normalized: 90, level: 'high' },
        openness: { average: 3.0, normalized: 60, level: 'neutral' },
        agreeableness: { average: 3.0, normalized: 60, level: 'neutral' },
        conscientiousness: { average: 3.0, normalized: 60, level: 'neutral' }
      }
    }
    const type = classifyType(result)
    expect(type.primaryDimension).toBe('extraversion')
    expect(type.level).toBe('high')
    expect(type.name).toContain('社交的')
  })

  it('should handle tie by priority (extraversion > conscientiousness)', () => {
    const result: BigFiveResult = {
      scores: {
        neuroticism: { average: 2.5, normalized: 50, level: 'neutral' },
        extraversion: { average: 4.0, normalized: 80, level: 'high' },
        openness: { average: 3.0, normalized: 60, level: 'neutral' },
        agreeableness: { average: 3.0, normalized: 60, level: 'neutral' },
        conscientiousness: { average: 4.0, normalized: 80, level: 'high' }
      }
    }
    const type = classifyType(result)
    expect(type.primaryDimension).toBe('extraversion') // 優先順位で決定
  })
})
```

### 2. 共有テキスト生成（Day 1, PM）

#### 2-1. 共有テキスト生成ロジック（TDD）
- **ファイル**: `lib/tests/bigfive-share-text.ts`
- **テストファイル**: `lib/tests/__tests__/bigfive-share-text.test.ts`

**実装:**
```typescript
import type { BigFiveType } from '@/data/tests/bigfive-types'

/**
 * Twitter/X共有用のテキストを生成
 * @param type タイプ定義
 * @param resultUrl 結果ページのURL
 * @returns 140-200字の共有テキスト
 */
export function generateShareText(type: BigFiveType, resultUrl: string): string {
  const baseTemplate = `私の性格診断結果は「${type.name}」でした！

✅ ${type.strengths[0]}
✅ ${type.strengths[1]}
✅ ${type.strengths[2]}

確かに当たってる！
あなたの結果は？

#性格診断 #自己理解 #BigFive
${resultUrl}`

  return baseTemplate
}
```

**テスト:**
```typescript
import { describe, it, expect } from 'vitest'
import { generateShareText } from '../bigfive-share-text'

describe('BigFive Share Text Generator', () => {
  it('should generate text within 140-200 characters', () => {
    const type = {
      id: 'high-extraversion',
      name: '社交的なリーダー',
      catchphrase: '人と共に成長する',
      strengths: ['コミュニケーション力', 'チームワーク', 'ポジティブ思考'],
      description: '',
      primaryDimension: 'extraversion' as const,
      level: 'high' as const
    }
    const text = generateShareText(type, 'https://example.com/result/123')
    expect(text.length).toBeGreaterThanOrEqual(140)
    expect(text.length).toBeLessThanOrEqual(200)
  })

  it('should include type name and strengths', () => {
    const type = {
      id: 'high-extraversion',
      name: '社交的なリーダー',
      catchphrase: '人と共に成長する',
      strengths: ['コミュニケーション力', 'チームワーク', 'ポジティブ思考'],
      description: '',
      primaryDimension: 'extraversion' as const,
      level: 'high' as const
    }
    const text = generateShareText(type, 'https://example.com/result/123')
    expect(text).toContain('社交的なリーダー')
    expect(text).toContain('コミュニケーション力')
    expect(text).toContain('チームワーク')
    expect(text).toContain('ポジティブ思考')
  })
})
```

### 3. OG画像生成API（Day 2）

#### 3-1. @vercel/ogインストール
```bash
npm install @vercel/og
```

#### 3-2. OG画像生成API実装
- **ファイル**: `app/api/og/bigfive/[resultId]/route.tsx`

**実装:**
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
    // TODO: 実際はDBから取得。現在はsessionStorageのデータを想定
    // 開発段階ではモックデータを使用
    const mockResult: BigFiveResult = {
      scores: {
        neuroticism: { average: 2.5, normalized: 50, level: 'neutral' },
        extraversion: { average: 4.2, normalized: 84, level: 'high' },
        openness: { average: 3.8, normalized: 76, level: 'high' },
        agreeableness: { average: 3.5, normalized: 70, level: 'neutral' },
        conscientiousness: { average: 3.2, normalized: 64, level: 'neutral' }
      }
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
              }}
            >
              {type.name}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#6b7280',
                marginBottom: '40px',
              }}
            >
              {type.catchphrase}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {type.strengths.map((strength, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '28px' }}>
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

#### 3-3. 1:1正方形カード生成
- **ファイル**: `app/api/og/bigfive/card/[resultId]/route.tsx`
- **サイズ**: 1080×1080px
- **レイアウト**: 正方形カード用デザイン

### 4. 結果ページの更新（Day 3）

#### 4-1. シェアセクション追加
- **ファイル**: `app/tests/bigfive/result/page.tsx`（更新）

**追加内容:**
```tsx
// 既存の結果表示の下に追加

{/* シェアセクション */}
<div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
  <h2 className="text-2xl font-bold mb-6">結果をシェア</h2>

  {/* カードプレビュー */}
  <div className="mb-6">
    <img
      src={`/api/og/bigfive/card/${resultId}`}
      alt="結果カード"
      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
    />
  </div>

  {/* シェアボタン */}
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    {/* Twitter/X */}
    <button
      onClick={handleTwitterShare}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      <TwitterIcon />
      Twitter/Xでシェア
    </button>

    {/* Instagram */}
    <button
      onClick={handleInstagramShare}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
    >
      <InstagramIcon />
      Instagramでシェア
    </button>

    {/* URLコピー */}
    <button
      onClick={handleCopyUrl}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <CopyIcon />
      URLをコピー
    </button>
  </div>

  {/* Twitter共有テキスト（編集可能） */}
  {showTwitterText && (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-2">
        シェアテキスト（編集できます）
      </label>
      <textarea
        value={shareText}
        onChange={(e) => setShareText(e.target.value)}
        rows={6}
        className="w-full p-4 border rounded-lg"
      />
      <p className="text-sm text-gray-600 mt-2">
        文字数: {shareText.length} / 280
      </p>
    </div>
  )}
</div>
```

#### 4-2. シェアハンドラー実装
```typescript
const handleTwitterShare = () => {
  const type = classifyType(result)
  const shareText = generateShareText(type, window.location.href)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

const handleInstagramShare = () => {
  // Instagram Web APIはないため、画像ダウンロードガイドを表示
  setShowInstagramGuide(true)
}

const handleCopyUrl = async () => {
  await navigator.clipboard.writeText(window.location.href)
  // トースト通知表示
  setShowCopyToast(true)
}
```

### 5. ドキュメント作成

#### 5-1. 実装決定事項
- **ファイル**: `.tmp/execution/iteration_02/decisions.md`
- **内容**:
  - タイプ分類のアルゴリズム詳細
  - 15タイプの定義根拠
  - OG画像生成の技術選定理由
  - Instagram共有の制約事項

#### 5-2. テスト結果
- **ファイル**: `.tmp/execution/iteration_02/test-results.md`
- **内容**:
  - タイプ分類テスト結果
  - 共有テキストテスト結果
  - E2Eテスト結果（スクリーンショット）

#### 5-3. 進捗ログ
- **ファイル**: `.tmp/execution/iteration_02/progress.md`
- **内容**:
  - 日次の進捗記録
  - 遭遇した問題と解決策
  - 残課題

## 推奨手順

### Day 1: タイプ分類とテスト（6-8時間）

**午前（3-4時間）:**
1. タイプ定義マスターデータ作成（2時間）
   - 15タイプの名前、キャッチコピー、強みを定義
   - `data/tests/bigfive-types.ts`
2. タイプ分類テスト作成（失敗させる）（1時間）
   - `lib/tests/__tests__/bigfive-type-classifier.test.ts`
3. タイプ分類ロジック実装（1時間）
   - `lib/tests/bigfive-type-classifier.ts`
   - テストをパスさせる

**午後（3-4時間）:**
4. 共有テキストテスト作成（失敗させる）（1時間）
5. 共有テキスト生成ロジック実装（1.5時間）
6. 全テスト実行・確認（30分）
7. Day 1進捗ログ記録（30分）

### Day 2: OG画像生成（6-8時間）

**午前（3-4時間）:**
1. @vercel/ogインストールと動作確認（1時間）
2. OG画像生成API基本実装（2時間）
   - `/api/og/bigfive/[resultId]/route.tsx`
3. localhost:3002/api/og/bigfive/testでプレビュー確認（30分）

**午後（3-4時間）:**
4. 1:1正方形カード生成API実装（2時間）
   - `/api/og/bigfive/card/[resultId]/route.tsx`
5. デザイン調整（1時間）
6. （時間があれば）9:16ストーリーズ生成（1時間）
7. Day 2進捗ログ記録（30分）

### Day 3: UI統合（6-8時間）

**午前（3-4時間）:**
1. 結果ページにシェアセクション追加（2時間）
   - カードプレビュー表示
   - シェアボタン配置
2. Twitter/X共有機能実装（1時間）
3. 動作確認（30分）

**午後（3-4時間）:**
4. Instagram共有ガイド実装（1.5時間）
5. URLコピー機能実装（30分）
6. レスポンシブ調整（1時間）
7. 手動E2Eテスト（1時間）
8. Day 3進捗ログ記録（30分）

### Day 4: テストと調整（3-4時間）

1. 全体動作確認（1時間）
2. バグ修正（1時間）
3. ドキュメント作成（1時間）
   - decisions.md
   - test-results.md
4. レビュー準備（30分）

## 品質基準

### テスト
- タイプ分類テストが全てパス
- 共有テキストテストが全てパス
- E2Eテスト: 診断→結果→共有（Twitter/Instagram）が完了できる
- OG画像が正しく生成される

### 実装
- TypeScript strictモード準拠
- 15タイプが適切に定義されている
- OG画像が美しく見やすい
- 共有フローがスムーズ
- モバイルでも使いやすい

### ドキュメント
- タイプ分類のアルゴリズムが明確
- 実装決定事項が記録されている
- ファイルパスが `---CREATED FILES---` で追跡可能

---LEADER OUTPUT END---

---CREATED FILES---
- C:\Users\yiwao\personality-platform\.tmp\leader_instructions\iteration_02_plan.md

---NEXT AGENT INSTRUCTION---
## 📋 次のステップ：実行エージェントへ

1. 上記 `---EXECUTION INSTRUCTION---` 全体をコピー。
2. 新しいターミナル/セッションで実行エージェントに渡す。
3. 実行エージェントに以下を強調:
   - **タイプ分類ロジックを最優先で実装すること**（テストファースト）
   - **OG画像生成は基盤完成後に実装すること**
   - **テストを先に書き、失敗させてから実装すること**
   - **シンプルさを優先し、過度な装飾は避けること**
   - **各ステップ完了時に `.tmp/execution/iteration_02/progress.md` に進捗を記録すること**

### 実行エージェントへの追加指示

- Day 1でタイプ定義とロジックが完成するまで、Day 2に進まないこと
- OG画像生成は `/api/og/bigfive/test` エンドポイントで動作確認すること
- 結果ページ更新時は既存の機能を壊さないよう注意すること
- Instagram共有は画像ダウンロード+手順表示のみ（Web APIなし）
- 不明点や仮定は `.tmp/execution/iteration_02/decisions.md` に記録すること

---LONG TERM PLAN---
## 📍 実行中の長期的計画
- **パス**: `C:\Users\yiwao\personality-platform\docs\project-plan-v2.md`
- **現在位置**: Phase 1: MVP + バイラル導線（2-4週間、P0）
- **次の目標**: Phase 2（課金+リテンション）へ
- **進捗更新**:
  - Phase 1: MVP + バイラル導線
    - [完了] 恋愛・相性診断（Big Fiveベース短縮版、20問）→ Iteration-01完了（89点）
      - ✅ Phase 1完了: データ取得とライセンス確認
      - ✅ Phase 2完了: TDD基盤構築（96点）
      - ✅ Phase 3完了: 実データ統合、UI実装（89点、2026-03-18）
    - [進行中] 結果カード生成（1:1正方形 + 9:16ストーリーズ）→ **Iteration-02で対応中**
    - [進行中] SNS共有テンプレ（X/Instagram）→ **Iteration-02で対応中**
    - [ ] 招待リンクで相性機能解放 → Iteration-03で対応予定
    - [ ] AI相談テンプレ（回数制限付き、月3回）→ Iteration-04で対応予定
    - [ ] 認証（Clerk）→ Iteration-05で対応予定
    - [ ] データベース（Prisma + Supabase）→ Iteration-05で対応予定

### イテレーション計画概要（更新版）

| イテレーション | 目標 | 対象機能 | 期間 | ステータス |
|---------------|------|----------|------|-----------|
| Iteration-01 Phase 2（完了） | BigFive OSS基盤構築 | 型定義、計算ロジック、テスト | 完了 | ✅ 96点 |
| Iteration-01 Phase 3（完了） | 実データ統合とUI実装 | 20問版作成、診断ページ、結果ページ | 完了 | ✅ 89点（2026-03-18） |
| **Iteration-02（現在）** | **バイラル導線構築** | **OG画像生成、SNS共有機能** | **3-4日** | **🔄 計画完了→実行待ち** |
| Iteration-03 | 相性診断 | 2人比較、招待リンク | 1-2週間 | 未着手 |
| Iteration-04 | AI相談MVP | 基本的な会話機能、回数制限 | 1週間 | 未着手 |
| Iteration-05 | 認証・DB | Clerk導入、Prisma+Supabase | 1週間 | 未着手 |

### Phase 1完了予定
- **現在の進捗**: 約60%完了
- **残タスク**:
  - Iteration-02（結果カード生成、SNS共有）← 次
  - Iteration-03（相性診断、招待リンク）
  - Iteration-04（AI相談テンプレート）
  - Iteration-05（認証、データベース）
- **Phase 1完了見込み**: 2-3週間後

※長期的計画の変更は必要ありません。Phase 1のマイルストーンに沿って順調に進行中です。
