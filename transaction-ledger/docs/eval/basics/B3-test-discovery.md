# B3 — Test Discovery and Execution

**Project:** transaction-ledger  
**Eval tier:** Basics  
**Time budget:** 15 minutes  
**Status:** Complete (agent-suggested, manually verified)

---

## Test framework

| Item | Value |
|------|-------|
| Framework | **pytest** |
| HTTP client | FastAPI `TestClient` (Starlette) |
| Config file | None — pytest defaults |
| Dependencies | `requirements.txt` → `pytest>=8.0.0`, `httpx>=0.27.0` |

---

## Relevant test files

| File | Tests | What it covers |
|------|-------|----------------|
| `tests/test_api.py` | 8 | Full API contract: create/list transactions, balance, users, validation, overdraft guard |

### Test list

1. `test_create_and_list_transactions` — POST + GET with account filter
2. `test_balance_reflects_credits_and_debits` — balance math
3. `test_balance_is_scoped_per_account` — per-account isolation
4. `test_rejects_unknown_user` — 404 for invalid account id
5. `test_list_users` — seeded users returned
6. `test_rejects_debit_exceeding_balance` — 400 overdraft guard
7. `test_rejects_invalid_transaction` — 422 validation errors
8. `test_empty_balance` — zero balance for account with no transactions

### Fixture

`clear_store` (autouse) — resets in-memory stores before/after each test.

---

## Exact commands

```bash
cd transaction-ledger
source .venv/bin/activate
pytest -v
```

Alternative (single file):

```bash
pytest tests/test_api.py -v
```

---

## Actual command result

```
============================= test session starts ==============================
platform darwin -- Python 3.14.2, pytest-9.1.0, pluggy-1.6.0
rootdir: /Users/adityagupta/Desktop/untitled folder/transaction-ledger
collected 8 items

tests/test_api.py::test_create_and_list_transactions PASSED              [ 12%]
tests/test_api.py::test_balance_reflects_credits_and_debits PASSED       [ 25%]
tests/test_api.py::test_balance_is_scoped_per_account PASSED             [ 37%]
tests/test_api.py::test_rejects_unknown_user PASSED                      [ 50%]
tests/test_api.py::test_list_users PASSED                                [ 62%]
tests/test_api.py::test_rejects_debit_exceeding_balance PASSED           [ 75%]
tests/test_api.py::test_rejects_invalid_transaction PASSED               [ 87%]
tests/test_api.py::test_empty_balance PASSED                             [100%]

========================= 8 passed, 1 warning in 0.34s =========================
```

---

## Warnings

```
StarletteDeprecationWarning: Using `httpx` with `starlette.testclient` is deprecated;
install `httpx2` instead.
```

**Interpretation:** Non-blocking deprecation notice from Starlette/FastAPI. Tests pass. Can be addressed later by pinning or switching test client dependency — not a functional failure.

---

## Failures

**None.** All 8 tests passed.

---

## Interpretation

- API contract is stable: CRUD-like transaction flow, balance calculation, and validation rules work as designed.
- Overdraft guard (B3/I3 safe change) is covered by `test_rejects_debit_exceeding_balance`.
- No frontend tests yet — dashboard is verified manually via browser.
- Recommended manual check after frontend work: create credit/debit from UI and confirm balance updates.
