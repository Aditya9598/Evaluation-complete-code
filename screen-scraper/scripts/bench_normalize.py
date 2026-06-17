#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/scorer-gateway"

source .venv/bin/activate 2>/dev/null || {
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt -q
}

python3 <<'PY'
import time
import re
from app.text_analysis import normalize_text

def normalize_no_cache(text: str) -> str:
    lowered = text.lower()
    cleaned = re.sub(r"[^a-z0-9\s]", " ", lowered)
    return re.sub(r"\s+", " ", cleaned).strip()

samples = [f"Nifty market stock rally number {i % 50}" for i in range(500)]
normalize_text.cache_clear()

start = time.perf_counter()
for s in samples:
    normalize_text(s)
cached_ms = (time.perf_counter() - start) * 1000

start = time.perf_counter()
for s in samples:
    normalize_no_cache(s)
no_cache_ms = (time.perf_counter() - start) * 1000

# Repeated same text — cache wins clearly
hot = "Nifty 50 Rally!!! Market stock fii"
normalize_text.cache_clear()
start = time.perf_counter()
for _ in range(5000):
    normalize_text(hot)
hot_cached_ms = (time.perf_counter() - start) * 1000

start = time.perf_counter()
for _ in range(5000):
    normalize_no_cache(hot)
hot_no_cache_ms = (time.perf_counter() - start) * 1000

improvement = ((hot_no_cache_ms - hot_cached_ms) / hot_no_cache_ms) * 100 if hot_no_cache_ms else 0
print(f"mixed samples cached: {cached_ms:.2f}ms for 500 texts (50 unique)")
print(f"mixed samples no cache: {no_cache_ms:.2f}ms for 500 texts")
print(f"repeated hot text cached: {hot_cached_ms:.2f}ms for 5000 calls")
print(f"repeated hot text no cache: {hot_no_cache_ms:.2f}ms for 5000 calls")
print(f"hot text improvement: {improvement:.1f}%")
PY
