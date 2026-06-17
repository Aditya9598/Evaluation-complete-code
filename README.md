# Evaluation Complete Code

Monorepo containing all four eval projects and examiner documentation.

## Projects

| Project | Folder | Eval tier | Ports |
|---------|--------|-----------|-------|
| Transaction Ledger | `transaction-ledger/` | Basics (B1–B4) | 8000, 5173 |
| Currency Converter | `currency-converter/` | Intermediate (I1–I6) | 8001, 5173 |
| Fraud Score System | `Fraud-score-system/` | Advanced (A1–A6) | 8002 |
| Screen Scraper Ops | `screen-scraper/` | Advanced (A1–A6) | 5173, 8003 |

## Documentation

- **EVAL_AND_PROJECTS_GUIDE.md** — maps eval tasks to code and verification commands
- **PROJECTS_OVERVIEW.md** / **PROJECTS_OVERVIEW.txt** — quick reference
- **PROJECTS_DETAILED_GUIDE.txt** — technical deep dive

## Quick verify

```bash
cd transaction-ledger && pytest -v
cd currency-converter/service && pytest -v
cd Fraud-score-system && make test && make e2e
cd screen-scraper && make test && make e2e
```

## Individual repos

Each project is also available separately:

- https://github.com/Aditya9598/transaction-ledger
- https://github.com/Aditya9598/currency-converter
- https://github.com/Aditya9598/Fraud-score-system
- https://github.com/Aditya9598/screen-scraper
