export interface EvalTask {
  id: string;
  title: string;
  timeBudget: string;
  what: string;
  how: string;
  steps: string[];
  verification: string[];
  artifactFile: string;
  repoPath: string;
  relatedLinks?: { label: string; href: string; external?: boolean }[];
}

const DOC_BASE = "/eval/advanced";

export const EVAL_TASKS: EvalTask[] = [
  {
    id: "A1",
    title: "Multi-worktree parallel plan",
    timeBudget: "45 min",
    what:
      "Split Opening Bell dashboard work into parallel lanes so pipeline timings, audio metrics, and email status can be built without merge conflicts.",
    how:
      "Each lane owns disjoint files under frontend/src/data/. Worktrees live at ../ss-pipeline and ../ss-audio. Merge order is pipeline → audio → integration → main. Live scraper API stays read-only via the dashboard proxy.",
    steps: [
      "Lane pipeline: add frontend/src/data/pipelineTimings.ts and wire Analytics pipeline chart.",
      "Lane audio: add frontend/src/data/audioMetrics.ts and wire audio duration chart.",
      "Freeze shared/openapi.json during parallel lanes.",
      "Merge on integration/opening-bell, then run make test and npm run build.",
    ],
    verification: ["cd frontend && npm run build", "make test"],
    artifactFile: `${DOC_BASE}/A1-parallel-plan.md`,
    repoPath: "docs/eval/advanced/A1-parallel-plan.md",
    relatedLinks: [
      { label: "Analytics page", href: "/analytics" },
      { label: "Ops pipeline", href: "/ops" },
    ],
  },
  {
    id: "A2",
    title: "Execute two parallel worktrees",
    timeBudget: "90 min",
    what:
      "Actually create git worktrees, make lane-specific commits, merge cleanly, and capture test evidence.",
    how:
      "git worktree add creates isolated directories on lane/opening-bell-pipeline and lane/opening-bell-audio. Each worktree holds the same disjoint data modules as A1. After merge, gateway, Rust, worker, e2e, and frontend build must pass.",
    steps: [
      "git worktree add ../ss-pipeline -b lane/opening-bell-pipeline",
      "git worktree add ../ss-audio -b lane/opening-bell-audio",
      "git checkout -b integration/opening-bell && merge both lanes",
      "git checkout main && merge integration/opening-bell",
      "Run make test, make e2e, frontend build — capture output in A2 doc.",
    ],
    verification: ["git worktree list", "make test", "make e2e", "cd frontend && npm run build"],
    artifactFile: `${DOC_BASE}/A2-worktrees.md`,
    repoPath: "docs/eval/advanced/A2-worktrees.md",
    relatedLinks: [{ label: "Eval hub", href: "/eval/advanced" }],
  },
  {
    id: "A3",
    title: "Polyglot mini-system",
    timeBudget: "150 min",
    what:
      "FastAPI scorer-gateway ingests article jobs, Node worker polls and spawns Rust scorer via stdio, enriched scores return to the gateway. Optional path pulls live articles from POST /api/v1/news/search.",
    how:
      "shared/contract.json defines contract_version 1.0. Worker pipes JSON to scorer score (never shell-exec). Gateway on port 8003 manages pending → processing → scored | failed lifecycle.",
    steps: [
      "Start scorer-gateway: uvicorn on 127.0.0.1:8003",
      "POST /jobs with article JSON or worker --ingest from live scraper",
      "Worker claims job, runs Rust scorer, POST /jobs/{id}/score",
      "Verify with make e2e",
    ],
    verification: ["make test", "make e2e"],
    artifactFile: `${DOC_BASE}/A3-polyglot.md`,
    repoPath: "docs/eval/advanced/A3-polyglot.md",
    relatedLinks: [
      { label: "Gateway health", href: "http://127.0.0.1:8003/health", external: true },
      { label: "Eval README", href: `${DOC_BASE}/README.md` },
    ],
  },
  {
    id: "A4",
    title: "Repository modernization",
    timeBudget: "90 min",
    what:
      "Analyze repo gaps (CI, deps, smoke tests), prioritize by impact/risk, implement one low-risk high-value first step.",
    how:
      "Pinned scorer-gateway/requirements.txt for reproducible installs. Added .github/workflows/test.yml running pytest, cargo test, worker tests, and frontend build. Live scraper smoke test marked pytest -m live.",
    steps: [
      "Document findings with file evidence in A4-modernization.md",
      "Implement pinned deps + CI workflow",
      "Verify: pytest -m 'not live', make test, npm run build",
      "Note rollback: git revert <sha>",
    ],
    verification: [
      "cd scorer-gateway && pytest -v -m 'not live'",
      "make test",
      "cd frontend && npm run build",
    ],
    artifactFile: `${DOC_BASE}/A4-modernization.md`,
    repoPath: "docs/eval/advanced/A4-modernization.md",
    relatedLinks: [],
  },
  {
    id: "A5",
    title: "Agent code review",
    timeBudget: "60 min",
    what:
      "Review agent-generated code on review/agent-pr-seeded for security, correctness, performance, and test gaps.",
    how:
      "Seeded file scorer-gateway/app/review_seeded.py contains intentional issues: hardcoded secrets, shell=True subprocess, SQL f-strings, secret logging, uncached hot loop. Document blocking vs non-blocking fixes in A5-code-review.md.",
    steps: [
      "git checkout review/agent-pr-seeded",
      "Read scorer-gateway/app/review_seeded.py",
      "Fill issue table with severity and fixes",
      "Confirm file is NOT imported on main branch",
    ],
    verification: [
      "grep -r review_seeded scorer-gateway/app/main.py || echo OK",
    ],
    artifactFile: `${DOC_BASE}/A5-code-review.md`,
    repoPath: "docs/eval/advanced/A5-code-review.md",
    relatedLinks: [{ label: "Analytics (A6 cache fix)", href: "/analytics" }],
  },
  {
    id: "A6",
    title: "Performance profiling",
    timeBudget: "90 min",
    what:
      "Find a real bottleneck in text normalization for article scoring, apply a minimal cache fix, measure before/after.",
    how:
      "scripts/bench_normalize.py compares cached vs uncached normalize_text over 5000 hot-text calls. @lru_cache on Python normalize_text and HashMap cache in Rust scorer. Dashboard shows bar chart on /analytics.",
    steps: [
      "Baseline: make bench",
      "Profile: repeated normalize on same article text",
      "Fix: lru_cache(maxsize=4096) in text_analysis.py",
      "Re-run make bench and make test",
    ],
    verification: ["make bench", "make test"],
    artifactFile: `${DOC_BASE}/A6-performance.md`,
    repoPath: "docs/eval/advanced/A6-performance.md",
    relatedLinks: [{ label: "Analytics chart", href: "/analytics" }],
  },
];

export function getEvalTask(id: string): EvalTask | undefined {
  return EVAL_TASKS.find((t) => t.id === id.toUpperCase());
}

export const EVAL_README = `${DOC_BASE}/README.md`;
