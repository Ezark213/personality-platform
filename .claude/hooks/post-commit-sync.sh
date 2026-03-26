#!/bin/bash
# Personality Platform - Post-Commit Sync Hook
# Gitコミット後の同期処理

set -euo pipefail

# Bashコマンドの内容は環境変数 CLAUDE_TOOL_PARAM_command に渡される
COMMAND="${CLAUDE_TOOL_PARAM_command:-}"

# gitコマンドでない場合はスキップ
if ! echo "$COMMAND" | grep -qE "^git (commit|push)"; then
  exit 0
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "📤 Post-Commit Sync"
echo "===================="

# 1. git commitが実行された場合
if echo "$COMMAND" | grep -q "git commit"; then
  echo "✅ Commit detected"

  # コミットメッセージに Co-Authored-By が含まれているか確認
  last_commit_msg=$(git log -1 --pretty=%B 2>/dev/null || echo "")
  if ! echo "$last_commit_msg" | grep -q "Co-Authored-By: Claude"; then
    echo "⚠️  Warning: Commit message missing 'Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>'"
  fi

  # ビルドエラーチェック（package.jsonが存在する場合）
  if [ -f "package.json" ] && [ -d "node_modules" ]; then
    echo ""
    echo "🔧 Running build check..."
    if npm run build &> /dev/null; then
      echo "✅ Build successful"
    else
      echo "⚠️  Build failed - consider fixing before push"
    fi
  fi
fi

# 2. git pushが実行された場合
if echo "$COMMAND" | grep -q "git push"; then
  echo "✅ Push detected"

  # プッシュ先のブランチを確認
  current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
  echo "   Branch: $current_branch"

  # mainブランチへのforce pushを警告（既にhookで防いでいるが念のため）
  if echo "$COMMAND" | grep -qE "push.*(-f|--force)" && [ "$current_branch" = "main" ]; then
    echo "⚠️  Force push to main detected!"
  fi
fi

echo "===================="
echo ""

exit 0
