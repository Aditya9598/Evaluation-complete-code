// Override deployment target with ?mode=docker, ?mode=local, or ?mode=railway on the hub URL.
window.EVAL_HUB_META = {
  ledger: {
    id: "ledger",
    label: "Transaction Ledger",
    tier: "Basics",
    tierClass: "basics",
    icon: "₹",
    summary: "In-memory ledger API with a React account dashboard",
    description:
      "Practice FastAPI fundamentals with users, credit/debit transactions, and balance tracking. The React UI covers dashboard, users, and transaction flows. Eval tasks B1–B4 focus on repo reading and greenfield API work.",
    stack: ["Python", "FastAPI", "React", "Vite"],
    evalTasks: ["B1", "B2", "B3", "B4"],
    folder: "transaction-ledger/",
    highlights: [
      "REST API under /api with seeded users",
      "Dashboard with balances and transaction history",
      "Greenfield B4 deliverable: POST/GET transactions + tests",
    ],
  },
  converter: {
    id: "converter",
    label: "Currency Converter",
    tier: "Intermediate",
    tierClass: "intermediate",
    icon: "💱",
    summary: "FX conversion service, Node CLI, and ER diagram UI",
    description:
      "Polyglot intermediate project: FastAPI handles USD/EUR/GBP conversion, a Node CLI calls the API, and the React frontend includes an interactive ER diagram. Eval tasks I1–I6 cover diagrams, flow traces, Docker, and bug diagnosis.",
    stack: ["Python", "FastAPI", "Node.js", "React"],
    evalTasks: ["I1", "I2", "I3", "I4", "I5", "I6"],
    folder: "currency-converter/",
    highlights: [
      "Live /convert endpoint with hardcoded FX rates",
      "Mermaid ER diagram page at /er-diagram",
      "Node CLI client for end-to-end conversion",
    ],
  },
  fraud: {
    id: "fraud",
    label: "Fraud Score System",
    tier: "Advanced",
    tierClass: "advanced",
    icon: "🛡",
    summary: "Local polyglot fraud-scoring pipeline (API → worker → Rust)",
    description:
      "Fully self-contained advanced pipeline: FastAPI ingests events, a Node worker polls and forwards to a Rust scorer, and results flow back through the contract. Eval tasks A1–A6 cover worktrees, multi-language integration, code review, and performance tuning.",
    stack: ["Python", "FastAPI", "Node.js", "Rust"],
    evalTasks: ["A1", "A2", "A3", "A4", "A5", "A6"],
    folder: "Fraud-score-system/",
    highlights: [
      "FastAPI + Node worker + Rust scorer contract v1.0",
      "Pipeline dashboard at /ui/ for job status",
      "All-local — no external API dependencies",
    ],
  },
  scraper: {
    id: "scraper",
    label: "Screen Scraper Ops",
    tier: "Advanced",
    tierClass: "advanced",
    icon: "🔍",
    summary: "Live scraper ops dashboard plus local A3 scorer gateway",
    description:
      "Hybrid advanced project: the React dashboard reads a live Web Scraping API for ops pipeline, API catalog, and analytics. A local scorer-gateway (port 8003) + worker + Rust scorer handles article relevance scoring. VPN may be required for live API probes.",
    stack: ["React", "Python", "Node.js", "Rust", "React Flow"],
    evalTasks: ["A1", "A2", "A3", "A4", "A5", "A6"],
    folder: "screen-scraper/",
    highlights: [
      "Ops pipeline with React Flow status visualization",
      "OpenAPI catalog with Try-it probes",
      "Eval evidence hub at /eval/advanced",
    ],
  },
};

window.EVAL_HUB_CONFIG = {
  local: {
    mode: "local",
    projects: {
      ledger: {
        iframe: "http://127.0.0.1:5173/",
        links: [
          { label: "Dashboard", href: "http://127.0.0.1:5173/" },
          { label: "Users", href: "http://127.0.0.1:5173/users" },
          { label: "Transactions", href: "http://127.0.0.1:5173/transactions" },
          { label: "API docs", href: "http://127.0.0.1:8000/docs" },
        ],
        checks: [
          { label: "API", url: "http://127.0.0.1:8000/api/health" },
          { label: "UI", url: "http://127.0.0.1:5173/" },
        ],
      },
      converter: {
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
        iframe: "http://127.0.0.1:5175/ops",
        links: [
          { label: "Ops dashboard", href: "http://127.0.0.1:5175/ops" },
          { label: "API catalog", href: "http://127.0.0.1:5175/apis" },
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
