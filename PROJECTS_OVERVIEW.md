# Projects Overview — Team Guide

**Workspace:** `untitled folder`  
**Last updated:** 2026-06-17

This document explains **each project independently**. They are **not connected** — do not share code, configs, or assumptions across them.

---

## At a glance

| Project | Folder | Eval tier | Stack | Port(s) | Purpose |
|---------|--------|-----------|-------|---------|---------|
| **Transaction Ledger** | `transaction-ledger/` | Basics (B1–B4) | Python FastAPI + React | 8000, 5173 | In-memory ledger API + dashboard |
| **Currency Converter** | `currency-converter/` | Intermediate (I1–I6) | Python FastAPI + Node CLI + React | 8001, 5173 | FX conversion + ER diagram UI |
| **Fraud Score System** | `Fraud-score-system/` | Advanced (A1–A6) | Python + Node + Rust | 8002 | Fraud scoring pipeline (local) |
| **Screen Scraper Ops** | `screen-scraper/` | Advanced (A1–A6) | React + Python + Node + Rust | 5173, 8003 | Live scraper ops dashboard + local scorer |

```text
transaction-ledger     currency-converter     Fraud-score-system     screen-scraper
     (Basics)              (Intermediate)            (Advanced)            (Advanced)
         │                       │                         │                      │
    FastAPI + React          API + CLI + React      API + Worker + Rust    Live API dashboard
    /api prefix              hardcoded FX           contract v1.0          + local A3 scorer
```

---

## 1. Transaction Ledger (`transaction-ledger/`)

### What it is

Python API + **React dashboard** for a simple in-memory ledger (users, credit/debit, balances).

### Key points

- API routes under **`/api`** (e.g. `GET /api/users`, `POST /api/transactions`).
- Users seeded in-memory (ids 1–3). Balance = credits − debits.
- React UI: dashboard, users, transactions (dev on port **5173**).
- PostgreSQL in `.env` for future use — app still in-memory today.

### Run

```bash
# API
cd transaction-ledger && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# React (optional)
cd frontend && npm run dev
```

### Eval artifacts

`docs/eval/basics/` (B1–B3) and `docs/eval/intermediate/` (I1–I3).  
The **ledger codebase itself** is the B4 greenfield deliverable (POST/GET transactions, balance, tests, README).

---

## 2. Currency Converter (`currency-converter/`)

### What it is

FastAPI service (USD/EUR/GBP) + Node CLI + **React frontend** (I1 ER diagram).

### Run

```bash
cd currency-converter/service && uvicorn app.main:app --reload --port 8001
cd currency-converter/frontend && npm run dev
cd currency-converter/client && node cli.js --amount 100 --from USD --to EUR
```

### Eval artifacts

`docs/eval/intermediate/` — I1 through I6.

---

## 3. Fraud Score System (`Fraud-score-system/`)

### What it is

Self-contained **Advanced** polyglot pipeline: FastAPI → Node worker → Rust scorer.  
GitHub: `https://github.com/Aditya9598/Fraud-score-system.git`

### Run

```bash
cd Fraud-score-system
make test && make e2e
```

### Eval artifacts

`docs/eval/advanced/` — A1 through A6.

---

## 4. Screen Scraper Ops (`screen-scraper/`)

### What it is

**Hybrid Advanced** project:

1. **React dashboard** reads the **live** Web Scraping API (VPN) — ops pipeline, API catalog, analytics.
2. **Local A3 add-on** — `scorer-gateway` (8003) + worker + Rust scorer for article relevance/risk.

Does **not** rebuild the scraper backend locally.

### Dashboard pages

| URL | Purpose |
|-----|---------|
| `/ops` | React Flow pipeline + live probes |
| `/apis` | OpenAPI catalog with Try-it |
| `/analytics` | Timings + A6 perf chart |
| `/eval/advanced` | A1–A6 hub with clickable markdown |

### Live API base

`https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com`

### Run

```bash
cd screen-scraper/frontend && npm run dev    # http://127.0.0.1:5173
cd screen-scraper/scorer-gateway && uvicorn app.main:app --port 8003
cd screen-scraper/worker && node worker.js
make test && make e2e
```

### Eval artifacts

`docs/eval/advanced/` — A1 through A6 (also in `frontend/public/eval/advanced/` for UI).

---

## Eval framework — what each task tests

Full mapping (task → project → files → verify commands): **[EVAL_AND_PROJECTS_GUIDE.md](EVAL_AND_PROJECTS_GUIDE.md)**

### Basics — repo reader and simple builder (`transaction-ledger/`)

| Task | Time | What it tests | Workspace evidence |
|------|------|---------------|-------------------|
| **B1** | 30 min | Artifact inventory (models, services, configs) | `docs/eval/basics/B1-artifact-inventory.md` |
| **B2** | 30 min | API + frontend route map | `docs/eval/basics/B2-api-endpoint-map.md` |
| **B3** | 15 min | Test discovery, commands, results | `docs/eval/basics/B3-test-discovery.md` |
| **B4** | 60 min | Greenfield FastAPI (transactions, balance, ≥3 tests) | `app/main.py`, `tests/test_api.py`, `README.md` |

### Intermediate — repo operator and polyglot builder (`currency-converter/`)

| Task | Time | What it tests | Workspace evidence |
|------|------|---------------|-------------------|
| **I1** | 45 min | ER diagram from repo (Mermaid + source citations) | `docs/eval/intermediate/I1-er-diagram.md`, UI `/er-diagram` |
| **I2** | 45 min | End-to-end flow trace + sequence diagram | `docs/eval/intermediate/I2-flow-trace.md` |
| **I3** | 60 min | Small safe change + test in unfamiliar repo | `docs/eval/intermediate/I3-safe-change.md` |
| **I4** | 90 min | FastAPI `/convert` + Node CLI pair | `service/`, `client/cli.js`, `I4-polyglot.md` |
| **I5** | — | Dockerize and run | `I5-docker.md`, `Dockerfile` |
| **I6** | — | Bug diagnosis on seeded branch | `I6-bug-diagnosis.md`, branches `eval/i6-*` |

### Advanced — parallel agents and multi-language systems

Two projects satisfy the same eval patterns in different domains:

| Task | Time | What it tests | Fraud-score-system | Screen-scraper |
|------|------|---------------|--------------------|----------------|
| **A1** | 45 min | Parallel worktree plan | `docs/eval/advanced/A1-parallel-plan.md` | Same + UI at `/eval/advanced` |
| **A2** | 90 min | Execute and merge two worktrees | `A2-worktrees.md`, `../Fraud-score-system-*` | `A2-worktrees.md`, `../ss-pipeline`, `../ss-audio` |
| **A3** | 150 min | FastAPI + Node + Rust + contract | `api/`, `worker/`, `scorer/`, port 8002 | `scorer-gateway/`, port 8003 |
| **A4** | 90 min | Modernization plan + first step | `A4-modernization.md` | `A4-modernization.md`, `.github/workflows/test.yml` |
| **A5** | 60 min | Review agent PR, issue list + fixes | `A5-code-review.md`, `review/agent-pr-seeded` | Same pattern |
| **A6** | 90 min | Profile bottleneck, measurable fix | `A6-performance.md`, `bench_scorer.sh` | `A6-performance.md`, `make bench`, `/analytics` chart |

## Eval skill ladder

| Tier | Project |
|------|---------|
| Basics | `transaction-ledger` |
| Intermediate | `currency-converter` |
| Advanced (local polyglot) | `Fraud-score-system` |
| Advanced (live API + dashboard) | `screen-scraper` |

---

## Rules for the team

1. **Four isolated projects** — never mix code or `.env` between folders.
2. **Ports:** 8000 ledger · 8001 converter · 8002 fraud · 8003 scraper gateway · 5173 React UIs.
3. **Verify with tests** — `pytest`, `cargo test`, `npm test`, `make test`, `make e2e`.
4. **screen-scraper** needs VPN for live API probes in the dashboard.
5. **Never merge** `review/agent-pr-seeded` to main (A5 practice branches).

---

## Quick “which project do I open?”

| I want to… | Open |
|------------|------|
| Learn FastAPI + ledger basics | `transaction-ledger/` |
| Practice Docker + polyglot + ER diagrams | `currency-converter/` |
| Practice Rust worker + worktrees (all local) | `Fraud-score-system/` |
| Ops dashboard on real scraper API | `screen-scraper/` |
| Read eval write-ups | `*/docs/eval/` in each project |

---

## Repo links

| Project | Remote |
|---------|--------|
| Fraud-score-system | https://github.com/Aditya9598/Fraud-score-system.git |
| transaction-ledger | Local only |
| currency-converter | Local only |
| screen-scraper | Local only |

| I want to map eval tasks to evidence | **EVAL_AND_PROJECTS_GUIDE.md** (examiner guide) |
| Point-wise technical deep dive | **PROJECTS_DETAILED_GUIDE.txt** |
