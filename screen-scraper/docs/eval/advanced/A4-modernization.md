# A4 — Repository Modernization

**Project:** screen-scraper  
**Date:** 2026-06-17

## Findings

| Finding | Evidence | Priority |
|---------|----------|----------|
| No CI | Missing `.github/workflows` before this change | P1 — fixed |
| Unpinned Python deps | `scorer-gateway/requirements.txt` used loose ranges initially | P1 — fixed |
| No smoke tests against live scraper | No `test_smoke_live.py` | P2 — added (marked `live`) |
| No frontend build in CI | CI only Python before | P2 — fixed |

## First step implemented

Pinned `scorer-gateway/requirements.txt` and added `.github/workflows/test.yml`.

## Verification

```bash
cd scorer-gateway && pytest -v -m "not live"
make test
cd frontend && npm run build
```

## Rollback

```bash
git revert <commit-sha>
```
