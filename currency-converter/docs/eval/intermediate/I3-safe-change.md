# I3 — Small Safe Change

**Project:** `currency-converter`  
**Change:** Reject conversions when `from` and `to` currencies are identical.  
**Date:** 2026-06-16

---

## Files Changed

| File | Why |
|------|-----|
| `service/app/converter.py` | Validation belongs with rate lookup logic |
| `service/tests/test_convert.py` | Asserts HTTP 400 for same-currency request |

---

## Diff Summary

```python
# service/app/converter.py
if from_currency == to_currency:
    raise HTTPException(status_code=400, detail="from and to currencies must differ")
```

Test: `test_rejects_same_currency`

---

## Test Command and Result

```bash
cd currency-converter/service
source .venv/bin/activate
pytest -v
```

```
4 passed in 0.62s
```

---

## Risk Assessment

| Risk | Level | Notes |
|------|-------|-------|
| Breaking valid use cases | Low | Same-currency conversion is meaningless |
| API contract change | Low | Previously may have returned 1:1 via RATES identity entries — now explicit 400 |

**Overall:** Low risk.

---

## Agent Suggested vs Manually Verified

| Item | Agent | Verified |
|------|-------|----------|
| 400 on USD→USD | Suggested | `test_rejects_same_currency` passes |
| Other conversions unchanged | Suggested | `test_convert_usd_to_eur` passes |
