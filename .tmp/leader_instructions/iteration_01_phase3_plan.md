---LEADER OUTPUT START---

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-01 Phase 3（実データ統合とUI実装）
- 参照レビュー: Phase 2 - 96点（優秀）
- 作成日時: 2026-03-18 16:00
- ゴール: BigFive診断の実稼働（20問版）とUIの完成
- 成功判定: /tests/bigfiveで診断が完了し、結果が正しく表示されること

---PROJECT PLAN---

# Phase 3: 実データ統合とUI実装

## 概要

Phase 2で構築した基盤（型定義、計算ロジック、データ変換ユーティリティ）を活用し、実際に動作する診断ページを作成します。

**Phase 2の成果物:**
- ✅ BigFive型定義（OSS形式 + 内部形式）
- ✅ 計算ロジック（テスト16個、全パス）
- ✅ データ変換ユーティリティ（96点評価）
- ✅ 日本語質問データ（120問、BigFive OSS）

**Phase 3で実装:**
- 120問フルセットのエクスポート
- 20問短縮版の作成
- `/tests/bigfive` 診断ページ
- `/tests/bigfive/result` 結果ページ
- 診断フローの動作確認

## スコープ

### 含まれる対象
1. **データ統合**
   - 120問フルセットを `data/tests/bigfive-questions-120.ts` にエクスポート
   - 20問短縮版を `data/tests/bigfive-questions-20.ts` に作成
   - メタデータの作成（質問数、次元配分、バージョン情報）

2. **UI実装**
   - `/tests/bigfive` 診断ページ（20問版）
   - `/tests/bigfive/result` 結果ページ（5次元スコア表示）
   - 進捗表示（X問/20問）
   - 回答選択UI（1-5スケール）

3. **診断フロー**
   - 質問の表示
   - 回答の保存
   - 結果計算
   - 結果ページへの遷移

4. **検証**
   - 診断の完了テスト
   - スコア計算の正確性確認
   - UI/UXの動作確認

### 対象外（次フェーズ）
- 結果カード生成（OG画像）→ Iteration-02
- SNS共有機能 → Iteration-02
- 相性診断機能 → Iteration-03
- AI相談機能 → Iteration-04
- 認証機能（Clerk） → Iteration-05
- データベース連携 → Iteration-05

## 引き継ぎ情報

### Phase 2からの引き継ぎ
- **評価**: 96点（優秀）
- **テスト**: 16個、全パス
- **実装ファイル**:
  - `types/bigfive.ts` - 型定義（160行）
  - `lib/utils/bigfive-adapter.ts` - 変換ユーティリティ
  - `lib/tests/bigfive-calculator.ts` - 計算ロジック
  - `data/tests/bigfive-oss-ja-original.ts` - 元データ（120問）
- **推奨改善事項**（任意）:
  - JSDocコメント追加（+2点）
  - 型安全性強化（+2点）
  - Phase 3実装と並行で対応可

### 制約
- サーバー: localhost:3002で稼働中
- Next.js 15 + TypeScript + Tailwind CSS v3
- Vitest導入済み

## テストファースト戦略

### Phase 3のテスト方針

Phase 2で基盤のユニットテストは完了しているため、Phase 3では **統合テスト** と **E2Eテスト** に注力します。

#### 1. データファイルのバリデーションテスト（優先度: 高）
- **ファイル**: `data/tests/__tests__/bigfive-questions-20.test.ts`
- **テストケース**:
  - 質問数が20問であること
  - 各次元が4問ずつ含まれること
  - 各次元に正転・逆転項目が含まれること
  - IDが1-20の連番であること
  - 必須フィールドが全て存在すること

#### 2. 診断フローの統合テスト（優先度: 中）
- **ファイル**: `app/tests/bigfive/__tests__/page.test.tsx`（Reactコンポーネントテスト）
- **テストケース**:
  - 質問が順番に表示されること
  - 回答選択が機能すること
  - 進捗表示が正しく更新されること
  - 全問回答後に結果ページに遷移すること

#### 3. 結果計算の統合テスト（優先度: 高）
- **ファイル**: `app/tests/bigfive/result/__tests__/page.test.tsx`
- **テストケース**:
  - 20問の回答から正しくスコアが計算されること
  - 5次元全てのスコアが表示されること
  - スコアレベル（high/neutral/low）が正しく判定されること

### テスト実行タイミング

1. **データファイル作成後**: バリデーションテストを実行（TDD: Red → Green）
2. **UI実装中**: コンポーネントテストを随時実行
3. **実装完了後**: 手動E2Eテスト（localhost:3002で診断完了）

### 失敗させたい代表テスト

```typescript
// 20問版データのバリデーション
describe('BigFive 20-question short version', () => {
  it('should have exactly 20 questions', () => {
    expect(bigFiveQuestions20.length).toBe(20)
  })

  it('should have 4 questions per dimension', () => {
    const counts = countByDimension(bigFiveQuestions20)
    expect(counts.neuroticism).toBe(4)
    expect(counts.extraversion).toBe(4)
    expect(counts.openness).toBe(4)
    expect(counts.agreeableness).toBe(4)
    expect(counts.conscientiousness).toBe(4)
  })

  it('should include both normal and reversed items', () => {
    const reversed = bigFiveQuestions20.filter(q => q.reversed)
    const normal = bigFiveQuestions20.filter(q => !q.reversed)
    expect(reversed.length).toBeGreaterThan(0)
    expect(normal.length).toBeGreaterThan(0)
  })
})
```

## タスクボード

| # | アイテム | 種別 | 完了条件 | 優先度 |
|---|----------|------|----------|---------|
| 1 | 120問フルセットのエクスポート | Code | bigfive-questions-120.ts作成、メタデータ付き | High |
| 2 | 20問短縮版の作成 | Code | bigfive-questions-20.ts作成、各次元4問 | High |
| 3 | 20問版バリデーションテスト作成（失敗させる） | Test | テストが失敗することを確認 | High |
| 4 | 20問版バリデーションテスト修正 | Test | テストが全てパス | High |
| 5 | `/tests/bigfive` 診断ページ作成 | Code | 20問の質問表示、回答選択UI | High |
| 6 | 進捗表示の実装 | Code | X問/20問の表示 | Medium |
| 7 | 回答データの保存 | Code | useState or sessionStorageで保存 | High |
| 8 | `/tests/bigfive/result` 結果ページ作成 | Code | 5次元スコア表示、レベル判定 | High |
| 9 | 結果計算ロジックの統合 | Code | 回答→スコア計算→結果表示 | High |
| 10 | スタイリング（最小限） | Code | Tailwind CSSで基本的な見た目 | Medium |
| 11 | E2Eテスト（手動） | Test | localhost:3002で診断完了 | High |
| 12 | README.md更新 | Doc | Phase 3完了を反映 | Low |
| 13 | JSDocコメント追加（任意） | Doc | Phase 2の推奨改善事項 | Low |

## リスクと前提

### 技術的リスク
- **20問選抜基準**: どの質問を選ぶか → 各次元のfacet 1から4問選抜（バランス重視）
- **UI状態管理**: 複雑な状態管理は避け、useState/sessionStorageで対応
- **テストの範囲**: Reactコンポーネントテストは最小限（E2Eを重視）

### 依存関係
- Phase 2の成果物（型定義、計算ロジック、変換ユーティリティ）に依存
- BigFive OSS元データ（120問）の存在が前提

### 時間/リソース制約
- 目標: 2-3日で完了
- データ作成: 0.5日
- UI実装: 1-1.5日
- テストと調整: 0.5-1日

## 短縮版選抜基準

### 20問の選抜方針

**基準:**
1. 各次元から4問ずつ選抜（計20問）
2. 各次元でfacet 1の質問を優先（最も代表的）
3. 正転項目と逆転項目をバランスよく含める
4. 質問文が明確で理解しやすいものを優先

**具体的な選抜:**
- Neuroticism（神経症傾向）: facet 1から4問
- Extraversion（外向性）: facet 1から4問
- Openness（開放性）: facet 1から4問
- Agreeableness（協調性）: facet 1から4問
- Conscientiousness（誠実性）: facet 1から4問

**妥当性の根拠:**
- TIPI（Ten Item Personality Inventory）も各次元2問の短縮版で妥当性が確認されている
- facet 1は各次元の中核的特性を測定
- 20問（各次元4問）は5-10分で完了可能

---EXECUTION INSTRUCTION---

# 実行指示: Phase 3（実データ統合とUI実装）

## 最優先事項
1. **20問短縮版の作成を最優先**で行う（診断ページで使用）
2. **バリデーションテストを先に書く**（TDD原則）
3. **UI実装はシンプルに**（過度な装飾は避ける）
4. **動作確認を随時行う**（localhost:3002で実際に診断を完了させる）
5. **すべての成果物**を `.tmp/execution/iteration_01_phase3/` 配下に保存し、`---CREATED FILES---` で完全パスを列挙する

## 作成/更新すべき成果物

### 1. データファイル作成

#### 1-1. 120問フルセットのエクスポート
```bash
# 既存のbigfive-oss-ja-original.tsを変換してエクスポート
# 出力: data/tests/bigfive-questions-120.ts
```

**必須内容:**
- 120問の質問配列
- メタデータコメント（出典、ライセンス、バージョン）
- 型定義への適合

#### 1-2. 20問短縮版の作成（最優先）
```bash
# 120問から20問を選抜
# 出力: data/tests/bigfive-questions-20.ts
```

**選抜基準:**
- 各次元facet 1から4問
- ID 1-20の連番
- 正転・逆転項目をバランスよく

**必須内容:**
```typescript
import type { BigFiveQuestion } from '@/types/bigfive'

/**
 * BigFive Short Version (20 questions)
 *
 * Source: BigFive OSS (https://github.com/rubynor/bigfive-web)
 * License: MIT
 *
 * Selection criteria:
 * - 4 questions per dimension (total 20)
 * - Facet 1 questions (most representative)
 * - Balanced normal/reversed items
 */
export const bigFiveQuestions20: BigFiveQuestion[] = [
  // ... 20 questions
]

export const metadata = {
  totalCount: 20,
  version: '20-short',
  source: 'BigFive OSS',
  license: 'MIT'
}
```

### 2. テスト作成（TDD）

#### 2-1. 20問版バリデーションテスト（失敗させる）
- **ファイル**: `data/tests/__tests__/bigfive-questions-20.test.ts`
- **先に実行して失敗を確認**

```typescript
import { describe, it, expect } from 'vitest'
import { bigFiveQuestions20 } from '../bigfive-questions-20'

describe('BigFive 20-question short version', () => {
  it('should have exactly 20 questions', () => {
    expect(bigFiveQuestions20.length).toBe(20)
  })

  it('should have 4 questions per dimension', () => {
    const counts = {
      neuroticism: 0,
      extraversion: 0,
      openness: 0,
      agreeableness: 0,
      conscientiousness: 0
    }
    bigFiveQuestions20.forEach(q => {
      counts[q.dimension]++
    })
    expect(counts.neuroticism).toBe(4)
    expect(counts.extraversion).toBe(4)
    expect(counts.openness).toBe(4)
    expect(counts.agreeableness).toBe(4)
    expect(counts.conscientiousness).toBe(4)
  })

  it('should have sequential IDs from 1 to 20', () => {
    const ids = bigFiveQuestions20.map(q => q.id).sort((a, b) => a - b)
    expect(ids).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
  })

  it('should include both normal and reversed items', () => {
    const reversed = bigFiveQuestions20.filter(q => q.reversed).length
    const normal = bigFiveQuestions20.filter(q => !q.reversed).length
    expect(reversed).toBeGreaterThan(0)
    expect(normal).toBeGreaterThan(0)
  })
})
```

### 3. UI実装

#### 3-1. 診断ページ `/tests/bigfive/page.tsx`

**必須機能:**
- 20問の質問を1問ずつ表示
- 1-5のスケールで回答選択
- 進捗表示（X問/20問）
- 「次へ」ボタン
- 全問回答後に結果ページへ遷移

**基本構造:**
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { bigFiveQuestions20 } from '@/data/tests/bigfive-questions-20'
import type { BigFiveAnswer } from '@/types/bigfive'

export default function BigFiveTestPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<BigFiveAnswer[]>([])

  const currentQuestion = bigFiveQuestions20[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / bigFiveQuestions20.length) * 100

  const handleAnswer = (value: number) => {
    // 回答を保存
    const newAnswers = [...answers, { questionId: currentQuestion.id, value }]
    setAnswers(newAnswers)

    if (currentQuestionIndex < bigFiveQuestions20.length - 1) {
      // 次の質問へ
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // 全問完了 → 結果ページへ
      // answersをsessionStorageに保存
      sessionStorage.setItem('bigfive-answers', JSON.stringify(newAnswers))
      router.push('/tests/bigfive/result')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* 進捗バー */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">
            質問 {currentQuestionIndex + 1} / {bigFiveQuestions20.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 質問 */}
        <h2 className="text-2xl font-bold mb-8">{currentQuestion.text}</h2>

        {/* 回答選択 */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              className="w-full py-4 px-6 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="font-semibold">{value}</span> -{' '}
              {value === 1 && '全く当てはまらない'}
              {value === 2 && 'あまり当てはまらない'}
              {value === 3 && 'どちらでもない'}
              {value === 4 && 'やや当てはまる'}
              {value === 5 && '非常に当てはまる'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### 3-2. 結果ページ `/tests/bigfive/result/page.tsx`

**必須機能:**
- sessionStorageから回答データを取得
- スコア計算（`calculateBigFiveResult`を使用）
- 5次元のスコア表示
- レベル判定（high/neutral/low）
- 各次元の説明

**基本構造:**
```tsx
'use client'

import { useEffect, useState } from 'react'
import { calculateBigFiveResult } from '@/lib/tests/bigfive-calculator'
import type { BigFiveResult } from '@/types/bigfive'

export default function BigFiveResultPage() {
  const [result, setResult] = useState<BigFiveResult | null>(null)

  useEffect(() => {
    // sessionStorageから回答を取得
    const answersJson = sessionStorage.getItem('bigfive-answers')
    if (answersJson) {
      const answers = JSON.parse(answersJson)
      const calculatedResult = calculateBigFiveResult(answers)
      setResult(calculatedResult)
    }
  }, [])

  if (!result) {
    return <div>読み込み中...</div>
  }

  const dimensions = [
    { key: 'neuroticism', name: '神経症傾向', data: result.scores.neuroticism },
    { key: 'extraversion', name: '外向性', data: result.scores.extraversion },
    { key: 'openness', name: '開放性', data: result.scores.openness },
    { key: 'agreeableness', name: '協調性', data: result.scores.agreeableness },
    { key: 'conscientiousness', name: '誠実性', data: result.scores.conscientiousness }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">診断結果</h1>

        <div className="space-y-6">
          {dimensions.map((dim) => (
            <div key={dim.key} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{dim.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  dim.data.level === 'high' ? 'bg-red-100 text-red-800' :
                  dim.data.level === 'low' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dim.data.level === 'high' ? '高い' :
                   dim.data.level === 'low' ? '低い' : '中程度'}
                </span>
              </div>

              {/* スコアバー */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>平均: {dim.data.average.toFixed(2)}</span>
                  <span>正規化: {dim.data.normalized}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${dim.data.normalized}%` }}
                  />
                </div>
              </div>

              {/* 説明 */}
              <p className="text-gray-700">
                {/* 各次元の説明をここに追加 */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 4. ドキュメント

#### 4-1. 実装決定事項
- `.tmp/execution/iteration_01_phase3/decisions.md`:
  - 20問選抜基準の詳細
  - UI実装方針（シンプル優先）
  - 状態管理方法（useState + sessionStorage）

#### 4-2. テスト結果
- `.tmp/execution/iteration_01_phase3/test-results.md`:
  - バリデーションテスト結果
  - E2Eテスト結果（スクリーンショット推奨）

#### 4-3. README更新
- `README.md`: Phase 3完了を反映

## 推奨手順

### Day 1: データ作成とテスト（3-4時間）
1. 120問フルセットをエクスポート（30分）
2. 20問短縮版を作成（1時間）
3. バリデーションテストを作成（失敗させる）（30分）
4. テストをパスさせる（30分）
5. `npm run test`で全テストパス確認（15分）

### Day 2: UI実装（4-6時間）
1. `/tests/bigfive/page.tsx` 作成（2-3時間）
2. `/tests/bigfive/result/page.tsx` 作成（1.5-2時間）
3. スタイリング調整（30分-1時間）
4. 動作確認（30分）

### Day 3: テストと調整（2-3時間）
1. E2Eテスト（手動で診断完了）（1時間）
2. バグ修正（1時間）
3. ドキュメント作成（30分-1時間）
4. レビュー準備（30分）

## 品質基準

### テスト
- バリデーションテストが全てパス
- E2Eテストで診断が完了できる
- スコア計算が正確（Phase 2のテストで保証済み）

### 実装
- TypeScript strictモード準拠
- 20問短縮版が各次元4問ずつ
- UIがシンプルで使いやすい
- エラーハンドリングが適切

### ドキュメント
- 決定事項が明確に記録されている
- ファイルパスが `---CREATED FILES---` で追跡可能
- README.mdが最新状態を反映

---LEADER OUTPUT END---

---CREATED FILES---
- C:\Users\yiwao\personality-platform\.tmp\leader_instructions\iteration_01_phase3_plan.md

---NEXT AGENT INSTRUCTION---
## 📋 次のステップ：実行エージェントへ

1. 上記 `---EXECUTION INSTRUCTION---` 全体をコピー。
2. 新しいターミナル/セッションで実行エージェントに渡す。
3. 実行エージェントに以下を強調:
   - **20問短縮版の作成を最優先**
   - **バリデーションテストを先に書くこと**（TDD原則）
   - **UI実装はシンプルに**（過度な装飾は避ける）
   - **随時動作確認**（localhost:3002で実際に試す）

### 実行エージェントへの追加指示

- 20問短縮版が完成するまで、UI実装に着手しないこと
- バリデーションテストは**必ず失敗させてから**実装を開始すること
- 各ステップ完了時に `.tmp/execution/iteration_01_phase3/progress.md` に進捗を記録すること
- 不明点や仮定は `.tmp/execution/iteration_01_phase3/decisions.md` に記録すること
- UI実装中は随時localhost:3002で動作確認すること

---LONG TERM PLAN---
## 📍 実行中の長期的計画
- **パス**: `C:\Users\yiwao\personality-platform\docs\project-plan-v2.md`
- **現在位置**: Phase 1: MVP + バイラル導線（2-4週間、P0）
- **現在のマイルストーン**: Phase 1 - 恋愛・相性診断の基盤構築
- **次の目標**: Phase 1完了後、Phase 2（課金+リテンション）へ
- **進捗更新**:
  - Phase 1: MVP + バイラル導線
    - [進行中] 恋愛・相性診断（Big Fiveベース短縮版、20-30問）→ **Phase 3実装中**
      - ✅ Phase 2完了（96点）: 型定義、計算ロジック、データ変換ユーティリティ
      - 🔄 Phase 3進行中: 実データ統合、UI実装（/tests/bigfive）
    - [ ] 結果カード生成（1:1正方形 + 9:16ストーリーズ）→ Iteration-02で対応予定
    - [ ] SNS共有テンプレ（X/Instagram）→ Iteration-02で対応予定
    - [ ] 招待リンクで相性機能解放 → Iteration-03で対応予定
    - [ ] AI相談テンプレ（回数制限付き、月3回）→ Iteration-04で対応予定
    - [ ] 認証（Clerk）→ Iteration-05で対応予定
    - [ ] データベース（Prisma + Supabase）→ Iteration-05で対応予定

### イテレーション計画概要（更新版）

| イテレーション | 目標 | 対象機能 | 期間 | ステータス |
|---------------|------|----------|------|-----------|
| Iteration-01 Phase 2（完了） | BigFive OSS基盤構築 | 型定義、計算ロジック、テスト | 完了 | ✅ 96点 |
| Iteration-01 Phase 3（現在） | 実データ統合とUI実装 | 20問版作成、診断ページ、結果ページ | 2-3日 | 🔄 計画完了→実行待ち |
| Iteration-02 | 結果共有機能 | OG画像生成、SNS共有 | 1週間 | 未着手 |
| Iteration-03 | 相性診断 | 2人比較、招待リンク | 1-2週間 | 未着手 |
| Iteration-04 | AI相談MVP | 基本的な会話機能、回数制限 | 1週間 | 未着手 |
| Iteration-05 | 認証・DB | Clerk導入、Prisma+Supabase | 1週間 | 未着手 |

※長期的計画の大枠は変更なし。Phase 3で初めてユーザーが診断を完了できるようになります。
