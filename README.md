# Eval Workspace

A multi-project **AI agent evaluation workspace** with four real demo applications and a unified **Examiner Hub**. Use it to test how well an agent can read repos, trace flows, make safe changes, build polyglot systems, and produce evidence — and as working reference apps across Basics → Intermediate → Advanced tiers.

**Live deployment:** [evaluation-complete-code-production.up.railway.app](https://evaluation-complete-code-production.up.railway.app/)

---

## What does this repo do?

This repository serves two purposes:

| Purpose | What it is | Who uses it |
|---------|------------|-------------|
| **1. Agent evaluation workspace** | Four isolated projects with eval artifacts (B1–A6), tests, and written proof in each `docs/eval/` folder | Reviewers, Cursor agents, examiners |
| **2. Demo applications + Examiner Hub** | Real FastAPI + React + Node + Rust apps behind one tabbed UI with hosted documentation | Developers, evaluators, onboarding |

**Critical rule:** All four projects are **independent**. Do not share code, `.env`, or business logic between folders.

---

## Agent evaluation (main goal)

The workspace asks: *Can an autonomous agent understand unfamiliar repos, run tests, make safe changes, build polyglot pipelines, and document proof?*

It defines tasks across three tiers (mapped to four projects):

| Tier | Tasks | Primary project | Examples |
|------|-------|-----------------|----------|
| **Basic (B1–B4)** | Read, map, test, build | `transaction-ledger/` | Repo inventory, API map, pytest, FastAPI greenfield ledger |
| **Intermediate (I1–I6)** | Operate in a repo | `currency-converter/` | ER diagrams, flow traces, safe changes, Docker, polyglot pair, bug diagnosis |
| **Advanced (A1–A6)** | System builder | `Fraud-score-system/` **or** `screen-scraper/` | Parallel plans, worktrees, FastAPI + Node + Rust pipeline, modernization, code review, performance |

Every project stores evidence under its own `docs/eval/` tree — markdown reports with file citations, commands, and (where applicable) UI pages.

| Document | Purpose |
|----------|---------|
| [EVAL_AND_PROJECTS_GUIDE.md](EVAL_AND_PROJECTS_GUIDE.md) | Task → project → file mapping for examiners |
| [PROJECTS_DETAILED_GUIDE.txt](PROJECTS_DETAILED_GUIDE.txt) | Point-wise technical deep dive |
| [PROJECTS_OVERVIEW.md](PROJECTS_OVERVIEW.md) | Short team summary |
| **Examiner Hub → Docs** | Hosted markdown viewer with screenshots (3 tabs) |

---

## Demo applications (reference targets)

| # | Project | Folder | Stack | What it demonstrates |
|---|---------|--------|-------|----------------------|
| 1 | **Transaction Ledger** | `transaction-ledger/` | FastAPI + React | In-memory credit/debit ledger, `/api` routes, dashboard, B1–B4 |
| 2 | **Currency Converter** | `currency-converter/` | FastAPI + Node CLI + React | FX conversion, ER diagram UI, I1–I6 polyglot pair |
| 3 | **Fraud Score System** | `Fraud-score-system/` | FastAPI + Node worker + Rust | Contract v1.0 pipeline, A1–A6 (fully local) |
| 4 | **Screen Scraper Ops** | `screen-scraper/` | React + gateway + worker + Rust | Live scraper API dashboard + local A3 scorer add-on |

```text
Skill ladder:

  transaction-ledger  →  currency-converter  →  Fraud-score-system
       (Basics)            (Intermediate)           (Advanced)
                                                    screen-scraper
                                                    (Advanced + live API)
```

---

## How it works

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         EVAL WORKSPACE MONOREPO                         │
├─────────────────────────────────────────────────────────────────────────┤
│  examiner-hub/           Tabbed UI + hosted Docs (3 tabs, screenshots)  │
│  run-all.sh / stop-all.sh   Start/stop all services locally             │
│  Dockerfile + railway.toml    Single image → Railway or local Docker    │
├─────────────────────────────────────────────────────────────────────────┤
│  transaction-ledger/     FastAPI :8000 + React :5173   (Basics B1–B4)   │
│  currency-converter/     FastAPI :8001 + React :5174   (Intermediate)   │
│  Fraud-score-system/     FastAPI :8002 + worker + Rust (Advanced)       │
│  screen-scraper/         Gateway :8003 + React :5175   (Advanced + ops) │
├─────────────────────────────────────────────────────────────────────────┤
│  */docs/eval/            Written eval evidence per tier                 │
│  EVAL_AND_PROJECTS_GUIDE.md   Examiner task → evidence map              │
└─────────────────────────────────────────────────────────────────────────┘
```

On **Railway**, nginx routes everything through one public port:

```text
  /                    Examiner Hub (overview + tabbed iframes)
  /docs.html           Hosted documentation
  /ledger/             Transaction Ledger UI + API
  /converter/          Currency Converter UI
  /converter-api/      Converter FastAPI
  /fraud/              Fraud API + static UI
  /scraper/            Screen Scraper React dashboard
  /scraper-gateway/    Local scorer gateway (A3)
  /scraper-api/        Proxy to live Web Scraping API
```

---

## Typical flows

### A. Run everything locally (recommended)

```bash
chmod +x run-all.sh stop-all.sh
./run-all.sh
```

Open **http://127.0.0.1:5176** — the Examiner Hub with tabs for all four projects.

Press Ctrl+C is not needed; use `./stop-all.sh` to stop all services.

### B. Run one project only

See per-project sections below, or open that project's own `README.md`.

### C. Evaluate with a Cursor agent

1. Open this repo (or a single project folder) in Cursor.
2. Point the agent at eval tasks in [EVAL_AND_PROJECTS_GUIDE.md](EVAL_AND_PROJECTS_GUIDE.md).
3. Agent reads code, runs commands, modifies code where tasks require it (I3, I6, A4, …).
4. Agent writes or updates proof in the target project's `docs/eval/` folder.

### D. Deploy to Railway

Push to the connected branch — Railway builds `Dockerfile` with `RAILWAY=true` and exposes one public URL.

---

## Quick start

**Requirements:** Python 3.11+, Node.js 18+, Rust/Cargo (for Advanced scorers), macOS/Linux or WSL. Docker optional.

```bash
git clone <your-repo-url>
cd Evaluation-complete-code
chmod +x run-all.sh stop-all.sh

./run-all.sh    # starts all APIs, workers, UIs, and Examiner Hub
```

| Command | Purpose |
|---------|---------|
| `./run-all.sh` | Start all four projects + Examiner Hub on fixed ports |
| `./stop-all.sh` | Stop all background processes and free ports |
| `docker build -t eval-workspace .` | Build unified image (see Docker section) |

---

## URLs

### Local (after `./run-all.sh`)

| URL | Purpose |
|-----|---------|
| http://127.0.0.1:5176 | **Examiner Hub** — tabbed UI for all projects |
| http://127.0.0.1:5176/docs.html | **Hosted docs** — eval guide, detailed guide, overview |
| http://127.0.0.1:8000/docs | Transaction Ledger OpenAPI |
| http://127.0.0.1:5173 | Transaction Ledger React dashboard |
| http://127.0.0.1:8001/docs | Currency Converter OpenAPI |
| http://127.0.0.1:5174 | Currency Converter React UI |
| http://127.0.0.1:5174/er-diagram | I1 ER diagram page |
| http://127.0.0.1:8002/docs | Fraud Score System OpenAPI |
| http://127.0.0.1:8002/ui/ | Fraud Score static UI |
| http://127.0.0.1:8003/docs | Screen Scraper scorer-gateway OpenAPI |
| http://127.0.0.1:5175 | Screen Scraper Ops dashboard |
| http://127.0.0.1:5175/ops | Ops pipeline (React Flow + live probes) |
| http://127.0.0.1:5175/eval/advanced | A1–A6 eval hub in UI |

### Railway (production)

| URL | Purpose |
|-----|---------|
| https://evaluation-complete-code-production.up.railway.app/ | Examiner Hub |
| …/docs.html | Hosted documentation |
| …/ledger/ | Transaction Ledger |
| …/converter/ | Currency Converter |
| …/fraud/ui/ | Fraud Score System UI |
| …/scraper/ops | Screen Scraper Ops pipeline |
| …/ledger/docs | Ledger Swagger (root-path aware) |
| …/scraper-gateway/docs | Scorer gateway Swagger |

---

## Evaluation framework

### Task → project map

| Task | Time | What it tests | Evidence location |
|------|------|---------------|-------------------|
| **B1** | 30 min | Artifact inventory | `transaction-ledger/docs/eval/basics/B1-artifact-inventory.md` |
| **B2** | 30 min | API + frontend route map | `transaction-ledger/docs/eval/basics/B2-api-endpoint-map.md` |
| **B3** | 15 min | Test discovery and execution | `transaction-ledger/docs/eval/basics/B3-test-discovery.md` |
| **B4** | 60 min | Greenfield FastAPI ledger | `transaction-ledger/app/`, `tests/test_api.py`, `README.md` |
| **I1** | 45 min | ER diagram from repo | `currency-converter/docs/eval/intermediate/I1-er-diagram.md`, UI `/er-diagram` |
| **I2** | 45 min | End-to-end flow trace | `currency-converter/docs/eval/intermediate/I2-flow-trace.md` |
| **I3** | 60 min | Small safe code change | `currency-converter/docs/eval/intermediate/I3-safe-change.md` |
| **I4** | 90 min | FastAPI + Node CLI pair | `currency-converter/docs/eval/intermediate/I4-polyglot.md` |
| **I5** | — | Dockerize and run | `currency-converter/docs/eval/intermediate/I5-docker.md`, `Dockerfile` |
| **I6** | — | Bug diagnosis on seeded branch | `currency-converter/docs/eval/intermediate/I6-bug-diagnosis.md` |
| **A1–A6** | varies | Advanced polyglot + ops | `Fraud-score-system/docs/eval/advanced/` or `screen-scraper/docs/eval/advanced/` |

Full mapping with verify commands: **[EVAL_AND_PROJECTS_GUIDE.md](EVAL_AND_PROJECTS_GUIDE.md)**

### Evidence structure (per project)

```text
transaction-ledger/docs/eval/
├── basics/          B1, B2, B3
└── intermediate/    I1–I3 (ledger-side copies)

currency-converter/docs/eval/
└── intermediate/    I1–I6

Fraud-score-system/docs/eval/
└── advanced/        A1–A6

screen-scraper/docs/eval/
└── advanced/        A1–A6 (+ mirrored in frontend/public/eval/advanced/)
```

---

## Project 1 — Transaction Ledger

**Tier:** Basics (B1–B4)  
**Stack:** Python FastAPI + React  
**Ports:** API `8000`, React dev `5173`

A FastAPI service that tracks in-memory credit/debit transactions and exposes balance, plus a React dashboard.

### Features

- REST API under `/api` — users, transactions, balance, health
- In-memory store with three seeded users (ids 1–3)
- Overdraft guard on debit transactions
- React pages: dashboard, users, transactions, create transaction
- pytest suite in `tests/test_api.py`

### API endpoints

All routes prefixed with `/api`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all dummy users |
| GET | `/api/users/{id}` | Get one user by id |
| POST | `/api/transactions` | Create credit or debit transaction |
| GET | `/api/transactions` | List transactions (optional `id` filter) |
| GET | `/api/balance` | Balance for account (`id` required) |
| GET | `/api/health` | Health check |

### Run locally

```bash
# Terminal 1 — API
cd transaction-ledger && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 — React dashboard
cd transaction-ledger/frontend && npm install && npm run dev
```

### Example curl

```bash
curl http://127.0.0.1:8000/api/users

curl -X POST http://127.0.0.1:8000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "amount": 100, "type": "credit", "description": "Deposit"}'

curl "http://127.0.0.1:8000/api/balance?id=1"
```

### Test

```bash
cd transaction-ledger && pytest -v
```

More detail: [transaction-ledger/README.md](transaction-ledger/README.md)

---

## Project 2 — Currency Converter

**Tier:** Intermediate (I1–I6)  
**Stack:** FastAPI + Node.js CLI + React  
**Ports:** API `8001`, React dev `5174` (via `./run-all.sh`)

Polyglot mini-system: FastAPI conversion service + Node CLI client + React ER diagram UI.

### Features

- POST `/convert` between USD, EUR, GBP (hardcoded rates)
- Node CLI: `node cli.js --amount 100 --from USD --to EUR`
- React converter page + `/er-diagram` (I1 deliverable)
- Docker support (`currency-converter/Dockerfile`)
- I6 bug-diagnosis branches (`eval/i6-*`)

### Hardcoded rates

| From | To | Rate |
|------|-----|------|
| USD | EUR | 0.92 |
| EUR | USD | 1.09 |
| USD | GBP | 0.79 |
| GBP | USD | 1.27 |
| EUR | GBP | 0.86 |
| GBP | EUR | 1.16 |

### Run locally

```bash
# Terminal 1 — API
cd currency-converter/service && source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

# Terminal 2 — React UI
cd currency-converter/frontend && npm install && npm run dev

# Terminal 3 — CLI (optional)
cd currency-converter/client
node cli.js --amount 100 --from USD --to EUR
```

### Test

```bash
cd currency-converter/service && pytest -v
cd currency-converter/client && npm run verify   # service must be running
```

More detail: [currency-converter/README.md](currency-converter/README.md)

---

## Project 3 — Fraud Score System

**Tier:** Advanced (A1–A6)  
**Stack:** FastAPI + Node.js worker + Rust scorer  
**Port:** API `8002`

Self-contained polyglot fraud-score pipeline: ingest → worker polls → Rust scorer.

### Features

- Contract v1.0 JSON payloads (`shared/contract.json`)
- Transaction lifecycle: `pending` → `processing` → `scored` | `failed`
- Node worker polls API and invokes Rust CLI via stdin
- `make test` and `make e2e` for full pipeline verification
- Static UI at `/ui/` when API is running

### Run order (three terminals)

```bash
# Terminal 1 — API
cd Fraud-score-system/api && source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8002

# Terminal 2 — Worker
cd Fraud-score-system/worker && node worker.js

# Terminal 3 — Ingest
curl -X POST http://127.0.0.1:8002/transactions \
  -H "Content-Type: application/json" \
  -d '{"contract_version":"1.0","transaction_id":"tx-1","user_id":1,"amount":1000,"type":"debit","merchant":"acme"}'
```

### Test

```bash
cd Fraud-score-system
make test      # api + worker + scorer unit tests
make e2e       # full pipeline integration
```

More detail: [Fraud-score-system/README.md](Fraud-score-system/README.md)

---

## Project 4 — Screen Scraper Ops

**Tier:** Advanced (A1–A6) — hybrid  
**Stack:** React dashboard + FastAPI gateway + Node worker + Rust scorer  
**Ports:** Gateway `8003`, React dev `5175`

React dashboard reads the **live Web Scraping API**; local polyglot add-on (scorer-gateway + worker + Rust) satisfies Advanced A3.

### Dashboard pages

| Route | Purpose |
|-------|---------|
| `/ops` | React Flow pipeline + live probes |
| `/apis` | OpenAPI catalog with Try-it |
| `/analytics` | Timings + A6 performance chart |
| `/eval/advanced` | A1–A6 hub with clickable markdown |

**Live API base:** `https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com`  
(VPN may be required for live probes; Railway proxies via `/scraper-api/`)

### A3 polyglot run order

```bash
# Terminal 1 — scorer-gateway
cd screen-scraper/scorer-gateway && source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8003

# Terminal 2 — worker
cd screen-scraper/worker && node worker.js

# Terminal 3 — React dashboard
cd screen-scraper/frontend && npm install && npm run dev
```

### Test

```bash
cd screen-scraper
make test      # gateway + worker + scorer unit tests
make e2e       # local polyglot pipeline
make bench     # A6 normalize_text benchmark
```

More detail: [screen-scraper/README.md](screen-scraper/README.md)

---

## Project structure

```text
Evaluation-complete-code/
├── examiner-hub/              # Tabbed Examiner Hub + hosted Docs
│   ├── index.html             # Hub UI (overview + project iframes)
│   ├── docs.html              # 3-tab documentation viewer
│   └── docs/content/          # Markdown for hosted docs
├── transaction-ledger/        # Basics — FastAPI + React
│   ├── app/                   # main.py, store.py, models.py
│   ├── frontend/              # React dashboard
│   ├── tests/                 # pytest
│   └── docs/eval/basics/      # B1–B3 evidence
├── currency-converter/        # Intermediate — polyglot
│   ├── service/               # FastAPI /convert
│   ├── client/                # Node CLI
│   ├── frontend/              # React + ER diagram
│   └── docs/eval/intermediate/  # I1–I6 evidence
├── Fraud-score-system/        # Advanced — local pipeline
│   ├── api/                   # FastAPI ingestion
│   ├── worker/                # Node poller
│   ├── scorer/                # Rust CLI
│   └── docs/eval/advanced/    # A1–A6 evidence
├── screen-scraper/            # Advanced — live API + local scorer
│   ├── scorer-gateway/        # FastAPI job queue (A3)
│   ├── worker/                # Node poller + live news fetch
│   ├── scorer/                # Rust CLI
│   ├── frontend/              # React ops dashboard
│   └── docs/eval/advanced/    # A1–A6 evidence
├── docker/                    # entrypoint.sh, nginx configs
├── Dockerfile                 # Unified image (Railway + local)
├── railway.toml               # Railway deploy config
├── run-all.sh                 # Start all services locally
├── stop-all.sh                # Stop all services
├── EVAL_AND_PROJECTS_GUIDE.md # Examiner task → evidence map
├── PROJECTS_DETAILED_GUIDE.txt
└── PROJECTS_OVERVIEW.md
```

---

## Testing

| Project | Command | Framework |
|---------|---------|-----------|
| Transaction Ledger | `cd transaction-ledger && pytest -v` | pytest |
| Currency Converter | `cd currency-converter/service && pytest -v` | pytest |
| Currency CLI | `cd currency-converter/client && npm run verify` | Node (service must run) |
| Fraud Score | `cd Fraud-score-system && make test && make e2e` | pytest + Node + Rust |
| Screen Scraper | `cd screen-scraper && make test && make e2e` | pytest + Node + Rust |

---

## Docker and Railway

### Local Docker (all projects in one container)

```bash
# Pre-build Rust scorers if Docker cannot reach crates.io:
cd Fraud-score-system/scorer && cargo build
cd screen-scraper/scorer && cargo build

docker build --build-arg RAILWAY=false -t eval-workspace .
docker run --rm \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 -p 8003:8003 \
  -p 5174:5174 -p 5175:5175 -p 5176:5176 \
  eval-workspace
```

Open http://127.0.0.1:5176

### Railway (single public port)

Railway sets `PORT` and builds with `RAILWAY=true`. The entrypoint starts all backends, workers, and nginx gateway.

- Health check: `GET /health`
- Config: [railway.toml](railway.toml)
- Swagger uses `--root-path` so `/ledger/docs`, `/scraper-gateway/docs`, etc. work behind the gateway

---

## Examiner Hub and hosted docs

The **Examiner Hub** (`examiner-hub/`) is the primary entry point:

- **Overview tab** — skill ladder, project cards, health status
- **Project tabs** — embedded iframes for each demo app
- **Docs link** — opens hosted documentation with three tabs:
  1. Eval Framework + Workspace Projects
  2. Complete Projects Guide (detailed)
  3. Projects Overview

Screenshots are captured under `examiner-hub/docs/assets/screenshots/`.

---

## Troubleshooting

### Permission denied on scripts

```bash
chmod +x run-all.sh stop-all.sh
```

### Port already in use

```bash
./stop-all.sh
# or manually:
lsof -ti :8000 | xargs kill -9
lsof -ti :5176 | xargs kill -9
./run-all.sh
```

### Service not responding after `./run-all.sh`

Check logs in `.run-logs/`:

```bash
ls .run-logs/
tail -f .run-logs/ledger-api.log
```

### Rust scorer not found

```bash
cd Fraud-score-system/scorer && cargo build
cd screen-scraper/scorer && cargo build
```

### Blank dashboard on Railway

Frontend must be built with `RAILWAY=true` (default in `Dockerfile`). Asset paths must use `/ledger/assets/`, not `/assets/`.

### Screen Scraper live probes fail

The live scraper API is internal. Use VPN locally, or rely on Railway's `/scraper-api/` proxy in production.

### Swagger 404 behind gateway

FastAPI services need `--root-path` when `PORT` is set — handled automatically in [docker/entrypoint.sh](docker/entrypoint.sh).

---

## Blocked tasks (tooling)

Some eval tasks need host tools not bundled in the repo:

| Task | Unblock by |
|------|------------|
| I5, Docker builds | Install Docker Desktop |
| A2 (worktrees) | `git init` or clone the repo |
| A6 (benchmarks) | Rust toolchain (`cargo build`) |
| Screen Scraper live ops | VPN to internal scraper API |

---

## Summary

| Question | Answer |
|----------|--------|
| What is this repo? | Multi-project agent eval workspace + four demo apps + Examiner Hub |
| How do I run everything locally? | `./run-all.sh` → open http://127.0.0.1:5176 |
| How do I run one project? | See project sections above or each folder's `README.md` |
| Where is eval evidence? | Each project's `docs/eval/` + [EVAL_AND_PROJECTS_GUIDE.md](EVAL_AND_PROJECTS_GUIDE.md) |
| Where is hosted documentation? | Examiner Hub → **Docs**, or `/docs.html` on Railway |
| Can the agent change code? | Yes — tasks I3, I6, A4, A5, A6 require modifications in the target project |
| Are projects connected? | **No** — four isolated folders; never share code or `.env` |
| Production URL? | https://evaluation-complete-code-production.up.railway.app/ |

---

## About

This workspace showcases AI agent capabilities at different hardness levels — from reading a simple FastAPI repo (Basics) through polyglot system building (Advanced). Each project is a self-contained evaluation target with runnable code, tests, and written proof.
