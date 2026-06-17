# I3 — Small Safe Change in Unfamiliar Repo

**Change:** Reject debits that would drive account balance below zero.  
**Date:** 2026-06-16

---

## Files Changed

| File | Why |
|------|-----|
| `app/store.py` | Business rule belongs in `TransactionStore.add()` alongside existing balance logic |
| `tests/test_api.py` | Covers new HTTP 400 path and confirms balance unchanged after rejected debit |

---

## Diff Summary

**`app/store.py`** — before creating a debit transaction, check current balance:

```python
if payload.type == TransactionType.DEBIT:
    current_balance, _ = self.balance(payload.id)
    if current_balance - payload.amount < 0:
        raise HTTPException(status_code=400, detail="Insufficient balance for debit")
```

**`tests/test_api.py`** — added `test_rejects_debit_exceeding_balance`.

---

## Test Command and Result

```bash
cd transaction-ledger
source .venv/bin/activate
pytest -v
```

```
8 passed in 0.30s
```

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Breaking existing debit flows | Low | Only blocks overdraft; valid debits unchanged |
| Performance (double balance scan) | Low | In-memory list; acceptable for demo scale |
| Race conditions under concurrency | Medium | Not addressed; same as rest of in-memory store |

**Overall:** Low risk, additive validation only.

---

## Agent Suggested vs Manually Verified

| Item | Agent | Verified |
|------|-------|----------|
| Guard in `store.add()` | Suggested | `pytest -v` — 8/8 pass |
| HTTP 400 + message | Suggested | `test_rejects_debit_exceeding_balance` |
| Balance unchanged after reject | Suggested | Asserted in same test |
| Edge: exact balance debit | Not tested | Future: debit exactly equal to balance should succeed |
