// Override with ?mode=docker or ?mode=local on the hub URL.
window.EVAL_HUB_CONFIG = {
  local: {
    mode: "local",
    projects: {
      ledger: {
        label: "Transaction Ledger",
        iframe: "http://127.0.0.1:5173/",
        links: [
          { label: "Dashboard", href: "http://127.0.0.1:5173/" },
          { label: "API docs", href: "http://127.0.0.1:8000/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8000/api/health" },
          { label: "UI", url: "http://127.0.0.1:5173/" },
        ],
      },
      converter: {
        label: "Currency Converter",
        iframe: "http://127.0.0.1:5174/",
        links: [
          { label: "Converter", href: "http://127.0.0.1:5174/" },
          { label: "ER diagram", href: "http://127.0.0.1:5174/er-diagram" },
          { label: "API docs", href: "http://127.0.0.1:8001/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8001/health" },
          { label: "UI", url: "http://127.0.0.1:5174/" },
        ],
      },
      fraud: {
        label: "Fraud Score System",
        iframe: "http://127.0.0.1:8002/ui/",
        links: [
          { label: "Pipeline dashboard", href: "http://127.0.0.1:8002/ui/" },
          { label: "API docs", href: "http://127.0.0.1:8002/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8002/health" },
          { label: "UI", url: "http://127.0.0.1:8002/ui/" },
        ],
      },
      scraper: {
        label: "Screen Scraper Ops",
        iframe: "http://127.0.0.1:5175/ops",
        links: [
          { label: "Ops dashboard", href: "http://127.0.0.1:5175/ops" },
          { label: "Eval hub", href: "http://127.0.0.1:5175/eval/advanced" },
          { label: "Gateway docs", href: "http://127.0.0.1:8003/docs" },
        ],
        checks: [
          { label: "Gateway", url: "http://127.0.0.1:8003/health" },
          { label: "UI", url: "http://127.0.0.1:5175/" },
        ],
      },
    },
  },
  docker: {
    mode: "docker",
    projects: {
      ledger: {
        label: "Transaction Ledger",
        iframe: "http://127.0.0.1:8000/",
        links: [
          { label: "Dashboard", href: "http://127.0.0.1:8000/" },
          { label: "API docs", href: "http://127.0.0.1:8000/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8000/api/health" },
          { label: "UI", url: "http://127.0.0.1:8000/" },
        ],
      },
      converter: {
        label: "Currency Converter",
        iframe: "http://127.0.0.1:5174/",
        links: [
          { label: "Converter", href: "http://127.0.0.1:5174/" },
          { label: "ER diagram", href: "http://127.0.0.1:5174/er-diagram" },
          { label: "API docs", href: "http://127.0.0.1:8001/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8001/health" },
          { label: "UI", url: "http://127.0.0.1:5174/" },
        ],
      },
      fraud: {
        label: "Fraud Score System",
        iframe: "http://127.0.0.1:8002/ui/",
        links: [
          { label: "Pipeline dashboard", href: "http://127.0.0.1:8002/ui/" },
          { label: "API docs", href: "http://127.0.0.1:8002/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8002/health" },
          { label: "UI", url: "http://127.0.0.1:8002/ui/" },
        ],
      },
      scraper: {
        label: "Screen Scraper Ops",
        iframe: "http://127.0.0.1:5175/ops",
        links: [
          { label: "Ops dashboard", href: "http://127.0.0.1:5175/ops" },
          { label: "Eval hub", href: "http://127.0.0.1:5175/eval/advanced" },
          { label: "Gateway docs", href: "http://127.0.0.1:8003/docs" },
        ],
        checks: [
          { label: "Gateway", url: "http://127.0.0.1:8003/health" },
          { label: "UI", url: "http://127.0.0.1:5175/" },
        ],
      },
    },
  },
  railway: {
    mode: "railway",
    projects: {
      ledger: {
        label: "Transaction Ledger",
        iframe: "/ledger/",
        links: [
          { label: "Dashboard", href: "/ledger/" },
          { label: "API docs", href: "/ledger/docs" },
        ],
        checks: [
          { label: "API", url: "/ledger/api/health" },
          { label: "UI", url: "/ledger/" },
        ],
      },
      converter: {
        label: "Currency Converter",
        iframe: "/converter/",
        links: [
          { label: "Converter", href: "/converter/" },
          { label: "ER diagram", href: "/converter/er-diagram" },
          { label: "API docs", href: "/converter-api/docs" },
        ],
        checks: [
          { label: "API", url: "/converter-api/health" },
          { label: "UI", url: "/converter/" },
        ],
      },
      fraud: {
        label: "Fraud Score System",
        iframe: "/fraud/ui/",
        links: [
          { label: "Pipeline dashboard", href: "/fraud/ui/" },
          { label: "API docs", href: "/fraud/docs" },
        ],
        checks: [
          { label: "API", url: "/fraud/health" },
          { label: "UI", url: "/fraud/ui/" },
        ],
      },
      scraper: {
        label: "Screen Scraper Ops",
        iframe: "/scraper/ops",
        links: [
          { label: "Ops dashboard", href: "/scraper/ops" },
          { label: "Eval hub", href: "/scraper/eval/advanced" },
          { label: "Gateway docs", href: "/scraper-gateway/docs" },
        ],
        checks: [
          { label: "Gateway", url: "/scraper-gateway/health" },
          { label: "UI", url: "/scraper/" },
        ],
      },
    },
  },
};
