# I4 — Polyglot Service Pair: FastAPI + Node CLI

**Project:** `currency-converter`  
**Date:** 2026-06-16

---

## Components

| Component | Path | Role |
|-----------|------|------|
| FastAPI service | `service/app/main.py` | `POST /convert`, `GET /health` |
| Node CLI | `client/cli.js` | Calls service via HTTP |
| Client verify | `client/verify.js` | Scripted end-to-end check |

---

## FastAPI `/convert`

- Input validation via `ConvertRequest` (`service/app/models.py`)
- Hardcoded rates in `service/app/converter.py`
- Tests: `service/tests/test_convert.py` (4 tests)

---

## Node CLI

```bash
node cli.js --amount 100 --from USD --to EUR
```

Output: `100 USD = 92 EUR (rate: 0.92)`

---

## Two-Terminal Run

See [README.md](../../../README.md):

**Terminal 1:** `uvicorn app.main:app --reload --port 8001`  
**Terminal 2:** `node cli.js --amount 100 --from USD --to EUR`

---

## Verification

```bash
# Service tests
cd service && pytest -v

# Client (service running)
cd client && npm run verify
```

Both verified green during implementation.
