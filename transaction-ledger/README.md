# Transaction Ledger

A FastAPI service that tracks in-memory credit/debit transactions and exposes balance, plus a **React dashboard** for the UI.

## Requirements

- Python 3.11+
- Node.js 18+ (for frontend)

## Install (API)

```bash
cd transaction-ledger
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # first time only — edit credentials in .env
```

## Install (Frontend)

```bash
cd frontend
npm install
cp .env.example .env   # optional — defaults to http://127.0.0.1:8000
```

## Environment variables

Credentials and config live in [`.env`](.env). Use [`.env.example`](.env.example) as the template.

| Variable | Description |
|----------|-------------|
| `APP_HOST` | Server host |
| `APP_PORT` | Server port |
| `ENVIRONMENT` | `development` / `production` |
| `DEBUG` | Enable debug mode |
| `SECRET_KEY` | App secret (change in production) |
| `API_KEY` | API key for future auth |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DATABASE_URL` | Full PostgreSQL connection string |

Loaded by [`app/config.py`](app/config.py). **Never commit `.env`** — it is listed in `.gitignore`.

## Run

**Terminal 1 — API:**

```bash
cd transaction-ledger
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — React dashboard:**

```bash
cd transaction-ledger/frontend
npm run dev
```

- API docs: http://127.0.0.1:8000/docs
- Dashboard: http://127.0.0.1:5173

## Frontend routes

| Route | Page |
|-------|------|
| `/` | Dashboard — stats, balances, API health |
| `/users` | Users table with balances |
| `/transactions` | Transaction list with account filter |
| `/transactions/new` | Create credit/debit transaction |

Frontend env (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | FastAPI base URL (default `http://127.0.0.1:8000/api`) |

## Eval docs (Basics)

- [B1 — Artifact inventory](docs/eval/basics/B1-artifact-inventory.md)
- [B2 — API endpoint map](docs/eval/basics/B2-api-endpoint-map.md)
- [B3 — Test discovery](docs/eval/basics/B3-test-discovery.md)

## Test

```bash
pytest -v
```

## Docker

Builds the React dashboard and FastAPI API in one image. The UI and API are served from port **8000** (API under `/api`).

```bash
docker build -t transaction-ledger .
docker run -p 8000:8000 transaction-ledger
```

Open:
- **Dashboard:** http://127.0.0.1:8000
- **API docs:** http://127.0.0.1:8000/docs
- **Health:** http://127.0.0.1:8000/api/health

Pass env vars from `.env` without baking secrets into the image:

```bash
docker run -p 8000:8000 --env-file .env transaction-ledger
```

For local dev (two terminals), the API still runs on port 8000 and the React dev server on 5173 — see **Run** above.

## Endpoints

All API routes are prefixed with `/api`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all dummy users |
| GET | `/api/users/{id}` | Get one user by id |
| POST | `/api/transactions` | Create a credit or debit transaction for an account |
| GET | `/api/transactions` | List transactions (optional `id` filter) |
| GET | `/api/balance` | Balance for an account (`id` required) |
| GET | `/api/health` | Health check |

## Dummy users (in-memory map)

Seeded on startup — ids **1**, **2**, **3**:

| id | name | email |
|----|------|-------|
| 1 | Alice Johnson | alice@example.com |
| 2 | Bob Smith | bob@example.com |
| 3 | Carol Lee | carol@example.com |

Transactions and balance require a valid user `id`. Data is stored in memory (Python `dict` for users, `list` for transactions) — resets when the server restarts.

### Example

```bash
# List users
curl http://127.0.0.1:8000/api/users

# Create transactions for account 1
curl -X POST http://127.0.0.1:8000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "amount": 100, "type": "credit", "description": "Deposit"}'

curl -X POST http://127.0.0.1:8000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "amount": 30, "type": "debit", "description": "Purchase"}'

# List transactions for account 1
curl "http://127.0.0.1:8000/api/transactions?id=1"

# Get balance for account 1
curl "http://127.0.0.1:8000/api/balance?id=1"
```
