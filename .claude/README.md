# .claude フォルダ構成

Personality Platform の Claude Code 設定ファイル群です。

## 📁 構成

```
.claude/
├── settings.json           # プロジェクト設定（環境変数、hooks）
├── hooks/                  # Git/実行フック
│   ├── session-start.sh   # セッション開始時チェック
│   ├── pre-bash-security.sh  # Bash実行前セキュリティチェック
│   └── post-commit-sync.sh   # Gitコミット後同期処理
├── commands/               # TDD 3セッション用コマンド
│   ├── tdd-leader.md      # リーダーエージェント（計画策定）
│   ├── tdd-execute.md     # 実行エージェント（TDD実装）
│   └── tdd-review.md      # レビューエージェント（80点必達レビュー）
├── skills/                 # カスタムスキル（将来拡張用）
└── README.md               # このファイル
```

## 🔧 settings.json

プロジェクト固有の設定:

- **環境変数**: `SLASH_COMMAND_TOOL_CHAR_BUDGET` (32000)
- **Hooks**: セッション開始、Bash実行前後のチェック

## 🪝 Hooks

### session-start.sh

セッション開始時に自動実行:

1. Git状態確認（uncommitted changes警告）
2. ビルドエラーチェック（TypeScript型チェック）
3. 最新ドキュメント確認（計画、レビュー結果）
4. 環境変数チェック（`.env.local` 必須変数）
5. テスト環境チェック（Playwright）

### pre-bash-security.sh

Bashコマンド実行前のセキュリティチェック:

- 危険なコマンドパターンのブロック（`rm -rf /`, `chmod -R 777` 等）
- `.env.local` 誤削除防止
- `node_modules` 誤削除防止
- `.git` ディレクトリ保護
- 本番環境への危険な操作警告

### post-commit-sync.sh

Gitコミット後の処理:

- `Co-Authored-By` チェック（コミットメッセージに必須）
- ビルドエラーチェック（push前の確認）
- Force push警告（mainブランチ）

## 📋 Commands（TDD 3セッション分離）

### tdd-leader.md

リーダーエージェント（ターミナル1）用コマンド:

- イテレーション計画策定
- タスク分解
- 実行指示生成
- 次フェーズ判断

### tdd-execute.md

実行エージェント（ターミナル2）用コマンド:

- Red-Green-Refactorサイクル実装
- ユニットテスト作成
- E2Eテスト実行
- 成果物作成・保存

### tdd-review.md

レビューエージェント（ターミナル3）用コマンド:

- 6カテゴリ100点満点レビュー
- 80点必達チェック
- 改善指示生成
- リーダーエージェントへ報告

## 🎯 使い方

### セッション開始時

hooks により自動的に `session-start.sh` が実行され、プロジェクト状態がチェックされます。

### TDD開発フロー

1. **ターミナル1（リーダー）**: `tdd-leader.md` を参照し、イテレーション計画を作成
2. **ターミナル2（実行）**: `tdd-execute.md` を参照し、TDD実装を実行
3. **ターミナル3（レビュー）**: `tdd-review.md` を参照し、80点必達レビューを実施

### Bashコマンド実行時

`pre-bash-security.sh` が自動実行され、危険なコマンドをブロックします。

### Gitコミット後

`post-commit-sync.sh` が自動実行され、ビルドエラーやコミットメッセージをチェックします。

## 📚 関連ドキュメント

- **CLAUDE.md**: プロジェクト全体のルール・ガイドライン
- **docs/README.md**: プロジェクトドキュメント一覧
- **docs/ai-prompt-design-v2.md**: AI相談機能のプロンプト設計

## 🔄 更新履歴

- 2026-03-26: 初期作成（settings.json, hooks, TDD commands）

---

**Built with ❤️ using Claude Code**
