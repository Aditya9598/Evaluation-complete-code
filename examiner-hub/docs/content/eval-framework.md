# Eval Framework + Workspace Projects

**Workspace:** `untitled folder`  
**Last updated:** 2026-06-17  
**Audience:** Evaluators and team onboarding

![Skill ladder — Basics, Intermediate, Advanced](../assets/skill-ladder.svg)

This document connects **what the eval framework asks for** (Basics / Intermediate / Advanced tasks) with **what exists in this workspace** — code, tests, docs, and UI evidence.

**Rule:** All four projects are **independent**. Do not share code, `.env`, or business logic between folders.

---

## Project quick reference

| Project | Folder | Eval tier | Port(s) | Stack summary |
|---------|--------|-----------|---------|-----------------|
| Transaction Ledger | `transaction-ledger/` | **Basics** (B1–B3) + I-style docs | 8000, 5173 | Python FastAPI + React |
| Currency Converter | `currency-converter/` | **Intermediate** (I1–I6) | 8001, 5173 | FastAPI + Node CLI + React |
| Fraud Score System | `Fraud-score-system/` | **Advanced** (A1–A6) | 8002 | FastAPI + Node worker + Rust |
| Screen Scraper Ops | `screen-scraper/` | **Advanced** (A1–A6) | 5173, 8003 | React dashboard + local gateway |

**Skill ladder:** Basics → Intermediate → Advanced (Fraud-score-system **or** screen-scraper for Advanced polyglot + ops).

---

## Examiner Hub — live UI on Railway

Use the [Examiner Hub](https://evaluation-complete-code-production.up.railway.app/) to preview each project. Below are screenshots from the deployed workspace (hub tab + embedded preview).

### Overview tab

![Examiner Hub overview — project cards and skill ladder](../assets/screenshots/hub-overview.png)

*Overview tab at `/` — pick a project card or use the tabs above.*

### Transaction Ledger (`#ledger`)

![Transaction Ledger in Examiner Hub](../assets/screenshots/hub-ledger.png)

*Basics tier — dashboard with account balances inside the hub iframe.*

![Ledger dashboard — accounts and totals](../assets/screenshots/ledger-dashboard.png)

![Ledger users and balances](../assets/screenshots/ledger-users.png)

![Ledger transactions table](../assets/screenshots/ledger-transactions.png)

### Currency Converter (`#converter`)

![Currency Converter in Examiner Hub](../assets/screenshots/hub-converter.png)

*Intermediate tier — FX converter UI in the hub preview.*

![Converter ER diagram page](../assets/screenshots/converter-er-diagram.png)

### Fraud Score System (`#fraud`)

![Fraud Score System in Examiner Hub](../assets/screenshots/hub-fraud.png)

*Advanced tier — local polyglot fraud pipeline dashboard at `/fraud/ui/`.*

![Fraud pipeline dashboard](../assets/screenshots/fraud-ui.png)

### Screen Scraper Ops (`#scraper`)

![Screen Scraper Ops in Examiner Hub](../assets/screenshots/hub-scraper.png)

*Advanced tier — live API ops dashboard at `/scraper/ops`.*

![Scraper ops pipeline view](../assets/screenshots/scraper-ops.png)

---

## How eval tiers map to projects

```text
BASICS (repo reader + simple builder)
  transaction-ledger/     ← primary home for B1, B2, B3; codebase satisfies B4

INTERMEDIATE (repo operator + polyglot builder)
  currency-converter/     ← I1–I6 artifacts + polyglot pair (I4)

ADVANCED (parallel agents + multi-language systems)
  Fraud-score-system/     ← self-contained A1–A6 (transactions → fraud score)
  screen-scraper/         ← A1–A6 + live API ops dashboard (hybrid)
```

---

# PART 1 — BASICS EVAL (`transaction-ledger/`)

**Eval title:** Repo reader and simple builder  
**What we built:** A small FastAPI ledger with `/api` routes, in-memory store, React dashboard, pytest suite, and eval docs under `docs/eval/basics/`.

---

## B1 — Repo artifact inventory (30 min)

**Eval asks:** Find major classes, services, models, configs, utilities.

| Eval requirement | Where it lives in this workspace |
|------------------|----------------------------------|
| Artifact list with evidence | [`transaction-ledger/docs/eval/basics/B1-artifact-inventory.md`](transaction-ledger/docs/eval/basics/B1-artifact-inventory.md) |
| Models | `transaction-ledger/app/models.py` — `User`, `Transaction`, `TransactionCreate`, `BalanceResponse` |
| Stores / services | `transaction-ledger/app/store.py` — `UserStore`, `TransactionStore` |
| API / controllers | `transaction-ledger/app/main.py` — FastAPI routes under `/api` |
| Config | `transaction-ledger/app/config.py`, `.env.example` |
| Frontend | `transaction-ledger/frontend/` — React pages, `api/client.ts` |

---

## B2 — API endpoint map (30 min)

**Eval asks:** Every external API route and frontend route.

| Eval requirement | Where it lives |
|------------------|----------------|
| Written map | [`transaction-ledger/docs/eval/basics/B2-api-endpoint-map.md`](transaction-ledger/docs/eval/basics/B2-api-endpoint-map.md) |
| API routes | `GET/POST /api/users`, `/api/transactions`, `/api/balance`, `/api/health` — see `app/main.py` |
| Frontend routes | `/`, `/users`, `/transactions`, `/transactions/new` — see `frontend/src/App.tsx` |
| OpenAPI | http://127.0.0.1:8000/docs |

---

## B3 — Test discovery and execution (15 min)

**Eval asks:** Framework, test files, exact commands, actual results.

| Eval requirement | Where it lives |
|------------------|----------------|
| Written discovery doc | [`transaction-ledger/docs/eval/basics/B3-test-discovery.md`](transaction-ledger/docs/eval/basics/B3-test-discovery.md) |
| Framework | `pytest` — `transaction-ledger/tests/test_api.py` |
| Command | `cd transaction-ledger && pytest -v` |
| Config | `requirements.txt` (pytest dependency) |

---

## B4 — FastAPI greenfield service (60 min)

**Eval asks:** FastAPI app, POST/GET transactions, GET balance, validation, ≥3 tests, README.

| Eval requirement | Where it lives |
|------------------|----------------|
| FastAPI app | `transaction-ledger/app/main.py` |
| POST `/api/transactions` | `create_transaction()` + Pydantic validation in `models.py` |
| GET `/api/transactions` | `list_transactions()` with optional `id` filter |
| GET `/api/balance` | `get_balance()` — overdraft guard in `store.py` |
| Tests (≥3) | `transaction-ledger/tests/test_api.py` |
| README install/run/test | [`transaction-ledger/README.md`](transaction-ledger/README.md) |

**Note:** B4 is demonstrated by the **ledger project itself**; there is no separate `B4-*.md` file because the repo is the deliverable.

---

# PART 2 — INTERMEDIATE EVAL (`currency-converter/`)

**Eval title:** Repo operator and polyglot builder  
**What we built:** FastAPI `/convert` service, Node `cli.js` client, React ER-diagram UI, Docker, bug-diagnosis branches, and full I1–I6 docs.

---

## I1 — ER diagram from repo (45 min)

| Eval requirement | Where it lives |
|------------------|----------------|
| Markdown ER doc + Mermaid | [`currency-converter/docs/eval/intermediate/I1-er-diagram.md`](currency-converter/docs/eval/intermediate/I1-er-diagram.md) |
| Interactive UI | http://127.0.0.1:5173/er-diagram — `frontend/src/pages/ErDiagramPage.tsx`, `data/erDiagram.ts` |
| Source entities | `service/app/models.py`, `converter.py` (in-memory rates dict) |

Also mirrored in `transaction-ledger/docs/eval/intermediate/I1-er-diagram.md` (ledger entities).

---

## I2 — End-to-end flow trace (45 min)

| Eval requirement | Where it lives |
|------------------|----------------|
| POST `/convert` trace | [`currency-converter/docs/eval/intermediate/I2-flow-trace.md`](currency-converter/docs/eval/intermediate/I2-flow-trace.md) |
| Ledger POST trace | [`transaction-ledger/docs/eval/intermediate/I2-flow-trace.md`](transaction-ledger/docs/eval/intermediate/I2-flow-trace.md) |

Includes entry point, file/function path, sequence diagram, uncertainties.

---

## I3 — Small safe change (60 min)

| Eval requirement | Where it lives |
|------------------|----------------|
| Converter change | [`currency-converter/docs/eval/intermediate/I3-safe-change.md`](currency-converter/docs/eval/intermediate/I3-safe-change.md) |
| Ledger change | [`transaction-ledger/docs/eval/intermediate/I3-safe-change.md`](transaction-ledger/docs/eval/intermediate/I3-safe-change.md) |

Shows diff scope, tests, risk, agent vs manual verification.

---

## I4 — Polyglot pair: FastAPI + Node client (90 min)

| Eval requirement | Where it lives |
|------------------|----------------|
| Written proof | [`currency-converter/docs/eval/intermediate/I4-polyglot.md`](currency-converter/docs/eval/intermediate/I4-polyglot.md) |
| FastAPI `/convert` | `currency-converter/service/app/main.py` |
| Node CLI | `currency-converter/client/cli.js` |
| Service tests | `currency-converter/service/tests/test_convert.py` (4 tests) |
| Two-terminal README | [`currency-converter/README.md`](currency-converter/README.md) |

---

## I5 — Dockerize and run (Intermediate extension)

| Eval requirement | Where it lives |
|------------------|----------------|
| Doc | [`currency-converter/docs/eval/intermediate/I5-docker.md`](currency-converter/docs/eval/intermediate/I5-docker.md) |
| Dockerfile | `currency-converter/Dockerfile` |

---

## I6 — Bug diagnosis (Intermediate extension)

| Eval requirement | Where it lives |
|------------------|----------------|
| Doc | [`currency-converter/docs/eval/intermediate/I6-bug-diagnosis.md`](currency-converter/docs/eval/intermediate/I6-bug-diagnosis.md) |
| Seeded bug branch | `eval/i6-seeded-bug` |
| Fix branch | `eval/i6-fix` |

---

# PART 3 — ADVANCED EVAL

**Eval title:** Parallel agent operator and system builder  
**Two implementations in this workspace** (same eval patterns, different domains):

| Implementation | Folder | Domain |
|----------------|--------|--------|
| **Fraud Score System** | `Fraud-score-system/` | Financial transactions → Rust fraud score (all local) |
| **Screen Scraper Ops** | `screen-scraper/` | Live Web Scraping API dashboard + article scorer (hybrid) |

---

## A1 — Multi-worktree parallel plan (45 min)

| Eval requirement | Fraud-score-system | Screen-scraper |
|------------------|-------------------|----------------|
| Plan doc | [`Fraud-score-system/docs/eval/advanced/A1-parallel-plan.md`](Fraud-score-system/docs/eval/advanced/A1-parallel-plan.md) | [`screen-scraper/docs/eval/advanced/A1-parallel-plan.md`](screen-scraper/docs/eval/advanced/A1-parallel-plan.md) |
| Lanes | `lane/scorer`, `lane/api`, `lane/worker` | `lane/opening-bell-pipeline`, `lane/opening-bell-audio` |
| Worktrees | `../Fraud-score-system-scorer`, `../Fraud-score-system-api` | `../ss-pipeline`, `../ss-audio` |
| UI evidence | — | http://127.0.0.1:5173/eval/advanced (Mermaid merge diagram) |

Shows: decomposition, agent prompts, merge order, shared constraints, verification.

---

## A2 — Execute two parallel worktrees (90 min)

| Eval requirement | Fraud-score-system | Screen-scraper |
|------------------|-------------------|----------------|
| Evidence doc | [`Fraud-score-system/docs/eval/advanced/A2-worktrees.md`](Fraud-score-system/docs/eval/advanced/A2-worktrees.md) | [`screen-scraper/docs/eval/advanced/A2-worktrees.md`](screen-scraper/docs/eval/advanced/A2-worktrees.md) |
| Commands | `git worktree add …` captured in doc | Same — `git worktree list` |
| Merge + tests | `make test`, `make e2e` output in doc | `make test`, `npm run build` in doc |

---

## A3 — Polyglot mini-system (150 min)

**Eval asks:** FastAPI + Node worker + Rust, contract, tests, README run order.

| Component | Fraud-score-system | Screen-scraper |
|-----------|-------------------|----------------|
| FastAPI ingestion | `api/` port **8002** — `POST /transactions` | `scorer-gateway/` port **8003** — `POST /jobs` |
| Node worker | `worker/worker.js` — polls pending | `worker/worker.js` — polls gateway; optional live news ingest |
| Rust scorer | `scorer/` — transaction risk score | `scorer/` — article relevance/risk score |
| Contract | [`shared/contract.json`](Fraud-score-system/shared/contract.json) v1.0 | [`shared/contract.json`](screen-scraper/shared/contract.json) v1.0 |
| Integration test | `scripts/e2e.sh`, `make e2e` | `scripts/e2e.sh`, `make e2e` |
| Doc | [`A3-polyglot.md`](Fraud-score-system/docs/eval/advanced/A3-polyglot.md) (via README) | [`screen-scraper/docs/eval/advanced/A3-polyglot.md`](screen-scraper/docs/eval/advanced/A3-polyglot.md) |

**Screen-scraper extra:** React dashboard calls **live** scraper API; A3 local stack only enriches articles — does not replace scraper backend.

---

## A4 — Repository modernization (90 min)

| Eval requirement | Fraud-score-system | Screen-scraper |
|------------------|-------------------|----------------|
| Doc | [`A4-modernization.md`](Fraud-score-system/docs/eval/advanced/A4-modernization.md) | [`screen-scraper/docs/eval/advanced/A4-modernization.md`](screen-scraper/docs/eval/advanced/A4-modernization.md) |
| First step | Pinned `api/requirements.txt` | Pinned `scorer-gateway/requirements.txt` + [`.github/workflows/test.yml`](screen-scraper/.github/workflows/test.yml) |
| Verification | `pytest`, `make test` | `pytest -m "not live"`, `make test`, `npm run build` |
| Rollback | `git revert` notes in doc | Same |

---

## A5 — Agent code review (60 min)

| Eval requirement | Fraud-score-system | Screen-scraper |
|------------------|-------------------|----------------|
| Review doc | [`A5-code-review.md`](Fraud-score-system/docs/eval/advanced/A5-code-review.md) | [`screen-scraper/docs/eval/advanced/A5-code-review.md`](screen-scraper/docs/eval/advanced/A5-code-review.md) |
| Seeded branch | `review/agent-pr-seeded` (worker unsafe patterns) | `review/agent-pr-seeded` — `review_seeded.py` on branch only |
| Issue table | Blocking / non-blocking + fixes | Security: secrets, shell=True, SQL f-string, logging |

---

## A6 — Performance profiling (90 min)

| Eval requirement | Fraud-score-system | Screen-scraper |
|------------------|-------------------|----------------|
| Doc | [`A6-performance.md`](Fraud-score-system/docs/eval/advanced/A6-performance.md) | [`screen-scraper/docs/eval/advanced/A6-performance.md`](screen-scraper/docs/eval/advanced/A6-performance.md) |
| Target | Rust scorer throughput (`bench_scorer.sh`) | `normalize_text` LRU cache in `scorer-gateway/app/text_analysis.py` |
| Benchmark | `scripts/bench_scorer.sh` | `make bench` / `scripts/bench_normalize.py` |
| UI chart | — | http://127.0.0.1:5173/analytics — A6 before/after bar chart |
| Tests still pass | `cargo test`, `make test` | `make test` (~96% hot-text improvement documented) |

---

# PART 4 — SCREEN SCRAPER OPS (examiner context)

**Why a fourth project:** Advanced eval also requires **operating a real production-style API** and **visual evidence** (ops dashboard), not only a local polyglot demo.

| What examiner sees | Evidence |
|--------------------|----------|
| Live API integration | `frontend/src/api/scraperClient.ts`, Vite proxy to scraper dev host |
| Per-endpoint health (green/red/yellow) | http://127.0.0.1:5173/ops |
| Full OpenAPI surface + Try-it | http://127.0.0.1:5173/apis — from `shared/openapi.json` |
| Eval A1–A6 with What/How + clickable docs | http://127.0.0.1:5173/eval/advanced |
| Polyglot A3 (local) | `scorer-gateway` + `worker` + `scorer` — same pattern as Fraud-score-system |

**Live API base:** `https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com` (VPN).

---

# PART 5 — TEAM RULES

1. **Isolation** — Never mix the four project folders.
2. **Ports** — 8000 ledger · 8001 converter · 8002 fraud · 8003 scraper gateway · **5173** React (ledger, converter, scraper).
3. **Validation** — `pytest -v`, `cargo test`, `npm test`, `make test`, `make e2e` before claiming complete.
4. **VPN** — Required for screen-scraper live API probes.
5. **Git** — Do not merge `review/agent-pr-seeded` into `main`.
6. **Agent vs manual** — Eval docs mark "agent-suggested, manually verified" where applicable.

---

# PART 6 — SUPPORTING DOCUMENTATION INDEX

| Document | Purpose |
|----------|---------|
| **This file** (`EVAL_AND_PROJECTS_GUIDE.md`) | Eval tasks ↔ workspace evidence (for examiners) |
| [`PROJECTS_OVERVIEW.md`](PROJECTS_OVERVIEW.md) | Short team summary |
| [`PROJECTS_DETAILED_GUIDE.txt`](PROJECTS_DETAILED_GUIDE.txt) | Point-wise technical deep dive (all four projects) |
| `*/docs/eval/` | Per-task markdown artifacts inside each repo |

---

# Quick verifier commands (copy-paste for examiners)

```bash
# Basics — transaction-ledger
cd transaction-ledger && pytest -v

# Intermediate — currency-converter
cd currency-converter/service && pytest -v
cd currency-converter/client && node cli.js --amount 100 --from USD --to EUR

# Advanced — Fraud-score-system
cd Fraud-score-system && make test && make e2e

# Advanced — screen-scraper
cd screen-scraper && make test && make e2e
cd screen-scraper/frontend && npm run build
# Dashboard: npm run dev → http://127.0.0.1:5173
```

---

*Documentation prepared for team onboarding and eval review. Update this file when new eval artifacts are added.*
