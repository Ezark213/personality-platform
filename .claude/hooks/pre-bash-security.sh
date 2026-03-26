#!/bin/bash
# Personality Platform - Pre-Bash Security Hook
# Bashコマンド実行前のセキュリティチェック

set -euo pipefail

# Bashコマンドの内容は環境変数 CLAUDE_TOOL_PARAM_command に渡される
COMMAND="${CLAUDE_TOOL_PARAM_command:-}"

if [ -z "$COMMAND" ]; then
  echo '{"decision":"allow","reason":"No command provided"}'
  exit 0
fi

# 1. 危険なコマンドパターンのブロック
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf \$HOME"
  "rm -rf ~"
  "chmod -R 777"
  "chown -R"
  "> /dev/sda"
  "dd if=/dev/zero"
  "mkfs"
  ":(){ :|:& };:"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qF "$pattern"; then
    echo "{\"decision\":\"block\",\"reason\":\"Dangerous command pattern detected: $pattern\"}"
    exit 0
  fi
done

# 2. .env.local の誤削除防止
if echo "$COMMAND" | grep -qE "(rm|del|erase).*\.env\.local"; then
  echo '{"decision":"block","reason":"Attempting to delete .env.local (use Edit tool instead)"}'
  exit 0
fi

# 3. node_modules の誤削除防止（npm ci 以外）
if echo "$COMMAND" | grep -qE "rm.*node_modules" && ! echo "$COMMAND" | grep -q "npm ci"; then
  echo '{"decision":"warn","reason":"Deleting node_modules without npm ci - confirm this is intentional"}'
  exit 0
fi

# 4. .git ディレクトリの誤操作防止
if echo "$COMMAND" | grep -qE "(rm|del).*\.git" && ! echo "$COMMAND" | grep -q "git clean"; then
  echo '{"decision":"block","reason":"Attempting to delete .git directory"}'
  exit 0
fi

# 5. 本番環境への危険な操作（将来のデプロイ用）
if echo "$COMMAND" | grep -qE "(vercel|railway|fly\.io).*--prod" && echo "$COMMAND" | grep -qE "(delete|destroy|remove)"; then
  echo '{"decision":"warn","reason":"Destructive operation on production environment - confirm this is intentional"}'
  exit 0
fi

# すべてのチェックをパスした場合は許可
echo '{"decision":"allow","reason":"Security check passed"}'
exit 0
