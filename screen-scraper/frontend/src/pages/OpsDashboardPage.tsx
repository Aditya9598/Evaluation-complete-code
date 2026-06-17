import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  getClusteringStats,
  getEmailRecipients,
  getFaq,
  getMarketCalendar,
  getMarketStatus,
  getPrefectHealth,
  getRssFeed,
  postEmpty,
  scraperBaseUrl,
} from "../api/scraperClient";
import { StatusBadge } from "../components/StatusBadge";
import type { ProbeResult } from "../types";

interface PipelineNode {
  id: string;
  label: string;
  probe: () => Promise<ProbeResult>;
  slow?: boolean;
  triggerPath?: string;
}

const PIPELINE_NODES: PipelineNode[] = [
  { id: "rss", label: "RSS Feed", probe: getRssFeed },
  { id: "fetch", label: "Fetch News", probe: () => postEmpty("/api/v1/prefect/flow-runs/fetch-news") },
  { id: "process", label: "Process News", probe: () => postEmpty("/api/v1/prefect/flow-runs/process-news") },
  { id: "cluster", label: "Clustering", probe: getClusteringStats },
  { id: "briefing", label: "Market Briefing", probe: () => postEmpty("/api/v1/market-briefing/generate") },
  { id: "assemble", label: "Opening Bell Data", probe: () => postEmpty("/api/v1/opening-bell/assemble-data?news_days=7", true), slow: true },
  { id: "generate", label: "Generate Transcript", probe: () => postEmpty("/api/v1/opening-bell/generate?news_days=7", true), slow: true },
  { id: "audio", label: "Generate Audio", probe: () => postEmpty("/api/v1/opening-bell/generate-audio?news_days=7", true), slow: true },
  { id: "email", label: "Email Recipients", probe: getEmailRecipients },
  { id: "prefect", label: "Prefect Health", probe: getPrefectHealth },
];

export function OpsDashboardPage() {
  const [results, setResults] = useState<Record<string, ProbeResult>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [market, setMarket] = useState<ProbeResult | null>(null);

  const runSafeProbes = useCallback(async () => {
    setLoading(true);
    const safe: PipelineNode[] = [
      { id: "rss", label: "RSS", probe: getRssFeed },
      { id: "prefect", label: "Prefect", probe: getPrefectHealth },
      { id: "cluster", label: "Clustering", probe: getClusteringStats },
      { id: "email", label: "Email", probe: getEmailRecipients },
      { id: "faq", label: "FAQ", probe: getFaq },
      { id: "calendar", label: "Calendar", probe: getMarketCalendar },
    ];
    const next: Record<string, ProbeResult> = {};
    for (const node of safe) {
      next[node.id] = await node.probe();
    }
    setResults((prev) => ({ ...prev, ...next }));
    setMarket(await getMarketStatus());
    setLoading(false);
  }, []);

  useEffect(() => {
    runSafeProbes();
  }, [runSafeProbes]);

  const runNode = async (node: PipelineNode) => {
    setResults((prev) => ({ ...prev, [node.id]: { status: "loading" } }));
    const result = await node.probe();
    setResults((prev) => ({ ...prev, [node.id]: result }));
    setSelected(node.id);
  };

  const flowNodes: Node[] = useMemo(() => {
    return PIPELINE_NODES.map((node, i) => {
      const r = results[node.id];
      const status = r?.status || "idle";
      return {
        id: node.id,
        position: { x: (i % 3) * 220, y: Math.floor(i / 3) * 100 },
        data: { label: node.label },
        className: `flow-node status-${status}`,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [results]);

  const flowEdges: Edge[] = useMemo(() => {
    const ids = PIPELINE_NODES.map((n) => n.id);
    return ids.slice(0, -1).map((id, i) => ({
      id: `e-${id}`,
      source: id,
      target: ids[i + 1],
      animated: results[ids[i + 1]]?.status === "loading",
    }));
  }, [results]);

  const selectedNode = PIPELINE_NODES.find((n) => n.id === selected);
  const selectedResult = selected ? results[selected] : null;

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Live scraper API</p>
          <h1>Ops Pipeline</h1>
          <p className="subtitle">Polling {scraperBaseUrl()}</p>
        </div>
        <button type="button" className="btn" onClick={runSafeProbes} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh safe probes"}
        </button>
      </header>

      {market && (
        <section className="section">
          <div className="card market-card">
            <h2>Market today</h2>
            <StatusBadge status={market.status} />
            <pre className="preview">{market.preview}</pre>
          </div>
        </section>
      )}

      <section className="section">
        <h2>Pipeline flow</h2>
        <div className="card flow-card">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            fitView
            onNodeClick={(_, node) => setSelected(node.id)}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </section>

      <section className="section">
        <h2>Pipeline nodes</h2>
        <div className="node-grid">
          {PIPELINE_NODES.map((node) => (
            <div key={node.id} className="card node-card">
              <div className="node-head">
                <h3>{node.label}</h3>
                <StatusBadge status={results[node.id]?.status || "idle"} />
              </div>
              {results[node.id]?.durationMs != null && (
                <p className="meta">{results[node.id]?.durationMs} ms</p>
              )}
              {results[node.id]?.httpCode != null && (
                <p className="meta">HTTP {results[node.id]?.httpCode}</p>
              )}
              <button
                type="button"
                className="btn btn-small"
                onClick={() => runNode(node)}
                disabled={results[node.id]?.status === "loading"}
              >
                {node.slow ? "Run (slow)" : "Probe"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedNode && selectedResult && (
        <section className="section">
          <h2>Detail — {selectedNode.label}</h2>
          <div className="card">
            <StatusBadge status={selectedResult.status} />
            {selectedResult.error && <p className="error-text">{selectedResult.error}</p>}
            <pre className="preview">{selectedResult.preview}</pre>
          </div>
        </section>
      )}
    </div>
  );
}
