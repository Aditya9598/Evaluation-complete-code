# I5 — Dockerize and Run

**Project:** `currency-converter`  
**Date:** 2026-06-16

---

## Files Added

| File | Purpose |
|------|---------|
| `Dockerfile` | Python 3.12 slim, uvicorn on port 8001 |
| `.dockerignore` | Excludes `.venv`, `.env`, docs |

---

## Build

```bash
cd currency-converter
docker build -t currency-converter .
```

**Result:** Build succeeded (exit 0). Image tagged `currency-converter`.

---

## Run

```bash
docker run -p 8001:8001 currency-converter
```

---

## Health Check Proof

```bash
curl http://127.0.0.1:8001/health
```

```json
{"status":"ok","environment":"development"}
```

---

## Convert Proof

```bash
curl -X POST http://127.0.0.1:8001/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"from":"USD","to":"EUR"}'
```

```json
{"amount":100.0,"from":"USD","to":"EUR","converted_amount":92.0,"rate":0.92}
```

---

## Client Verification (container running)

```bash
cd client && npm run verify
```

```
Verification passed: { amount: 100, from: 'USD', to: 'EUR', converted_amount: 92, rate: 0.92 }
```

See [README.md](../../../README.md) for full docker and run instructions.
