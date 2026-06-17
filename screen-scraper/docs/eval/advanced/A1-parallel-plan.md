# A1 — Multi-Worktree Parallel Plan

**Project:** screen-scraper  
**Feature:** Opening Bell pipeline observability (live API dashboard)  
**Date:** 2026-06-17

---

## Task Decomposition

| Lane | Directory | Deliverable |
|------|-----------|-------------|
| **pipeline** | `frontend/src/data/pipelineTimings.ts` | Pipeline step duration constants for Analytics |
| **audio** | `frontend/src/data/audioMetrics.ts` | Audio generation duration / size metrics |
| **email** | merged on integration | Email recipient status cards (main) |

Lanes touch **disjoint files** during parallel work.

---

## Worktree / Branch Names

| Lane | Branch | Worktree path |
|------|--------|---------------|
| pipeline | `lane/opening-bell-pipeline` | `../ss-pipeline` |
| audio | `lane/opening-bell-audio` | `../ss-audio` |
| integration | `integration/opening-bell` | main repo |

---

## Agent Prompts

**lane/pipeline:**
> Add only `frontend/src/data/pipelineTimings.ts` and wire Analytics page to import it. Do not edit audio metrics or openapi.json.

**lane/audio:**
> Add only `frontend/src/data/audioMetrics.ts` and wire Analytics audio chart. Do not edit pipeline timings.

---

## Shared Constraints

- `shared/openapi.json` read-only during lanes
- Dashboard calls **live** scraper API via `VITE_SCRAPER_API_BASE_URL`
- scorer-gateway port **8003** unchanged
- Red UI status for known 500 endpoints (prefect health, clustering)

---

## Merge Order

```text
lane/pipeline → lane/audio → integration/opening-bell → main
```

---

## Verification

```bash
cd frontend && npm run build
make test
```
