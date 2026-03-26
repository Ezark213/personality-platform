# プロジェクトドキュメント

Personality Platformの設計・計画ドキュメント一覧です。

## 📚 ドキュメント構成

### 📋 プロジェクト計画・戦略

| ドキュメント | 説明 | 最終更新 |
|------------|------|----------|
| `project-plan-v2.md` | プロジェクト全体計画書（市場調査結果反映版） | 2026-03-18 |
| `monetization-strategy.md` | 収益化戦略（価格設定、KPI、ユニットエコノミクス） | 2026-03-18 |
| `pricing-experiment-plan.md` | 価格実験計画（A/Bテスト設計） | 2026-03-18 |

### 🤖 AI相談機能

| ドキュメント | 説明 | 最終更新 |
|------------|------|----------|
| `ai-consultation-design.md` | AI相談機能の詳細設計提案（英語、包括的） | 2026-03-26 |
| `ai-consultation-summary-ja.md` | AI相談機能の設計要約（日本語） | 2026-03-26 |
| `ai-prompt-design-v2.md` | AIプロンプト設計書 v2.0（Gemini 2.5 Flash、5層構造） | 2026-03-26 |

**推奨閲読順序**:
1. `ai-consultation-summary-ja.md` - 概要を把握
2. `ai-prompt-design-v2.md` - 実装詳細を理解
3. `ai-consultation-design.md` - 背景・市場分析を深掘り

### 🏗️ 技術設計

| ドキュメント | 説明 | 最終更新 |
|------------|------|----------|
| `api-design.md` | API設計書（エンドポイント仕様、Gemini統合） | 2026-03-26 |
| `database-schema.md` | データベーススキーマ（Prisma、PostgreSQL） | 2026-03-26 |

### 📦 アーカイブ

| フォルダ | 説明 |
|---------|------|
| `archive/` | 旧版ドキュメント（参考用、実装には使用しない） |

## 🎯 ドキュメント利用ガイド

### 新規参加者向け

1. **プロジェクト理解**:
   - `../README.md`（プロジェクトルート）
   - `project-plan-v2.md`

2. **AI相談機能の理解**:
   - `ai-consultation-summary-ja.md`
   - `ai-prompt-design-v2.md`

3. **技術実装**:
   - `api-design.md`
   - `database-schema.md`

### 実装者向け

**Iteration-03（AI相談機能MVP）の実装時**:

1. **設計理解**: `ai-consultation-summary-ja.md`
2. **プロンプト設計**: `ai-prompt-design-v2.md`（5層構造、サンプル会話）
3. **API実装**: `api-design.md`（エンドポイント仕様）
4. **データベース**: `database-schema.md`（AiConversation、AiMessage、AiInsightモデル）
5. **実行計画**: `../.tmp/leader_instructions/iteration_03_ai_consultation_plan.md`

### ビジネス・戦略担当者向け

1. **市場機会**: `ai-consultation-design.md`（英語、詳細な市場分析）
2. **収益化**: `monetization-strategy.md`
3. **価格実験**: `pricing-experiment-plan.md`

## 🔄 ドキュメント更新ルール

### 更新時の注意事項

1. **バージョニング**:
   - 大幅な変更時は新しいバージョンを作成（例: `xxx-v2.md`）
   - 旧版は `archive/` フォルダに移動

2. **相互参照**:
   - 関連ドキュメントへのリンクを明記
   - 矛盾がないように他のドキュメントも確認

3. **最終更新日**:
   - ドキュメント冒頭または末尾に記載

### Git管理

- すべてのドキュメント変更はGitコミットに含める
- コミットメッセージで変更内容を明記

## 📞 問い合わせ

ドキュメントに関する質問や改善提案は、GitHubのIssueまたはPull Requestで提起してください。

---

**プロジェクトルート**: [README.md](../README.md)
**実装計画**: [.tmp/leader_instructions/](../.tmp/leader_instructions/)
