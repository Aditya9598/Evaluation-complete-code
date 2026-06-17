#!/usr/bin/env bash
# Push all four eval projects to GitHub (run after: gh auth login -h github.com -p https -w)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Checking GitHub authentication..."
if ! gh auth status -h github.com >/dev/null 2>&1; then
  echo "Not logged in. Run: gh auth login -h github.com -p https -w"
  exit 1
fi
gh auth setup-git

echo "==> Creating missing GitHub repos (skip if they already exist)..."
for repo in currency-converter screen-scraper transaction-ledger; do
  if ! gh repo view "Aditya9598/$repo" >/dev/null 2>&1; then
    gh repo create "Aditya9598/$repo" --private --description "Eval project: $repo"
    echo "Created Aditya9598/$repo"
  else
    echo "Repo Aditya9598/$repo already exists"
  fi
done

echo "==> Setting HTTPS remotes..."
for repo in currency-converter screen-scraper transaction-ledger Fraud-score-system; do
  git -C "$ROOT/$repo" remote set-url origin "https://github.com/Aditya9598/$repo.git"
done

echo "==> Pushing Fraud-score-system (main)..."
git -C "$ROOT/Fraud-score-system" push -u origin main

echo "==> Pushing currency-converter (master + eval branches)..."
git -C "$ROOT/currency-converter" push -u origin master
git -C "$ROOT/currency-converter" push origin eval/i6-seeded-bug eval/i6-fix || true

echo "==> Pushing screen-scraper (main + review branch)..."
git -C "$ROOT/screen-scraper" push -u origin main
git -C "$ROOT/screen-scraper" push origin review/agent-pr-seeded || true

echo "==> Pushing transaction-ledger (main)..."
git -C "$ROOT/transaction-ledger" push -u origin main

echo ""
echo "Done. Repos:"
echo "  https://github.com/Aditya9598/Fraud-score-system"
echo "  https://github.com/Aditya9598/currency-converter"
echo "  https://github.com/Aditya9598/screen-scraper"
echo "  https://github.com/Aditya9598/transaction-ledger"
