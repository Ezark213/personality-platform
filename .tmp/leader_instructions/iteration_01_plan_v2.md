---LEADER OUTPUT START---

## イテレーション情報
- プロジェクト名: Personality Platform
- イテレーションID: Iteration-01 (v2 - BigFive OSS活用版)
- 参照レビュー: 初回（v1計画を改善）
- 作成日時: 2026-03-18 15:45
- ゴール: BigFive OSS質問データを活用した診断基盤の構築
- 成功判定: BigFive OSSの日本語質問データ（120問）が統合され、短縮版（20問）が作成され、計算ロジックのテストが全てパスすること

---PROJECT PLAN---

# イテレーション計画 v2（BigFive OSS活用版）

## 概要
当初、独自に質問データを作成する予定でしたが、BigFiveオープンソースプロジェクト（https://github.com/rubynor/bigfive-web）の存在を発見しました。

**重要な発見:**
- MITライセンスで商用利用可能
- IPIP-NEO-PIベースの学術的に妥当な質問データ
- 日本語を含む30言語以上に対応
- 120問のフルセット + 既存のスコアリングロジック

この発見により、より科学的に妥当で、国際標準に準拠した診断システムを短期間で構築できます。

## v1計画からの変更点

| 項目 | v1計画 | v2計画（改善版） |
|------|--------|-----------------|
| 質問データ | 独自作成（TIPI-J参考） | BigFive OSSの日本語データ活用 |
| 質問数 | 20問のみ | 120問フルセット + 20問短縮版 |
| 学術的根拠 | TIPI-J（10項目版）参考 | IPIP-NEO-PI（120項目版）準拠 |
| 計算ロジック | 独自実装 | BigFive OSSの方式を参考 |
| 将来展開 | 日本語のみ | 多言語展開が容易 |

## スコープ
### 含まれる対象
- BigFive OSS日本語質問データ（120問）のダウンロードと統合
- 質問データの型変換（BigFive形式 → 私たちの型定義）
- 短縮版（20問）の作成（各次元4問を選抜）
- BigFive OSSのスコアリング方式を参考にした計算ロジック実装
- 型定義の更新
- テストファーストでの開発

### 対象外（v1と同じ）
- 結果カード生成（OG画像）→ Iteration-02
- 相性診断機能 → Iteration-03
- AI相談機能 → Iteration-04
- SNS共有機能 → Iteration-02
- 認証機能（Clerk） → Iteration-05
- UI/UXの大幅な改善 → 最小限の変更

## 引き継ぎ情報
- 前回レビューの要点: なし（初回、ただしv1計画を改善）
- v1での作業:
  - Vitestセットアップ完了 ✓
  - 型定義作成済み（要更新）
  - 計算ロジックテスト作成済み（要更新）
  - 独自質問データ作成済み（BigFive OSSに置き換え）
- 制約:
  - サーバーはlocalhost:3002で稼働中
  - Next.js 15 + TypeScript + Tailwind CSS v3
  - Vitest導入済み

## テストファースト戦略

### 先に書くべきテスト

#### 1. BigFive質問データ変換のテスト（最優先）
- **ファイル**: `lib/utils/__tests__/bigfive-adapter.test.ts`
- **テストケース**:
  - BigFive形式から私たちの形式への変換
  - domain（N/E/O/A/C）から次元名への変換
  - keyed（plus/minus）からreversedへの変換
  - 120問すべてが正しく変換されるか
  - 短縮版20問の選抜が正しいか

#### 2. BigFive計算ロジックのテスト
- **ファイル**: `lib/tests/__tests__/bigfive-calculator.test.ts`（既存を更新）
- **テストケース**:
  - BigFive OSSのスコアリング方式（1-5の平均）
  - 正常系: 一般的な回答パターンでスコア計算
  - 境界値: すべて1（最低）/ すべて5（最高）
  - 逆転項目: keyed='minus'が正しく計算されるか
  - スコアレベル判定（high/neutral/low）
  - 120問版と20問版の両方

#### 3. 質問データのバリデーションテスト
- **ファイル**: `data/tests/__tests__/bigfive-questions.test.ts`
- **テストケース**:
  - 120問版: 質問数、次元配分、必須フィールド
  - 20問版: 質問数（20問）、各次元4問
  - IDの一意性
  - domain/keyedの妥当性

### 失敗させたい代表入力

```typescript
// BigFive形式の質問データ変換テスト
{
  input: {
    id: '43c98ce8-a07a-4dc2-80f6-c1b2a2485f06',
    text: '心配性だ',
    keyed: 'plus',
    domain: 'N',
    facet: 1
  },
  expected: {
    id: 1, // 連番に変換
    text: '心配性だ',
    dimension: 'neuroticism',
    reversed: false // keyed='plus' → reversed=false
  }
}

// keyed='minus'の逆転項目テスト
{
  input: {
    keyed: 'minus',
    domain: 'A'
  },
  expected: {
    reversed: true // keyed='minus' → reversed=true
  }
}

// スコア計算テスト（BigFive OSS方式）
{
  answers: [
    { questionId: 1, value: 5 }, // N次元
    { questionId: 2, value: 5 }, // N次元
    { questionId: 3, value: 5 }, // N次元
    { questionId: 4, value: 5 }, // N次元
  ],
  expected: {
    neuroticism: {
      average: 5.0, // (5+5+5+5)/4
      level: 'high' // > 3.5
    }
  }
}
```

### テスト環境・ツール
- **Vitest**: ユニットテスト実行環境（導入済み）
- **型チェック**: TypeScript strictモード

### データ準備
- **質問データ**: BigFive OSS日本語データ（120問）をダウンロード
- **変換ユーティリティ**: BigFive形式 → 私たちの形式
- **短縮版作成**: 120問から20問を選抜（各次元4問、バランス考慮）

## タスクボード

| # | アイテム | 種別 | 完了条件 | 優先度 |
|---|----------|------|----------|---------|
| 0 | Vitestのセットアップ（完了済み） | Code | ✓ | - |
| 1 | BigFive OSS質問データのダウンロード | Code | 120問の日本語データを取得 | High |
| 2 | 型定義の更新 | Code | BigFive形式に対応 | High |
| 3 | 質問データ変換ユーティリティのテスト作成（失敗させる） | Test | 変換テストが失敗することを確認 | High |
| 4 | 質問データ変換ユーティリティの実装 | Code | テストが全てパス | High |
| 5 | 120問フルセットの統合 | Code | data/tests/bigfive-questions-120.ts作成 | High |
| 6 | 20問短縮版の作成 | Code | data/tests/bigfive-questions-20.ts作成 | High |
| 7 | 計算ロジックのテスト更新 | Test | BigFive OSSスコアリング方式に対応 | High |
| 8 | 計算ロジックの実装更新 | Code | BigFive OSSの方式（1-5平均）で実装 | High |
| 9 | 診断ページの更新 | Code | /tests/bigfive で診断可能 | Medium |
| 10 | 結果ページの基本実装 | Code | 5次元のスコア表示 | Medium |
| 11 | ライセンス表記の追加 | Doc | BigFive OSSのクレジット表記 | High |
| 12 | README.mdの更新 | Doc | BigFive OSS活用を明記 | Medium |

## リスクと前提

### 技術的リスク
- BigFive OSSデータの統合: データ形式の違いを吸収する必要あり → アダプター層で対応
- 短縮版の選抜: どの20問を選ぶか → 各次元のfacet 1から選抜（バランス重視）
- スコアリング方式の違い: BigFive OSS（1-5平均）vs 私たちの方式（0-100正規化） → 両方サポート

### ライセンス・クレジット
- BigFive OSS: MITライセンス → 商用利用可能
- IPIP-NEO-PI: パブリックドメイン → 制約なし
- 必須対応:
  - README.mdにBigFive OSSへのクレジット表記
  - 質問データファイルにライセンス情報を記載

### 時間/リソース制約
- 目標: 1-2週間で完了（v1と同じ）
- データ統合により開発速度向上の見込み
- テストファーストのため初速は遅いが、後半で加速

### 依存関係
- BigFive OSSデータのダウンロード → 全作業の前提
- 型定義の更新 → 計算ロジック実装の前提
- 変換ユーティリティ → 質問データ統合の前提

---EXECUTION INSTRUCTION---

# 実行指示: Iteration-01 v2（BigFive OSS活用版）

## 最優先事項
1. **BigFive OSS日本語質問データ（120問）をダウンロード**し、プロジェクトに統合する。
2. **変換ユーティリティのテストを先に書く**（TDD原則）。
3. **ライセンス表記を忘れない**（BigFive OSS MITライセンス、IPIP-NEO-PIクレジット）。
4. **すべての成果物**を `.tmp/execution/iteration_01_v2/` 配下に保存し、`---CREATED FILES---` で完全パスを列挙する。

## 作成/更新すべき成果物

### 1. データ取得と準備

#### 1-1. BigFive OSS質問データのダウンロード
```bash
# 日本語質問データ（120問）
curl -o data/tests/bigfive-oss-ja-original.ts \
  https://raw.githubusercontent.com/rubynor/bigfive-web/master/packages/questions/src/data/ja/questions.ts
```

#### 1-2. ライセンスファイルの作成
- `data/tests/LICENSE-BIGFIVE.md`: BigFive OSSのMITライセンスを記載

### 2. テスト（優先順位順）

#### 2-1. 型定義の更新
- `types/bigfive.ts`: BigFive形式に対応する型を追加
  - `BigFiveOSSQuestion`: 元のBigFive形式
  - `BigFiveQuestion`: 私たちの形式（既存）

#### 2-2. 変換ユーティリティのテスト作成（失敗させる）
- `lib/utils/__tests__/bigfive-adapter.test.ts`
- テスト内容:
  - BigFive形式 → 私たちの形式への変換
  - domain（N/E/O/A/C）→ dimension名への変換
  - keyed（plus/minus）→ reversed（boolean）への変換
  - 120問すべての変換
  - 短縮版20問の選抜ロジック
- **先に実行して失敗を確認**

#### 2-3. 計算ロジックテストの更新
- `lib/tests/__tests__/bigfive-calculator.test.ts`（既存ファイルを更新）
- BigFive OSS方式（1-5の平均）に対応
- high/neutral/lowの判定ロジック

### 3. 実装（テストをパスさせる）

#### 3-1. 変換ユーティリティの実装
- `lib/utils/bigfive-adapter.ts`
- 関数:
  - `convertBigFiveOSSToOurFormat(ossQuestions): BigFiveQuestion[]`
  - `createShortVersion(questions, count): BigFiveQuestion[]`
  - `mapDomainToDimension(domain): BigFiveDimension`
  - `mapKeyedToReversed(keyed): boolean`

#### 3-2. 質問データの統合
- `data/tests/bigfive-questions-120.ts`: フルセット（120問）
- `data/tests/bigfive-questions-20.ts`: 短縮版（20問）
- 各ファイルにライセンス表記を含める

#### 3-3. 計算ロジックの更新
- `lib/tests/bigfive-calculator.ts`（既存ファイルを更新）
- BigFive OSS方式を参考:
  - 1-5の平均値を計算
  - 平均 > 3.5: high
  - 平均 < 2.5: low
  - それ以外: neutral
- 0-100正規化版も残す（将来のUI用）

#### 3-4. UIの最小更新
- `app/tests/bigfive/page.tsx`: 20問短縮版を使用
- `app/tests/bigfive/result/page.tsx`: 5次元のスコア表示

### 4. ドキュメント

#### 4-1. 実装決定事項
- `.tmp/execution/iteration_01_v2/decisions.md`:
  - BigFive OSS活用の理由
  - ライセンス情報
  - 変換方式
  - 短縮版選抜基準
  - スコアリング方式（2パターン: BigFive方式 & 0-100正規化）

#### 4-2. テスト結果
- `.tmp/execution/iteration_01_v2/test-results.md`:
  - テスト実行ログ
  - カバレッジレポート

#### 4-3. README更新
- `README.md`:
  - BigFive OSS活用を明記
  - ライセンス情報（MITライセンス、IPIP-NEO-PIクレジット）
  - データソースへのリンク

## 推奨手順

### Phase 1: データ取得とライセンス確認（Day 1）
1. BigFive OSS日本語質問データをダウンロード
2. ライセンスファイルを作成
3. データ構造を確認

### Phase 2: 変換ユーティリティのTDD実装（Day 2-3）
1. 型定義を更新
2. 変換テストを作成（**失敗させる**）
3. `npm run test`で失敗を確認
4. 変換ユーティリティを実装してテストをパス

### Phase 3: 質問データ統合（Day 4-5）
1. 120問フルセットを統合
2. 20問短縮版を作成（各次元facet 1から4問選抜）
3. バリデーションテストを実行

### Phase 4: 計算ロジック更新（Day 6-7）
1. 計算ロジックテストを更新
2. BigFive OSS方式を実装
3. テストが全てパス

### Phase 5: UI更新とドキュメント（Day 8-10）
1. 診断ページを更新
2. 結果ページを更新
3. README.mdを更新
4. ライセンス表記を追加

### Phase 6: 検証と提出（Day 11-14）
1. すべてのテストが通ることを確認
2. ローカルで診断フローが動作することを確認
3. 成果物を整理
4. レビュー用にサマリーを作成

## 品質基準

### テスト
- テストカバレッジ > 80%（計算ロジック & 変換ユーティリティ）
- 境界値・異常系を含む
- BigFive OSS方式と0-100正規化の両方をテスト

### 実装
- TypeScript strictモード準拠
- 型安全性が保たれている
- BigFive OSSのクレジット表記が適切
- コメントで変換ロジックの根拠を明記

### ライセンス
- BigFive OSS MITライセンスのクレジット表記
- IPIP-NEO-PIのクレジット表記
- ライセンスファイルの配置

### ドキュメント
- 決定事項が明確に記録されている
- ファイルパスが `---CREATED FILES---` で追跡可能
- README.mdが最新状態を反映

---LEADER OUTPUT END---

---CREATED FILES---
- C:\Users\yiwao\personality-platform\.tmp\leader_instructions\iteration_01_plan_v2.md

---NEXT AGENT INSTRUCTION---
## 📋 次のステップ：実行エージェントへ

1. 上記 `---EXECUTION INSTRUCTION---` 全体をコピー。
2. 新しいターミナル/セッションで実行エージェントに渡す。
3. 実行エージェントに以下を強調:
   - **BigFive OSSデータのダウンロードから開始**
   - **テストを先に書くこと**（TDD原則）
   - **ライセンス表記を忘れないこと**

### 実行エージェントへの追加指示

- BigFive OSS日本語データのダウンロードが完了するまで、他の実装に着手しないこと
- 変換ユーティリティのテストは**必ず失敗させてから**実装を開始すること
- 各ステップ完了時に `.tmp/execution/iteration_01_v2/progress.md` に進捗を記録すること
- 不明点や仮定は `.tmp/execution/iteration_01_v2/decisions.md` に記録すること
- ライセンス表記は最優先で対応すること

---LONG TERM PLAN---
## 📍 実行中の長期的計画
- **パス**: `C:\Users\yiwao\personality-platform\docs\project-plan-v2.md`
- **現在位置**: Phase 1: MVP + バイラル導線（2-4週間、P0）
- **現在のマイルストーン**: Phase 1 - 恋愛・相性診断の基盤構築
- **次の目標**: Phase 1完了後、Phase 2（課金+リテンション）へ
- **進捗更新**:
  - Phase 1: MVP + バイラル導線
    - [ ] 恋愛・相性診断（Big Fiveベース短縮版、20-30問）→ **[進行中]** Iteration-01 v2で対応中（BigFive OSS活用に方針変更）
    - [ ] 結果カード生成（1:1正方形 + 9:16ストーリーズ）→ Iteration-02で対応予定
    - [ ] SNS共有テンプレ（X/Instagram）→ Iteration-02で対応予定
    - [ ] 招待リンクで相性機能解放 → Iteration-03で対応予定
    - [ ] AI相談テンプレ（回数制限付き、月3回）→ Iteration-04で対応予定
    - [ ] 認証（Clerk）→ Iteration-05で対応予定
    - [ ] データベース（Prisma + Supabase）→ Iteration-05で対応予定

### 計画変更の記録

**変更日時**: 2026-03-18 15:45
**変更内容**: Iteration-01の実装方針をBigFive OSSの活用に変更
**変更理由**:
- BigFiveオープンソースプロジェクト（MITライセンス）の発見
- IPIP-NEO-PIベースの学術的に妥当な質問データが利用可能
- 120問フルセット + 多言語対応により、将来展開が容易
**影響範囲**: Iteration-01のみ（スケジュールへの影響なし、むしろ品質向上）
**承認**: ユーザーから「続行して」の承認取得済み

### イテレーション計画概要（更新版）

| イテレーション | 目標 | 対象機能 | 期間 | ステータス |
|---------------|------|----------|------|-----------|
| Iteration-01 v2（現在） | BigFive OSS活用診断基盤 | 質問データ統合、計算ロジック、基本UI | 1-2週間 | 計画完了→実行待ち |
| Iteration-02 | 結果共有機能 | OG画像生成、SNS共有 | 1週間 | 未着手 |
| Iteration-03 | 相性診断 | 2人比較、招待リンク | 1-2週間 | 未着手 |
| Iteration-04 | AI相談MVP | 基本的な会話機能、回数制限 | 1週間 | 未着手 |
| Iteration-05 | 認証・DB | Clerk導入、Prisma+Supabase | 1週間 | 未着手 |

※長期的計画の大枠は変更なし。Iteration-01の実装方針のみ改善。
