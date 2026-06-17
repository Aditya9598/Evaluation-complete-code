# A5 — Agent Code Review

**Branch:** `review/agent-pr-seeded` (file removed from `main`)  
**File:** `scorer-gateway/app/review_seeded.py` on that branch only

## Issue list

| # | Issue | Severity | Blocking | Fix |
|---|-------|----------|----------|-----|
| 1 | Hardcoded `SMTP_PASSWORD` and fallback API key in source | Security | Yes | Use env-only secrets; never log |
| 2 | `subprocess.run(..., shell=True)` with interpolated URL | Security | Yes | Use `httpx` or `subprocess` argv list, no shell |
| 3 | SQL built with f-string `user_id` | Security | Yes | Parameterized queries |
| 4 | Logs secrets via `logger.info(API_KEY, SMTP_PASSWORD)` | Security | Yes | Remove secret logging |
| 5 | `score_article_no_cache` repeats normalization 100× | Performance | No | Use `lru_cache` / shared `normalize_text` |
| 6 | No unit tests for review module | Testing | Yes | Add tests or delete seeded file |

## Verification

```bash
# Static review — file should not be imported in production main.py
grep -r review_seeded scorer-gateway/app/main.py || echo "OK: not wired to main"
bandit scorer-gateway/app/review_seeded.py  # optional
```
