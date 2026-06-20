#!/usr/bin/env bash
set -euo pipefail

APP_ROOT=/app
FRAUD_SCORER_BIN="$APP_ROOT/Fraud-score-system/scorer/scorer"
SCRAPER_SCORER_BIN="$APP_ROOT/screen-scraper/scorer/scorer"
PUBLIC_PORT="${PORT:-}"
BIND_HOST="0.0.0.0"
if [[ -n "$PUBLIC_PORT" ]]; then
  BIND_HOST="127.0.0.1"
fi

shutdown() {
  echo "[entrypoint] Shutting down..."
  jobs -p | xargs -r kill 2>/dev/null || true
  wait || true
}
trap shutdown SIGTERM SIGINT EXIT

echo "[entrypoint] Starting transaction-ledger API + UI on :8000"
cd "$APP_ROOT/transaction-ledger"
uvicorn app.main:app --host "$BIND_HOST" --port 8000 &

echo "[entrypoint] Starting currency-converter API on :8001"
cd "$APP_ROOT/currency-converter/service"
uvicorn app.main:app --host "$BIND_HOST" --port 8001 &

echo "[entrypoint] Starting fraud-score API on :8002"
cd "$APP_ROOT/Fraud-score-system/api"
uvicorn app.main:app --host "$BIND_HOST" --port 8002 &

echo "[entrypoint] Starting fraud-score worker"
cd "$APP_ROOT/Fraud-score-system/worker"
API_BASE_URL=http://127.0.0.1:8002 SCORER_BIN="$FRAUD_SCORER_BIN" node worker.js &

echo "[entrypoint] Starting screen-scraper gateway on :8003"
cd "$APP_ROOT/screen-scraper/scorer-gateway"
uvicorn app.main:app --host "$BIND_HOST" --port 8003 &

echo "[entrypoint] Starting screen-scraper worker"
cd "$APP_ROOT/screen-scraper/worker"
GATEWAY_BASE_URL=http://127.0.0.1:8003 SCORER_BIN="$SCRAPER_SCORER_BIN" node worker.js &

echo "[entrypoint] Starting internal nginx (converter :5174, scraper :5175)"
nginx -c /etc/nginx/eval/nginx.conf &
NGINX_PID=$!

if [[ -n "$PUBLIC_PORT" ]]; then
  echo "[entrypoint] Starting public gateway on :$PUBLIC_PORT (Railway)"
  sed "s/\${PORT}/$PUBLIC_PORT/g" /etc/nginx/eval/nginx-gateway.conf.template \
    > /etc/nginx/eval/nginx-gateway.conf
  nginx -c /etc/nginx/eval/nginx-gateway.conf -g 'daemon off;' &
  GATEWAY_PID=$!
  WAIT_PID=$GATEWAY_PID
else
  echo "[entrypoint] Local Docker mode — map ports 8000-8003, 5174-5176"
  WAIT_PID=$NGINX_PID
fi

sleep 3
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  ALL PROJECTS RUNNING"
echo "══════════════════════════════════════════════════════════════"
if [[ -n "$PUBLIC_PORT" ]]; then
  echo "  EXAMINER HUB         /"
  echo "  Transaction Ledger   /ledger/"
  echo "  Currency Converter   /converter/"
  echo "  Fraud Score System   /fraud/ui/"
  echo "  Screen Scraper Ops   /scraper/ops"
else
  echo "  EXAMINER HUB         http://127.0.0.1:5176"
  echo "  Transaction Ledger   http://127.0.0.1:8000"
  echo "  Currency Converter   http://127.0.0.1:5174  (API :8001)"
  echo "  Fraud Score System   http://127.0.0.1:8002/ui/"
  echo "  Screen Scraper Ops   http://127.0.0.1:5175  (gateway :8003)"
fi
echo "══════════════════════════════════════════════════════════════"
echo ""

wait "$WAIT_PID"
