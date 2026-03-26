#!/bin/bash
# Personality Platform - Session Start Hook
# セッション開始時のヘルスチェックとドキュメント確認

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 Personality Platform - Session Start"
echo "========================================"

# 1. Git状態確認
echo ""
echo "📊 Git Status:"
if [ -d ".git" ]; then
  git status --short || true

  # Uncommitted changes警告
  if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "⚠️  Uncommitted changes detected"
  fi
else
  echo "⚠️  Not a git repository"
fi

# 2. ビルドエラーチェック（package.jsonが存在する場合）
echo ""
echo "🔧 Build Check:"
if [ -f "package.json" ]; then
  if command -v npm &> /dev/null; then
    # node_modulesがない場合はスキップ
    if [ -d "node_modules" ]; then
      echo "Running type check..."
      npm run type-check 2>&1 | head -n 20 || echo "⚠️  Type check failed"
    else
      echo "⚠️  node_modules not found. Run: npm install"
    fi
  else
    echo "⚠️  npm not found"
  fi
else
  echo "✅ No package.json (non-Node.js project)"
fi

# 3. 最新ドキュメント確認
echo ""
echo "📚 Document Status:"
if [ -f "docs/README.md" ]; then
  echo "✅ docs/README.md exists"

  # 最新のイテレーション計画を表示
  if [ -d ".tmp/leader_instructions" ]; then
    latest_plan=$(ls -t .tmp/leader_instructions/iteration_*.md 2>/dev/null | head -n 1)
    if [ -n "$latest_plan" ]; then
      echo "📋 Latest iteration plan: $(basename "$latest_plan")"
    fi
  fi

  # 最新のレビュー結果を表示
  if [ -d ".tmp/review" ]; then
    latest_review=$(find .tmp/review -name "review_report.md" -type f 2>/dev/null | xargs ls -t 2>/dev/null | head -n 1)
    if [ -n "$latest_review" ]; then
      review_dir=$(dirname "$latest_review")
      echo "📝 Latest review: $(basename "$review_dir")"

      # スコアを抽出して表示
      if grep -q "総合スコア" "$latest_review" 2>/dev/null; then
        score=$(grep "総合スコア" "$latest_review" | head -n 1)
        echo "   $score"
      fi
    fi
  fi
else
  echo "⚠️  docs/README.md not found"
fi

# 4. 環境変数チェック
echo ""
echo "🔐 Environment Variables:"
if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"

  # 必須環境変数のチェック（存在確認のみ、値は表示しない）
  required_vars=("DATABASE_URL" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "CLERK_SECRET_KEY")
  for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" ".env.local" 2>/dev/null; then
      echo "   ✅ $var"
    else
      echo "   ⚠️  $var not found"
    fi
  done
else
  echo "⚠️  .env.local not found (copy from .env.example)"
fi

# 5. テスト環境チェック
echo ""
echo "🧪 Test Environment:"
if [ -d "tests/e2e" ]; then
  echo "✅ E2E tests directory exists"

  # Playwrightがインストールされているか確認
  if [ -d "node_modules/@playwright" ]; then
    echo "   ✅ Playwright installed"
  else
    echo "   ⚠️  Playwright not installed. Run: npm install"
  fi
fi

echo ""
echo "========================================"
echo "✅ Session start check complete"
echo ""
echo "📖 Quick Reference:"
echo "   - Project docs: docs/README.md"
echo "   - CLAUDE.md: Development rules and guidelines"
echo "   - Latest iteration plan: .tmp/leader_instructions/"
echo "   - Latest review: .tmp/review/"
echo ""
