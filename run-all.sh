#!/usr/bin/env bash
# Start all four eval projects at once with non-conflicting ports.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT/.run-logs"
PID_FILE="$ROOT/.run-pids"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"
fi
NPM_BIN="$(command -v npm 2>/dev/null || echo "$HOME/.nvm/versions/node/v20.18.0/bin/npm")"
NODE_BIN="$(command -v node 2>/dev/null || echo "$HOME/.nvm/versions/node/v20.18.0/bin/node")"

PORT_LEDGER_API=8000
PORT_CONVERTER_API=8001
PORT_FRAUD_API=8002
PORT_SCRAPER_API=8003
PORT_LEDGER_UI=5173
PORT_CONVERTER_UI=5174
PORT_SCRAPER_UI=5175
PORT_EXAMINER_HUB=5176

mkdir -p "$LOG_DIR"
log() { printf '[run-all] %s\n' "$*"; }

free_port() {
  local port=$1 pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    log "Freeing port $port (PIDs: $pids)"
    kill $pids 2>/dev/null || true
    sleep 1
  fi
}

stop_all() {
  if [[ -f "$PID_FILE" ]]; then
    log "Stopping previous run..."
    while read -r pid _; do
      [[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi
  for port in "$PORT_LEDGER_API" "$PORT_CONVERTER_API" "$PORT_FRAUD_API" "$PORT_SCRAPER_API" \
              "$PORT_LEDGER_UI" "$PORT_CONVERTER_UI" "$PORT_SCRAPER_UI" "$PORT_EXAMINER_HUB"; do
    free_port "$port"
  done
}

start_bg() {
  local name=$1 cmd=$2
  local logfile="$LOG_DIR/$name.log"
  log "Starting $name → $logfile"
  nohup bash -c "$cmd" >>"$logfile" 2>&1 &
  echo "$! $name" >>"$PID_FILE"
  disown "$!" 2>/dev/null || true
}

ensure_venv() {
  local dir=$1
  if [[ ! -d "$dir/.venv" ]]; then
    log "Creating venv in $dir"
    python3 -m venv "$dir/.venv"
    # shellcheck disable=SC1091
    source "$dir/.venv/bin/activate"
    pip install -q -r "$dir/requirements.txt"
    deactivate
  fi
}

ensure_npm() {
  local dir=$1
  if [[ ! -d "$dir/node_modules" ]]; then
    log "npm install in $dir"
    (cd "$dir" && "$NPM_BIN" install --silent)
  fi
}

ensure_scorer() {
  local dir=$1
  if [[ ! -f "$dir/target/debug/scorer" ]]; then
    log "Building Rust scorer in $dir"
    (cd "$dir" && cargo build -q)
  fi
}

stop_all
: >"$PID_FILE"

# --- Transaction Ledger ---
ensure_venv "$ROOT/transaction-ledger"
ensure_npm "$ROOT/transaction-ledger/frontend"
start_bg ledger-api "cd '$ROOT/transaction-ledger' && source .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port $PORT_LEDGER_API"
start_bg ledger-ui "source '$NVM_DIR/nvm.sh' 2>/dev/null; cd '$ROOT/transaction-ledger/frontend' && exec '$NPM_BIN' run dev -- --host 127.0.0.1 --port $PORT_LEDGER_UI --strictPort"

# --- Currency Converter ---
ensure_venv "$ROOT/currency-converter/service"
ensure_npm "$ROOT/currency-converter/frontend"
start_bg converter-api "cd '$ROOT/currency-converter/service' && source .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port $PORT_CONVERTER_API"
start_bg converter-ui "source '$NVM_DIR/nvm.sh' 2>/dev/null; cd '$ROOT/currency-converter/frontend' && exec '$NPM_BIN' run dev -- --host 127.0.0.1 --port $PORT_CONVERTER_UI --strictPort"

# --- Fraud Score System ---
ensure_venv "$ROOT/Fraud-score-system/api"
ensure_scorer "$ROOT/Fraud-score-system/scorer"
start_bg fraud-api "cd '$ROOT/Fraud-score-system/api' && source .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port $PORT_FRAUD_API"
start_bg fraud-worker "cd '$ROOT/Fraud-score-system/worker' && API_BASE_URL=http://127.0.0.1:$PORT_FRAUD_API exec '$NODE_BIN' worker.js"

# --- Screen Scraper Ops ---
ensure_venv "$ROOT/screen-scraper/scorer-gateway"
ensure_npm "$ROOT/screen-scraper/frontend"
ensure_scorer "$ROOT/screen-scraper/scorer"
start_bg scraper-gateway "cd '$ROOT/screen-scraper/scorer-gateway' && source .venv/bin/activate && uvicorn app.main:app --reload --host 127.0.0.1 --port $PORT_SCRAPER_API"
start_bg scraper-worker "cd '$ROOT/screen-scraper/worker' && GATEWAY_BASE_URL=http://127.0.0.1:$PORT_SCRAPER_API exec '$NODE_BIN' worker.js"
start_bg scraper-ui "source '$NVM_DIR/nvm.sh' 2>/dev/null; cd '$ROOT/screen-scraper/frontend' && exec '$NPM_BIN' run dev -- --host 127.0.0.1 --port $PORT_SCRAPER_UI --strictPort"

# --- Examiner hub (all projects in one tabbed UI) ---
start_bg examiner-hub "cd '$ROOT/examiner-hub' && exec python3 -m http.server $PORT_EXAMINER_HUB --bind 127.0.0.1"

log "Waiting for services to come up..."
sleep 6

printf '\n'
printf '══════════════════════════════════════════════════════════════\n'
printf '  ALL PROJECTS RUNNING\n'
printf '══════════════════════════════════════════════════════════════\n'
printf '\n'
printf '  EXAMINER HUB (all projects, tabbed UI)\n'
printf '    Open:       http://127.0.0.1:%s\n' "$PORT_EXAMINER_HUB"
printf '\n'
printf '  Transaction Ledger\n'
printf '    API:        http://127.0.0.1:%s/docs\n' "$PORT_LEDGER_API"
printf '    Dashboard:  http://127.0.0.1:%s\n' "$PORT_LEDGER_UI"
printf '\n'
printf '  Currency Converter\n'
printf '    API:        http://127.0.0.1:%s/docs\n' "$PORT_CONVERTER_API"
printf '    ER Diagram: http://127.0.0.1:%s/er-diagram\n' "$PORT_CONVERTER_UI"
printf '\n'
printf '  Fraud Score System\n'
printf '    API:        http://127.0.0.1:%s/docs\n' "$PORT_FRAUD_API"
printf '    Worker:     polling (see .run-logs/fraud-worker.log)\n'
printf '\n'
printf '  Screen Scraper Ops\n'
printf '    Gateway:    http://127.0.0.1:%s/docs\n' "$PORT_SCRAPER_API"
printf '    Dashboard:  http://127.0.0.1:%s\n' "$PORT_SCRAPER_UI"
printf '    Ops:        http://127.0.0.1:%s/ops\n' "$PORT_SCRAPER_UI"
printf '\n'
printf '  Logs:   %s\n' "$LOG_DIR"
printf '  Stop:   %s/stop-all.sh\n' "$ROOT"
printf '\n'

for label in "ledger-api/$PORT_LEDGER_API/api/health" "converter-api/$PORT_CONVERTER_API/health" "fraud-api/$PORT_FRAUD_API/health" "scraper-gateway/$PORT_SCRAPER_API/health"; do
  name=${label%%/*}
  rest=${label#*/}
  port=${rest%%/*}
  path=${rest#*/}
  if curl -sf "http://127.0.0.1:$port/$path" >/dev/null 2>&1; then
    log "✓ $name healthy"
  else
    log "✗ $name not responding yet — check $LOG_DIR/$name.log"
  fi
done

for label in "examiner-hub/$PORT_EXAMINER_HUB" "ledger-ui/$PORT_LEDGER_UI" "converter-ui/$PORT_CONVERTER_UI" "scraper-ui/$PORT_SCRAPER_UI"; do
  name=${label%%/*}
  port=${label#*/}
  if curl -sf "http://127.0.0.1:$port/" >/dev/null 2>&1; then
    log "✓ $name healthy"
  else
    log "✗ $name not responding yet — check $LOG_DIR/$name.log"
  fi
done
