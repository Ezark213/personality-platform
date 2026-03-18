---LEADER OUTPUT START---

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-01
- 参照レビュー: 初回
- 作成日時: 2026-03-18 15:30
- ゴール: Big Five診断基盤の構築（既存MBTI実装からの移行）
- 成功判定: Big Five計算ロジックのテストが全てパスし、20-30問の質問データが整備され、基本的な結果表示が動作すること

---PROJECT PLAN---

# イテレーション計画

## 概要
現在MBTIベースの診断が実装されていますが、商標リスク回避のため、学術的に広く使われるBig Five（開放性、誠実性、外向性、協調性、神経症傾向）に移行します。

Phase 1 MVP（長期的計画の最優先項目）である「恋愛・相性診断」の基盤として、Big Five短縮版（20-30問、5分以内）を実装します。

## スコープ
### 含まれる対象
- Big Five計算ロジックの実装（5次元のスコア計算）
- 質問データの作成（20-30問、各次元4-6問）
- 型定義の更新（MBTIResult → BigFiveResult）
- 基本的な結果ページの表示更新
- テストファーストでの開発（ユニットテスト先行）

### 対象外
- 結果カード生成（OG画像）→ Iteration-02で実装
- 相性診断機能 → Iteration-03で実装
- AI相談機能 → Iteration-04で実装
- SNS共有機能 → Iteration-02で実装
- 認証機能（Clerk） → Iteration-05で実装
- UI/UXの大幅な改善 → 今回は最小限の変更

## 引き継ぎ情報
- 前回レビューの要点: なし（初回）
- 既存資産:
  - `data/tests/mbti-questions.ts`: MBTI用質問データ（40問）
  - `lib/tests/mbti-calculator.ts`: MBTI計算ロジック
  - `app/tests/mbti/page.tsx`: 診断ページ
  - `app/tests/mbti/result/page.tsx`: 結果ページ
- 制約:
  - サーバーはlocalhost:3002で稼働中
  - Next.js 15 + TypeScript + Tailwind CSS v3
  - Vitest未導入（今回導入）

## テストファースト戦略

### 先に書くべきテスト

#### 1. Big Five計算ロジックのユニットテスト（最優先）
- **ファイル**: `lib/tests/__tests__/bigfive-calculator.test.ts`
- **テストケース**:
  - 正常系: 一般的な回答パターンでスコア計算
  - 境界値: すべて1（最低）/ すべて5（最高）
  - 逆転項目: 逆転項目が正しく計算されるか
  - 欠損値: 一部未回答の場合の挙動
  - 次元ごとの独立性: 各次元が独立して計算されるか

#### 2. 質問データのバリデーションテスト
- **ファイル**: `data/tests/__tests__/bigfive-questions.test.ts`
- **テストケース**:
  - 質問数の検証（20-30問の範囲内）
  - 各次元に均等に割り当て（各4-6問）
  - 必須フィールドの存在（id, text, dimension, direction, reversed）
  - IDの一意性
  - direction（正転/逆転）の妥当性

#### 3. 型定義のテスト
- **ファイル**: `types/__tests__/bigfive.test.ts`
- **テストケース**:
  - BigFiveResult型の構造検証
  - スコアの範囲（0-100）
  - 必須フィールドの存在

### 失敗させたい代表入力

```typescript
// 境界値テスト
{
  answers: [
    { questionId: 1, value: 1 }, // すべて最低
    { questionId: 2, value: 1 },
    // ... 全問1
  ],
  expected: {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  }
}

// 逆転項目テスト
{
  answers: [
    { questionId: 1, value: 5 }, // 正転項目
    { questionId: 2, value: 5 }, // 逆転項目
  ],
  // 逆転項目は5→1に変換されるべき
}

// 欠損値テスト
{
  answers: [
    { questionId: 1, value: 3 },
    // questionId: 2の回答がない
    { questionId: 3, value: 4 },
  ],
  // エラーまたはデフォルト値で処理
}
```

### テスト環境・ツール
- **Vitest**: ユニットテスト実行環境
- **@testing-library/react**: Reactコンポーネントテスト（Phase 2で使用）
- **型チェック**: TypeScript strictモード

### データ準備
- **質問データ**: 日本語版Big Five短縮尺度（TIPI-J等を参考）
- **モックデータ**: 回答パターンのフィクスチャ（テスト用）

## タスクボード

| # | アイテム | 種別 | 完了条件 | 優先度 |
|---|----------|------|----------|---------|
| 1 | Vitestのセットアップ | Code | package.json更新、vitest.config.ts作成、テスト実行可能 | High |
| 2 | Big Five型定義の作成 | Code | types/bigfive.tsで型定義完了 | High |
| 3 | Big Five計算ロジックのテスト作成（失敗させる） | Test | 計算ロジックテストが失敗することを確認 | High |
| 4 | Big Five計算ロジックの実装 | Code | テストが全てパス | High |
| 5 | Big Five質問データの作成 | Code | 20-30問の質問データ作成 | High |
| 6 | 質問データのバリデーションテスト | Test | 質問データの妥当性検証 | Medium |
| 7 | 診断ページの更新 | Code | /tests/bigfive で診断可能 | Medium |
| 8 | 結果ページの基本実装 | Code | 5次元のスコア表示 | Medium |
| 9 | 既存MBTIファイルのアーカイブ | Doc | MBTI関連ファイルを_archive/に移動 | Low |
| 10 | README.mdの更新 | Doc | Big Five実装状況を反映 | Low |

## リスクと前提

### 技術的リスク
- Big Fiveの学術的妥当性: TIPI-J等の既存尺度を参考にすることで軽減
- テスト導入による開発速度: 初期投資だが長期的に品質向上
- 既存MBTI実装との共存: アーカイブ化で対応

### 時間/リソース制約
- 目標: 1-2週間で完了
- 単独開発を前提
- テストファーストのため初速は遅いが、後半で加速

### 依存関係
- Vitest導入が全テストの前提
- Big Five型定義が計算ロジック実装の前提

---EXECUTION INSTRUCTION---

# 実行指示: Iteration-01

## 最優先事項
1. **Vitestのセットアップから着手**し、テスト実行環境を整える。
2. **失敗する計算ロジックテストを先に書く**（TDD原則）。
3. **仕様の不明点**（Big Fiveスコアの正規化方法等）は仮定を文章化してから実装する。
4. **すべての成果物**を `.tmp/execution/iteration_01/` 配下に保存し、`---CREATED FILES---` で完全パスを列挙する。

## 作成/更新すべき成果物

### 1. テスト（優先順位順）

#### 1-1. Vitestセットアップ
- `package.json`: vitest, @vitejs/plugin-react, @testing-library/react追加
- `vitest.config.ts`: Next.jsと統合する設定
- 動作確認用の簡単なテスト: `lib/__tests__/example.test.ts`

#### 1-2. Big Five計算ロジックテスト（失敗させる）
- `lib/tests/__tests__/bigfive-calculator.test.ts`
- 先に上記「失敗させたい代表入力」を含むテストを書く
- `npm run test`で失敗を確認

#### 1-3. 質問データバリデーションテスト
- `data/tests/__tests__/bigfive-questions.test.ts`
- 質問数、次元配分、必須フィールドを検証

### 2. 実装（テストをパスさせる）

#### 2-1. 型定義
- `types/bigfive.ts`: BigFiveResult, BigFiveQuestion, BigFiveAnswer等

#### 2-2. Big Five計算ロジック
- `lib/tests/bigfive-calculator.ts`: calculateBigFiveResult関数
- スコア正規化ロジック（1-5 → 0-100）
- 逆転項目の処理
- 欠損値の処理

#### 2-3. 質問データ
- `data/tests/bigfive-questions.ts`: 20-30問の質問配列
- TIPI-J（Ten Item Personality Inventory - Japanese）を参考にした日本語質問
- 各次元4-6問、正転/逆転をバランスよく配置

#### 2-4. UIの最小更新
- `app/tests/bigfive/page.tsx`: 診断ページ
- `app/tests/bigfive/result/page.tsx`: 結果ページ（5次元のスコアをレーダーチャートまたは棒グラフで表示）

### 3. ドキュメント

#### 3-1. 実装決定事項
- `.tmp/execution/iteration_01/decisions.md`:
  - Big Fiveスコア計算方法の根拠
  - 逆転項目の処理方法
  - 欠損値の扱い
  - 参考にした学術尺度

#### 3-2. テスト結果
- `.tmp/execution/iteration_01/test-results.md`:
  - テスト実行ログ
  - カバレッジレポート（実装後）

#### 3-3. README更新
- `README.md`: Big Five実装状況を追記

## 推奨手順

### Phase 1: テスト環境構築（Day 1-2）
1. Vitestをインストール
   ```bash
   npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
   ```
2. `vitest.config.ts`を作成
3. 簡単なテストで動作確認
4. テスト実行コマンドを`package.json`に追加

### Phase 2: テストファースト実装（Day 3-7）
1. Big Five型定義を作成
2. 計算ロジックテストを作成（**失敗させる**）
3. `npm run test`で失敗を確認
4. 計算ロジックを実装してテストをパス
5. 質問データバリデーションテストを作成
6. 質問データを作成してテストをパス

### Phase 3: UI更新とドキュメント（Day 8-10）
1. 診断ページを更新
2. 結果ページを更新（最小限のUI）
3. 決定事項ドキュメントを作成
4. README.mdを更新
5. 既存MBTIファイルを`_archive/mbti/`に移動

### Phase 4: 検証と提出（Day 11-14）
1. すべてのテストが通ることを確認
2. ローカルで診断フローが動作することを確認
3. 成果物を整理
4. レビュー用にサマリーを作成

## 品質基準

### テスト
- テストカバレッジ > 80%（計算ロジック）
- 境界値・異常系を含む
- テストが具体的な成功/失敗条件を持つ

### 実装
- TypeScript strictモード準拠
- 型安全性が保たれている
- 計算ロジックが学術的根拠に基づいている
- コメントで計算式の根拠を明記

### ドキュメント
- 決定事項が明確に記録されている
- ファイルパスが `---CREATED FILES---` で追跡可能
- README.mdが最新状態を反映

---LEADER OUTPUT END---

---CREATED FILES---
- C:\Users\yiwao\personality-platform\.tmp\leader_instructions\iteration_01_plan.md

---NEXT AGENT INSTRUCTION---
## 📋 次のステップ：実行エージェントへ

1. 上記 `---EXECUTION INSTRUCTION---` 全体をコピー。
2. 区切り線 `---` を挟んで実行プロンプト全文を貼り付け。
3. 実行エージェントに「**テストを先に書くこと**」を再度強調する。

### 実行エージェントへの追加指示

- Vitestセットアップが完了するまで、他の実装に着手しないこと
- 計算ロジックテストは**必ず失敗させてから**実装を開始すること
- 各ステップ完了時に `.tmp/execution/iteration_01/progress.md` に進捗を記録すること
- 不明点や仮定は `.tmp/execution/iteration_01/decisions.md` に記録すること

---LONG TERM PLAN---
## 📍 実行中の長期的計画
- **パス**: `C:\Users\yiwao\personality-platform\docs\project-plan-v2.md`
- **現在位置**: Phase 1: MVP + バイラル導線（2-4週間、P0）
- **現在のマイルストーン**: Phase 1 - 恋愛・相性診断の基盤構築
- **次の目標**: Phase 1完了後、Phase 2（課金+リテンション）へ
- **進捗更新**:
  - Phase 1: MVP + バイラル導線
    - [ ] 恋愛・相性診断（Big Fiveベース短縮版、20-30問）→ **[進行中]** Iteration-01で対応中
    - [ ] 結果カード生成（1:1正方形 + 9:16ストーリーズ）→ Iteration-02で対応予定
    - [ ] SNS共有テンプレ（X/Instagram）→ Iteration-02で対応予定
    - [ ] 招待リンクで相性機能解放 → Iteration-03で対応予定
    - [ ] AI相談テンプレ（回数制限付き、月3回）→ Iteration-04で対応予定
    - [ ] 認証（Clerk）→ Iteration-05で対応予定
    - [ ] データベース（Prisma + Supabase）→ Iteration-05で対応予定

### イテレーション計画概要（暫定）

| イテレーション | 目標 | 対象機能 | 期間 |
|---------------|------|----------|------|
| Iteration-01（現在） | Big Five診断基盤 | 計算ロジック、質問データ、基本UI | 1-2週間 |
| Iteration-02 | 結果共有機能 | OG画像生成、SNS共有 | 1週間 |
| Iteration-03 | 相性診断 | 2人比較、招待リンク | 1-2週間 |
| Iteration-04 | AI相談MVP | 基本的な会話機能、回数制限 | 1週間 |
| Iteration-05 | 認証・DB | Clerk導入、Prisma+Supabase | 1週間 |

※ユーザーの承認なしに長期的計画は変更しません。上記イテレーション分割は暫定案です。
