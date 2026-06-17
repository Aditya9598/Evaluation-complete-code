# A3 — Polyglot Mini-System

**Project:** screen-scraper  
**Date:** 2026-06-17

## Components

| Layer | Path | Role |
|-------|------|------|
| FastAPI | `scorer-gateway/` | Job queue on port 8003 |
| Node | `worker/` | Poll gateway, optional live news ingest |
| Rust | `scorer/` | `scorer score` stdin JSON → score stdout |

## Contract

`shared/contract.json` — `contract_version: "1.0"`

## Run order

See root [README.md](../../../README.md).

## Verification

```bash
make test
make e2e
```

Expected e2e output ends with: `e2e: PASSED for e2e-<timestamp>`
