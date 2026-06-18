# Eval Workspace — Deploy Guide

All four eval projects run from a single Docker image.

## Railway (recommended)

1. Push this repo to GitHub (`Evaluation-complete-code` or your fork).
2. In [Railway](https://railway.app): **New Project → Deploy from GitHub repo**.
3. Railway detects `railway.toml` and builds with `RAILWAY=true`.
4. After deploy, open the generated URL — the **Examiner Hub** is at `/`.

| Path | Project |
|------|---------|
| `/` | Examiner Hub |
| `/ledger/` | Transaction Ledger |
| `/converter/` | Currency Converter |
| `/fraud/ui/` | Fraud Score System |
| `/scraper/ops` | Screen Scraper Ops |

No manual port configuration needed — Railway sets `PORT` automatically.

## Local Docker

```bash
# With pre-built Rust scorers (faster if Docker cannot reach crates.io):
cd Fraud-score-system/scorer && cargo build
cd ../../screen-scraper/scorer && cargo build
cd ../..
docker build -t eval-workspace .

docker run --rm \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 -p 8003:8003 \
  -p 5174:5174 -p 5175:5175 -p 5176:5176 \
  eval-workspace
```

Open http://127.0.0.1:5176

## Local dev (no Docker)

```bash
./run-all.sh
```

Stop with `./stop-all.sh`
