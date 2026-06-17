import { useEffect, useState } from "react";
import {
  PIPELINE_ROUTES,
  parseOpenApiRoutes,
  probe,
  scraperBaseUrl,
} from "../api/scraperClient";
import { StatusBadge } from "../components/StatusBadge";
import type { OpenApiRoute, ProbeResult } from "../types";

export function ApiCatalogPage() {
  const [routes, setRoutes] = useState<OpenApiRoute[]>(PIPELINE_ROUTES);
  const [results, setResults] = useState<Record<string, ProbeResult>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/openapi.json")
      .then((r) => r.json())
      .then((spec) => setRoutes(parseOpenApiRoutes(spec)))
      .catch(() => setRoutes(PIPELINE_ROUTES));
  }, []);

  const key = (r: OpenApiRoute) => `${r.method}:${r.path}`;

  const tryRoute = async (route: OpenApiRoute) => {
    const k = key(route);
    setLoadingKey(k);
    setResults((prev) => ({ ...prev, [k]: { status: "loading" } }));

    let result: ProbeResult;
    if (route.method === "GET") {
      result = await probe("GET", route.path);
    } else if (route.path.includes("autocomplete")) {
      const body = new URLSearchParams({ search_term: "tata" }).toString();
      result = await probe("POST", route.path, {
        body,
        contentType: "application/x-www-form-urlencoded",
      });
    } else if (route.path.includes("news/search")) {
      const body = new URLSearchParams({ query: "tata motors", limit: "2" }).toString();
      result = await probe("POST", route.path, {
        body,
        contentType: "application/x-www-form-urlencoded",
      });
    } else {
      result = await probe("POST", route.path, {
        body: "",
        contentType: "application/json",
        slow: route.slow,
        timeoutMs: route.slow ? 180000 : 30000,
      });
    }

    setResults((prev) => ({ ...prev, [k]: result }));
    setLoadingKey(null);
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">OpenAPI catalog</p>
          <h1>API Catalog</h1>
          <p className="subtitle">{scraperBaseUrl()} · {routes.length} routes</p>
        </div>
      </header>

      <section className="section">
        <div className="table-wrap card">
          <table className="api-table">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Method</th>
                <th>Path</th>
                <th>Expected</th>
                <th>Live</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => {
                const k = key(route);
                const live = results[k];
                return (
                  <tr key={k}>
                    <td>{route.tag}</td>
                    <td><code>{route.method}</code></td>
                    <td><code>{route.path}</code></td>
                    <td><StatusBadge status={route.expectedStatus} /></td>
                    <td>
                      {live ? <StatusBadge status={live.status} /> : <span className="muted">—</span>}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-small"
                        disabled={loadingKey === k}
                        onClick={() => tryRoute(route)}
                      >
                        Try it
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
