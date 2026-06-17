# I6 — Bug Diagnosis with Agent

**Project:** `currency-converter`  
**Date:** 2026-06-16

---

## Seeded Bug

**Branch:** `eval/i6-seeded-bug`  
**File:** `service/app/converter.py` L27  
**Bug:** Division instead of multiplication when applying exchange rate.

```python
# Wrong
converted = round(amount / rate, 2)

# Correct
converted = round(amount * rate, 2)
```

---

## Reproduction Steps

```bash
git checkout eval/i6-seeded-bug
cd service && source .venv/bin/activate
pytest tests/test_convert.py::test_convert_usd_to_eur -v
```

**Result:**

```
FAILED tests/test_convert.py::test_convert_usd_to_eur - assert 108.7 == 92.0
```

Manual curl also shows wrong output:

```bash
curl -X POST http://127.0.0.1:8001/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"from":"USD","to":"EUR"}'
# Returns converted_amount: 108.7 instead of 92.0
```

---

## Root Cause

`convert_amount()` in `service/app/converter.py` divides by the rate instead of multiplying. For USD→EUR with rate `0.92`, `100 / 0.92 = 108.7` instead of `100 * 0.92 = 92`.

---

## Minimal Fix

**Branch:** `eval/i6-fix`  
**Change:** One character `/` → `*` on L27 of `service/app/converter.py`.

---

## Verification

```bash
git checkout eval/i6-fix
cd service && source .venv/bin/activate
pytest -v
```

```
4 passed in 0.31s
```

---

## Agent Suggested vs Manually Verified

| Item | Agent | Verified |
|------|-------|----------|
| Bug in `convert_amount` rate application | Suggested division error | pytest failure on bug branch |
| Fix: use `*` not `/` | Suggested | 4/4 tests pass on fix branch |
| Expected converted_amount 92 for 100 USD→EUR | Suggested | curl + test assert |
