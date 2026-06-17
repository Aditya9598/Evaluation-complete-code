#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

source "$HOME/.cargo/env" 2>/dev/null || true

if [[ ! -x "$ROOT/scorer/target/debug/scorer" ]]; then
  echo "Building scorer..."
  (cd scorer && cargo build)
fi

if [[ ! -d scorer-gateway/.venv ]]; then
  python3 -m venv scorer-gateway/.venv
  source scorer-gateway/.venv/bin/activate
  pip install -r scorer-gateway/requirements.txt -q
else
  source scorer-gateway/.venv/bin/activate
fi

export SCORER_BIN="$ROOT/scorer/target/debug/scorer"
export GATEWAY_BASE_URL="http://127.0.0.1:8003"
export SCRAPER_API_BASE_URL="${SCRAPER_API_BASE_URL:-https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com}"

(cd scorer-gateway && uvicorn app.main:app --host 127.0.0.1 --port 8003) &
GW_PID=$!
cleanup() { kill "$GW_PID" 2>/dev/null || true; }
trap cleanup EXIT

sleep 2

JOB_ID="e2e-$(date +%s)"
curl -sf -X POST "$GATEWAY_BASE_URL/jobs" \
  -H "Content-Type: application/json" \
  -d "{\"contract_version\":\"1.0\",\"job_id\":\"$JOB_ID\",\"title\":\"Nifty rally today\",\"body\":\"Stock market sensex fii buying\",\"source\":\"economic_times\"}"

cd worker && node worker.js --once
cd "$ROOT"

RESULT=$(curl -sf "$GATEWAY_BASE_URL/jobs/$JOB_ID")
echo "$RESULT" | grep -q '"status":"scored"'
echo "$RESULT" | grep -q '"relevance_score"'

echo "e2e: PASSED for $JOB_ID"
