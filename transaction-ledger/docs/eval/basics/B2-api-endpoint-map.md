# B2 — API Endpoint Map

**Project:** transaction-ledger  
**Eval tier:** Basics  
**Time budget:** 30 minutes  
**Status:** Complete (agent-suggested, manually verified)

---

## Backend API (FastAPI — port 8000)

Base URL: `http://127.0.0.1:8000`

| Method | Path | Query / Body | Response | Status codes |
|--------|------|--------------|----------|--------------|
| GET | `/users` | — | `[User]` | 200 |
| GET | `/users/{id}` | path: `id` (int) | `User` | 200, 404 |
| POST | `/transactions` | body: `{ id, amount, type, description? }` | `Transaction` | 201, 400, 404, 422 |
| GET | `/transactions` | query: `id?` (account filter) | `[Transaction]` | 200, 404 |
| GET | `/balance` | query: `id` (required) | `{ id, balance, transaction_count }` | 200, 404, 422 |
| GET | `/health` | — | `{ status, environment }` | 200 |

### Auto-generated (FastAPI)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/docs` | Swagger UI |
| GET | `/redoc` | ReDoc UI |
| GET | `/openapi.json` | OpenAPI schema |

### Request body example — POST `/transactions`

```json
{
  "id": 1,
  "amount": 100.0,
  "type": "credit",
  "description": "Deposit"
}
```

Note: `id` in the request body is the **account/user id**, not the transaction id.

### Error responses

| Code | When |
|------|------|
| 400 | Debit exceeds available balance |
| 404 | Unknown user id |
| 422 | Invalid amount, type, or missing required fields |

---

## Frontend Routes (React — port 5173)

Base URL: `http://127.0.0.1:5173`

| Route | Page | Backend calls |
|-------|------|---------------|
| `/` | Dashboard | `GET /health`, `GET /users`, `GET /balance?id=` (per user) |
| `/users` | Users & Balances | `GET /users`, `GET /balance?id=` |
| `/transactions` | Transaction list | `GET /transactions`, `GET /transactions?id=` (filter) |
| `/transactions/new` | Create transaction | `GET /users`, `POST /transactions` |

---

## Data flow

```
Browser (React :5173)
    │
    ├─ GET  /users              → list accounts
    ├─ GET  /balance?id=1       → account balance
    ├─ GET  /transactions       → all transactions
    ├─ GET  /transactions?id=1  → filtered transactions
    └─ POST /transactions       → create credit/debit
         │
         ▼
FastAPI (:8000) → UserStore + TransactionStore (in-memory)
```

---

## CORS

The API allows requests from:
- `http://127.0.0.1:5173`
- `http://localhost:5173`

Configured in `app/main.py` via `CORSMiddleware`.
