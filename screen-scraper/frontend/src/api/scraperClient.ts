import type { OpenApiRoute, ProbeResult } from "../types";

const USE_PROXY = import.meta.env.VITE_USE_PROXY === "true";
const DIRECT_BASE =
  import.meta.env.VITE_SCRAPER_API_BASE_URL ||
  "https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com";

export function scraperBaseUrl(): string {
  return USE_PROXY ? "/scraper-api" : DIRECT_BASE.replace(/\/$/, "");
}

function headers(accept = "application/json"): Record<string, string> {
  const h: Record<string, string> = { accept };
  const key = import.meta.env.VITE_SCRAPER_API_KEY;
  if (key) h["X-API-Key"] = key;
  return h;
}

async function readPreview(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("audio") || ct.includes("octet-stream")) {
    return `binary ${res.headers.get("content-type")} (${res.headers.get("content-length") || "?"} bytes)`;
  }
  const text = await res.text();
  try {
    return JSON.stringify(JSON.parse(text), null, 0).slice(0, 400);
  } catch {
    return text.slice(0, 400);
  }
}

export async function probe(
  method: string,
  path: string,
  options?: { body?: string; contentType?: string; timeoutMs?: number; slow?: boolean }
): Promise<ProbeResult> {
  const start = performance.now();
  const timeoutMs = options?.timeoutMs ?? (options?.slow ? 180000 : 30000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${scraperBaseUrl()}${path}`;
    const init: RequestInit = {
      method,
      headers: headers(),
      signal: controller.signal,
    };
    if (options?.body !== undefined) {
      init.body = options.body;
      init.headers = {
        ...headers(),
        "Content-Type": options.contentType || "application/json",
      };
    }

    const res = await fetch(url, init);
    const durationMs = Math.round(performance.now() - start);
    const preview = await readPreview(res.clone());

    if (!res.ok) {
      return {
        status: "error",
        httpCode: res.status,
        durationMs,
        preview,
        error: `HTTP ${res.status}`,
      };
    }

    const status: ProbeResult["status"] =
      options?.slow && durationMs > 30000 ? "slow" : durationMs > 10000 ? "slow" : "ok";

    return { status, httpCode: res.status, durationMs, preview };
  } catch (err) {
    return {
      status: "error",
      durationMs: Math.round(performance.now() - start),
      error: err instanceof Error ? err.message : "request failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function getMarketStatus(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/market-status/today");
}

export async function getMarketCalendar(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/market-calendar");
}

export async function getRssFeed(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/rss/economic_times");
}

export async function getFaq(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/user_query/faq");
}

export async function getEmailRecipients(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/opening-bell/email-recipients");
}

export async function getPrefectHealth(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/prefect/health");
}

export async function getClusteringStats(): Promise<ProbeResult> {
  return probe("GET", "/api/v1/category_clustering/statistics");
}

export async function searchNews(query: string, limit = 3): Promise<ProbeResult> {
  const body = new URLSearchParams({ query, limit: String(limit) }).toString();
  return probe("POST", "/api/v1/news/search", {
    body,
    contentType: "application/x-www-form-urlencoded",
  });
}

export async function postEmpty(path: string, slow = false): Promise<ProbeResult> {
  return probe("POST", path, { body: "", contentType: "application/json", slow });
}

export const PIPELINE_ROUTES: OpenApiRoute[] = [
  { tag: "rss", method: "GET", path: "/api/v1/rss/economic_times", summary: "RSS feed", expectedStatus: "ok" },
  { tag: "rss", method: "POST", path: "/api/v1/rss/economic_times", summary: "Sync RSS", expectedStatus: "ok" },
  { tag: "prefect", method: "GET", path: "/api/v1/prefect/health", summary: "Prefect health", expectedStatus: "error" },
  { tag: "prefect", method: "POST", path: "/api/v1/prefect/flow-runs/fetch-news", summary: "Fetch news flow", expectedStatus: "ok" },
  { tag: "prefect", method: "POST", path: "/api/v1/prefect/flow-runs/process-news", summary: "Process news flow", expectedStatus: "ok" },
  { tag: "clustering", method: "GET", path: "/api/v1/category_clustering/statistics", summary: "Cluster stats", expectedStatus: "error" },
  { tag: "clustering", method: "POST", path: "/api/v1/category_clustering/generate", summary: "Generate clusters", expectedStatus: "error" },
  { tag: "briefing", method: "POST", path: "/api/v1/market-briefing/generate", summary: "Market briefing", expectedStatus: "ok" },
  { tag: "opening-bell", method: "POST", path: "/api/v1/opening-bell/assemble-data?news_days=7", summary: "Assemble data", expectedStatus: "ok", slow: true },
  { tag: "opening-bell", method: "POST", path: "/api/v1/opening-bell/generate?news_days=7", summary: "Generate transcript", expectedStatus: "ok", slow: true },
  { tag: "opening-bell", method: "POST", path: "/api/v1/opening-bell/generate-narration?news_days=7", summary: "Narration", expectedStatus: "ok", slow: true },
  { tag: "opening-bell", method: "POST", path: "/api/v1/opening-bell/generate-audio?news_days=7", summary: "Generate audio", expectedStatus: "ok", slow: true },
  { tag: "opening-bell", method: "POST", path: "/api/v1/opening-bell/run-full-pipeline?news_days=7&pipeline_version=v1&triggered_by=api&email=false&slack=false&sync_email=false", summary: "Full pipeline", expectedStatus: "ok", slow: true },
  { tag: "opening-bell", method: "GET", path: "/api/v1/opening-bell/email-recipients", summary: "Email recipients", expectedStatus: "ok" },
  { tag: "calendar", method: "GET", path: "/api/v1/market-calendar", summary: "Market calendar", expectedStatus: "ok" },
  { tag: "calendar", method: "POST", path: "/api/v1/market-calendar/sync/nse-holidays", summary: "Sync holidays", expectedStatus: "error" },
  { tag: "user_query", method: "GET", path: "/api/v1/user_query/faq", summary: "FAQ list", expectedStatus: "ok" },
  { tag: "user_query", method: "POST", path: "/api/v1/user_query/faq", summary: "Generate FAQ", expectedStatus: "error" },
];

export function parseOpenApiRoutes(spec: Record<string, unknown>): OpenApiRoute[] {
  const paths = spec.paths as Record<string, Record<string, { tags?: string[]; summary?: string }>>;
  const routes: OpenApiRoute[] = [];
  for (const [path, methods] of Object.entries(paths || {})) {
    for (const [method, meta] of Object.entries(methods)) {
      if (method === "parameters") continue;
      const known = PIPELINE_ROUTES.find((r) => r.path === path && r.method === method.toUpperCase());
      routes.push({
        tag: meta.tags?.[0] || "default",
        method: method.toUpperCase(),
        path,
        summary: meta.summary,
        expectedStatus: known?.expectedStatus || "idle",
        slow: known?.slow,
      });
    }
  }
  return routes.sort((a, b) => a.path.localeCompare(b.path));
}
