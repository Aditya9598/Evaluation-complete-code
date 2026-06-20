#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT/.run-pids"

if [[ -f "$PID_FILE" ]]; then
  while read -r pid _; do
    [[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
  done < "$PID_FILE"
  rm -f "$PID_FILE"
fi

for port in 8000 8001 8002 8003 5173 5174 5175; do
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  [[ -n "$pids" ]] && kill $pids 2>/dev/null || true
done

echo "All services stopped."
