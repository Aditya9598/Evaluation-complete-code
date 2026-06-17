# Screen Scraper Advanced Eval

Hybrid eval project: **React dashboard** reads the **live Web Scraping API**; a local **polyglot add-on** (scorer-gateway + Node worker + Rust scorer) satisfies Advanced A3.

## Structure

```
screen-scraper/
├── shared/contract.json, openapi.json
├── scorer-gateway/     # FastAPI job queue (port 8003) — A3 only
├── worker/             # Node poller + live news fetch
├── scorer/             # Rust CLI (stdin JSON)
├── frontend/           # React ops dashboard
├── scripts/e2e.sh
├── docs/eval/advanced/ # A1–A6 artifacts
└── Makefile
```

## Dashboard (live scraper API)

```bash
cd frontend
cp .env.example .env   # VITE_USE_PROXY=true on VPN
npm install
npm run dev            # http://127.0.0.1:5173
```

Pages: **Ops Pipeline**, **API Catalog**, **Analytics**, **Eval A1–A6**.

Default scraper base:
`https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com`

## A3 polyglot run order

**Terminal 1 — scorer-gateway:**
```bash
cd scorer-gateway && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8003
```

**Terminal 2 — worker:**
```bash
cd worker && node worker.js
```

**Terminal 3 — ingest from live scraper (optional):**
```bash
cd worker && node worker.js --ingest --once
cd worker && node worker.js --once
```

**Scorer manually:**
```bash
echo '{"contract_version":"1.0","job_id":"j1","title":"Nifty rally","body":"stock market fii","source":"economic_times"}' \
  | ./scorer/target/debug/scorer score
```

## Test

```bash
make test      # gateway + worker + scorer unit tests
make e2e       # local polyglot pipeline
make bench     # A6 normalize_text benchmark
```

## Eval docs

See [`docs/eval/advanced/`](docs/eval/advanced/).
