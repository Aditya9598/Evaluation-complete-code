# Currency Converter

Polyglot mini-system: FastAPI conversion service + Node.js CLI client.

**Note:** This is a separate project from `transaction-ledger`. Intermediate eval artifacts (I1–I6) are in [`docs/eval/intermediate/`](docs/eval/intermediate/).

## Structure

```
currency-converter/
├── service/          # FastAPI POST /convert
├── client/           # Node.js CLI
├── frontend/         # React I1 ER diagram UI
├── docs/eval/        # Intermediate eval artifacts (I1–I6)
├── Dockerfile
└── README.md
```

## Requirements

- Python 3.11+
- Node.js 18+

## Install

### Service

```bash
cd currency-converter/service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # first time only
```

### Client

```bash
cd currency-converter/client
# no npm install required — uses native fetch
```

## Run (three terminals)

**Terminal 1 — FastAPI service (port 8001):**

```bash
cd currency-converter/service
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

**Terminal 2 — React UI (port 5173):**

```bash
cd currency-converter/frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173** — convert currencies in the browser.

**Terminal 3 — Node CLI client (optional):**

```bash
cd currency-converter/client
node cli.js --amount 100 --from USD --to EUR
```

Expected CLI output:

```
100 USD = 92 EUR (rate: 0.92)
```

## Frontend routes

| Route | Page |
|-------|------|
| `/` | Currency converter — amount, from/to, live result |
| `/er-diagram` | I1 ER diagram (eval deliverable) |

Frontend env (`frontend/.env`): `VITE_API_URL=http://127.0.0.1:8001`

## Test

```bash
cd currency-converter/service
source .venv/bin/activate
pytest -v
```

**Client verification** (service must be running):

```bash
cd currency-converter/client
npm run verify
```

## Docker

```bash
cd currency-converter
docker build -t currency-converter .
docker run -p 8001:8001 currency-converter
curl http://127.0.0.1:8001/health
```

## Hardcoded rates

| From | To | Rate |
|------|-----|------|
| USD | EUR | 0.92 |
| EUR | USD | 1.09 |
| USD | GBP | 0.79 |
| GBP | USD | 1.27 |
| EUR | GBP | 0.86 |
| GBP | EUR | 1.16 |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/convert` | Convert amount between USD, EUR, GBP |
| GET | `/health` | Health check |
