# B1 — Repo Artifact Inventory

**Project:** transaction-ledger  
**Eval tier:** Basics  
**Time budget:** 30 minutes  
**Status:** Complete (agent-suggested, manually verified)

---

## Summary

This repo is a small FastAPI service with an in-memory ledger. There are no separate repository, job, or consumer layers — persistence is handled by Python classes in `app/store.py`.

---

## Models (Pydantic DTOs)

**File:** `app/models.py`

| Name | Type | Purpose |
|------|------|---------|
| `TransactionType` | Enum | Values: `credit`, `debit` |
| `TransactionCreate` | Request model | POST body for new transactions |
| `Transaction` | Response model | Stored transaction with id, account_id, timestamps |
| `BalanceResponse` | Response model | Account balance + transaction count |
| `User` | Response model | Seeded account holder (id, name, email) |

---

## Services / Stores

**File:** `app/store.py`

| Class | Role | Storage |
|-------|------|---------|
| `UserStore` | User lookup, seed data, validation | `dict[int, User]` |
| `TransactionStore` | Add/list transactions, balance calculation, overdraft guard | `list[Transaction]` |

**Singleton instances:** `user_store`, `store` (module-level)

---

## Controllers / Routes

**File:** `app/main.py`

| Handler | HTTP | Path |
|---------|------|------|
| `list_users` | GET | `/users` |
| `get_user` | GET | `/users/{id}` |
| `create_transaction` | POST | `/transactions` |
| `list_transactions` | GET | `/transactions` |
| `get_balance` | GET | `/balance` |
| `health` | GET | `/health` |

---

## Config

| File | Artifact | Purpose |
|------|----------|---------|
| `app/config.py` | `Settings` (Pydantic BaseSettings) | Loads `.env` — host, port, DB creds |
| `.env` | Environment file | Runtime secrets (gitignored) |
| `.env.example` | Template | Safe copy for setup |

---

## Repositories

**None.** PostgreSQL credentials exist in `.env` but are not wired. All data is in-memory.

---

## Jobs / Consumers / Background Workers

**None.**

---

## Utilities

**None** as separate modules. Validation logic lives in:
- Pydantic field validators (`TransactionCreate.amount`)
- Store business rules (`TransactionStore.add` overdraft check)

---

## Frontend (React)

**Directory:** `frontend/`

| Area | Files | Purpose |
|------|-------|---------|
| Entry | `src/main.tsx`, `src/App.tsx` | React bootstrap + router |
| API client | `src/api/client.ts` | Typed fetch wrappers |
| Types | `src/types.ts` | Mirror backend models |
| Pages | `src/pages/*.tsx` | Dashboard, Users, Transactions, NewTransaction |
| Components | `src/components/*.tsx` | NavBar, BalanceCard, tables, form |

---

## Tests

| File | Framework | Count |
|------|-----------|-------|
| `tests/test_api.py` | pytest + FastAPI TestClient | 8 tests |

---

## Infrastructure

| File | Purpose |
|------|---------|
| `Dockerfile` | Container build for API |
| `requirements.txt` | Python dependencies |
| `frontend/package.json` | Node dependencies for React UI |

---

## Artifact map (visual)

```
transaction-ledger/
├── app/
│   ├── main.py       → routes (controller)
│   ├── models.py     → DTOs
│   ├── store.py      → service layer (in-memory)
│   └── config.py     → settings
├── tests/
│   └── test_api.py   → API tests
├── frontend/         → React dashboard (consumer of API)
└── docs/eval/basics/ → B1, B2, B3 deliverables
```
