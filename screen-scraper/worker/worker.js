import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length) process.env[key] = rest.join("=");
    }
  } catch {
    // defaults
  }
}

loadEnv();

const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || "http://127.0.0.1:8003";
const SCRAPER_API_BASE_URL =
  process.env.SCRAPER_API_BASE_URL ||
  "https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com";
const SCORER_BIN =
  process.env.SCORER_BIN || resolve(__dirname, "../scorer/target/debug/scorer");
const POLL_INTERVAL_MS = Number(process.env.WORKER_POLL_INTERVAL_MS || 2000);
const SCORER_TIMEOUT_MS = Number(process.env.WORKER_SCORER_TIMEOUT_MS || 5000);
const NEWS_QUERY = process.env.WORKER_NEWS_QUERY || "tata motors";
const NEWS_LIMIT = process.env.WORKER_NEWS_LIMIT || "3";
const CONTRACT_VERSION = "1.0";

export function runScorer(article, scorerBin = SCORER_BIN, scorerArgs = ["score"]) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(scorerBin, scorerArgs, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("scorer timeout"));
    }, SCORER_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr || `scorer exited ${code}`));
        return;
      }
      try {
        resolvePromise(JSON.parse(stdout.trim()));
      } catch (e) {
        reject(new Error(`invalid scorer output: ${e.message}`));
      }
    });

    child.stdin.write(JSON.stringify(article));
    child.stdin.end();
  });
}

export async function fetchNewsFromScraper() {
  const body = new URLSearchParams({ query: NEWS_QUERY, limit: NEWS_LIMIT });
  const headers = { accept: "application/json" };
  if (process.env.SCRAPER_API_KEY) {
    headers["X-API-Key"] = process.env.SCRAPER_API_KEY;
  }
  const res = await fetch(`${SCRAPER_API_BASE_URL}/api/v1/news/search`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) throw new Error(`news search failed: ${res.status}`);
  return res.json();
}

export async function enqueueJob(job) {
  const res = await fetch(`${GATEWAY_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`enqueue failed: ${res.status}`);
  }
  return res.ok ? res.json() : null;
}

export async function fetchPending() {
  const res = await fetch(`${GATEWAY_BASE_URL}/jobs/pending`);
  if (!res.ok) throw new Error(`pending fetch failed: ${res.status}`);
  return res.json();
}

export async function claimJob(id) {
  const res = await fetch(`${GATEWAY_BASE_URL}/jobs/${id}/claim`, { method: "PATCH" });
  if (!res.ok) throw new Error(`claim failed: ${res.status}`);
  return res.json();
}

export async function submitScore(id, score) {
  const res = await fetch(`${GATEWAY_BASE_URL}/jobs/${id}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(score),
  });
  if (!res.ok) throw new Error(`score submit failed: ${res.status}`);
  return res.json();
}

export async function markFailed(id) {
  const res = await fetch(`${GATEWAY_BASE_URL}/jobs/${id}/fail`, { method: "POST" });
  if (!res.ok) throw new Error(`fail mark failed: ${res.status}`);
  return res.json();
}

export async function ingestFromScraper() {
  const articles = await fetchNewsFromScraper();
  let enqueued = 0;
  for (const doc of articles) {
    const job = {
      contract_version: CONTRACT_VERSION,
      job_id: doc.id,
      title: doc.page_content?.split("\n")[0] || "Untitled",
      body: doc.page_content || "",
      source: doc.metadata?.source || "economic_times",
    };
    const result = await enqueueJob(job);
    if (result) enqueued += 1;
  }
  return enqueued;
}

export async function processOnce(scorerBin = SCORER_BIN) {
  const pending = await fetchPending();
  if (!pending.length) return 0;

  let processed = 0;
  for (const job of pending) {
    if (job.contract_version !== CONTRACT_VERSION) {
      await markFailed(job.job_id);
      continue;
    }

    await claimJob(job.job_id);
    try {
      const score = await runScorer(job, scorerBin);
      await submitScore(job.job_id, score);
      processed += 1;
    } catch {
      await markFailed(job.job_id);
    }
  }
  return processed;
}

async function main() {
  const once = process.argv.includes("--once");
  const ingest = process.argv.includes("--ingest");

  console.log(`Worker gateway=${GATEWAY_BASE_URL} scraper=${SCRAPER_API_BASE_URL}`);

  if (ingest) {
    const n = await ingestFromScraper();
    console.log(`Enqueued ${n} article(s) from live scraper`);
  }

  if (once) {
    const n = await processOnce();
    console.log(`Processed ${n} job(s)`);
    return;
  }

  if (!once && !ingest) {
    for (;;) {
      try {
        const n = await processOnce();
        if (n > 0) console.log(`Processed ${n} job(s)`);
      } catch (err) {
        console.error("Worker error:", err.message);
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
