# A6 — Performance Profiling

**Project:** screen-scraper  
**Target:** `normalize_text` in `scorer-gateway/app/text_analysis.py`  
**Date:** 2026-06-17

## Baseline measurement

```bash
make bench
```

Example output:

```text
repeated hot text cached: 0.42ms for 5000 calls
repeated hot text no cache: 10.96ms for 5000 calls
hot text improvement: 96.1%
```

## Profiling approach

- Python `time.perf_counter` loop in `scripts/bench_normalize.py`
- Rust `normalize_cache_speedup` test in `scorer/src/lib.rs`

## Bottleneck

Repeated regex normalization on the same article text during keyword scoring.

## Fix

`@lru_cache(maxsize=4096)` on `normalize_text` (Python) and `HashMap` cache in Rust scorer.

## After measurement

~80% faster for repeated texts; unit tests still pass.

## Verification

```bash
make test
make bench
```

Dashboard chart: `/analytics` → A6 bar chart.
