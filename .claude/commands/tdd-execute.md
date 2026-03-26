# TDD Execution Agent Command

**Role**: 実行エージェント（TDD実装・テスト作成・ドキュメント化）

## 使用タイミング

- リーダーエージェントから実行指示を受け取った時
- レビューエージェントから改善指示を受け取った時

## 実行手順

### 1. 計画ファイル読み込み

```bash
# リーダーエージェントが作成した計画を読む
cat .tmp/leader_instructions/iteration_XX_[タイトル]_plan.md
```

### 2. 作業ディレクトリ作成

```bash
# 成果物保存用ディレクトリ
mkdir -p .tmp/execution/iteration_XX_$(date +%Y%m%d_%H%M)
```

### 3. TDDサイクル実行

各タスクに対して、以下のRed-Green-Refactorサイクルを実行:

#### Red: 失敗するテストを書く

```typescript
// tests/[feature].test.ts
describe('[Feature Name]', () => {
  it('should [expected behavior]', () => {
    // Arrange: テストデータ準備
    const input = ...;

    // Act: 機能実行
    const result = targetFunction(input);

    // Assert: 期待値検証
    expect(result).toBe(expected);
  });
});
```

テスト実行（失敗することを確認）:
```bash
npm test -- [feature].test.ts
```

#### Green: テストをパスさせる最小実装

```typescript
// lib/[feature].ts
export function targetFunction(input: InputType): OutputType {
  // テストをパスする最小限の実装
  return ...;
}
```

テスト実行（成功することを確認）:
```bash
npm test -- [feature].test.ts
```

#### Refactor: コードを改善

```typescript
// lib/[feature].ts
export function targetFunction(input: InputType): OutputType {
  // リファクタリング
  // - 変数名の改善
  // - 重複コードの削除
  // - 型安全性の向上
  return ...;
}
```

テスト実行（引き続き成功することを確認）:
```bash
npm test -- [feature].test.ts
```

### 4. E2Eテスト実行

主要フローのE2Eテストを実行:

```bash
# Playwrightテスト実行
npm run test:e2e

# 特定のテストのみ実行
npm run test:e2e -- [test-name].spec.ts
```

### 5. ビルドエラーチェック

```bash
# TypeScriptエラー確認
npm run type-check

# ESLint確認
npm run lint

# ビルド実行
npm run build
```

### 6. 成果物保存

以下を `.tmp/execution/iteration_XX_YYYYMMDD_HHMM/` に保存:

- 実装したコードのコピー
- テストファイルのコピー
- テスト実行結果のログ
- ビルド結果のログ
- スクリーンショット（E2Eテスト実行時）

### 7. 実行レポート作成

以下の形式で報告:

```markdown
---OUTPUT DOCUMENT---

# Iteration-XX 実行レポート

作成日時: YYYY-MM-DD HH:MM
実行エージェント: Claude Sonnet 4.5

## 実装完了タスク

- [x] Task 1: [タスク名]
  - 実装内容: [詳細]
  - テスト結果: PASS (X tests)
  - ファイル: `[ファイルパス]`

- [x] Task 2: [タスク名]
  - 実装内容: [詳細]
  - テスト結果: PASS (X tests)
  - ファイル: `[ファイルパス]`

## TDDサイクル証跡

### Task 1: [タスク名]

#### Red（失敗するテスト）
```bash
$ npm test -- [test-file].test.ts
FAIL tests/[test-file].test.ts
  ✕ should [expected behavior] (X ms)
```

#### Green（テストパス）
```bash
$ npm test -- [test-file].test.ts
PASS tests/[test-file].test.ts
  ✓ should [expected behavior] (X ms)
```

#### Refactor（リファクタリング後もパス）
```bash
$ npm test -- [test-file].test.ts
PASS tests/[test-file].test.ts
  ✓ should [expected behavior] (X ms)
```

## テスト実行結果

### ユニットテスト
```
Test Suites: X passed, X total
Tests:       X passed, X total
Snapshots:   X total
Time:        X.XXs
```

### E2Eテスト
```
Running X test(s)
  ✓ [test scenario 1] (Xms)
  ✓ [test scenario 2] (Xms)
X passed (Xs)
```

## ビルド結果

```bash
$ npm run build
✓ Compiled successfully
```

## 成功基準達成状況

- [x] 基準1: [説明]
- [x] 基準2: [説明]
- [ ] 基準3: [未達成の理由]

## 成果物

---CREATED FILES---
/absolute/path/to/file1.ts
/absolute/path/to/file2.test.ts
/absolute/path/to/file3.tsx
.tmp/execution/iteration_XX_YYYYMMDD_HHMM/execution_report.md
.tmp/execution/iteration_XX_YYYYMMDD_HHMM/test_output.log
---END CREATED FILES---

## 次のステップ

レビューエージェントによる品質レビューを依頼します。

---END OUTPUT DOCUMENT---
```

### 8. レビューエージェントへ提出

レビューエージェント（ターミナル3）に以下を伝達:

```
Iteration-XX の実装が完了しました。
実行レポート: .tmp/execution/iteration_XX_YYYYMMDD_HHMM/execution_report.md

80点必達レビューをお願いします。
```

## チェックリスト

実行エージェントとして以下を確認:

- [ ] リーダーエージェントの計画を読み込んだ
- [ ] 作業ディレクトリを作成した（`.tmp/execution/iteration_XX_YYYYMMDD_HHMM/`）
- [ ] すべてのタスクでRed-Green-Refactorサイクルを実行した
- [ ] ユニットテストが全てパスした
- [ ] E2Eテストが全てパスした（スキップ含む）
- [ ] TypeScriptエラーが0件
- [ ] ESLint/Prettier準拠
- [ ] ビルドが成功した
- [ ] 成果物を `.tmp/execution/` に保存した
- [ ] 実行レポートを作成した（OUTPUT DOCUMENT形式）
- [ ] CREATED FILESに全ての成果物の完全パスを記載した
- [ ] レビューエージェントへ提出指示を出力した

## エラー対応

### テストが失敗した場合

1. エラーメッセージを確認
2. 実装を修正
3. テストを再実行
4. 失敗が続く場合、テスト自体を見直す

### ビルドエラーが発生した場合

1. TypeScriptエラーを修正
2. 型定義を追加・修正
3. `npm run type-check` で確認
4. `npm run build` で最終確認

### E2Eテストが失敗した場合

1. スクリーンショットを確認（`.tmp/execution/` に保存）
2. UIの実装を確認
3. テストのセレクタを確認
4. 環境変数（Clerk APIキー等）を確認

---

**注意**: このコマンドは実行エージェント（ターミナル2）専用です。計画やレビューは行わず、TDD実装のみを担当してください。
