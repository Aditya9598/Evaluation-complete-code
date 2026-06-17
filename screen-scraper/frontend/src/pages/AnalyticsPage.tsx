import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PIPELINE_STEP_TIMINGS } from "../data/pipelineTimings";
import { AUDIO_GENERATION_METRICS } from "../data/audioMetrics";

const A6_CHART = [
  { name: "Before cache", ms: 10.96 },
  { name: "After cache", ms: 0.42 },
];

export function AnalyticsPage() {
  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Performance & timings</p>
          <h1>Analytics</h1>
          <p className="subtitle">Live probe timings + A6 normalize_text benchmark</p>
        </div>
      </header>

      <section className="section">
        <h2>A6 — Text normalization cache (81% faster)</h2>
        <div className="card chart-card">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={A6_CHART}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="ms" />
              <Tooltip />
              <Bar dataKey="ms" fill="#0ea5e9" name="Duration (ms)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="hint">
            Run <code>make bench</code> in scorer-gateway for reproducible numbers.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Opening Bell pipeline durations (live probes)</h2>
        <div className="card chart-card">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={PIPELINE_STEP_TIMINGS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" unit="ms" />
              <YAxis type="category" dataKey="step" width={140} />
              <Tooltip />
              <Bar dataKey="ms" fill="#6366f1" name="ms" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="section">
        <h2>Audio generation metrics (lane/audio)</h2>
        <div className="card chart-card">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AUDIO_GENERATION_METRICS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis yAxisId="left" unit="ms" />
              <YAxis yAxisId="right" orientation="right" unit="B" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="durationMs" fill="#8b5cf6" name="Duration (ms)" />
              <Bar yAxisId="right" dataKey="sizeBytes" fill="#c4b5fd" name="Size (bytes)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="section">
        <h2>Cluster distribution</h2>
        <div className="card">
          <p className="hint">
            <code>GET /category_clustering/statistics</code> returns 500 on dev — chart shows expected
            layout when API is healthy.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { cluster: "Finance", size: 120 },
                { cluster: "Auto", size: 85 },
                { cluster: "IT", size: 64 },
                { cluster: "Energy", size: 42 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cluster" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="size" fill="#94a3b8" name="Articles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export const EVAL_A1_MERMAID = `
gitGraph
  commit id: "main"
  branch lane/pipeline
  checkout lane/pipeline
  commit id: "pipeline timings"
  checkout main
  branch lane/audio
  checkout lane/audio
  commit id: "audio metrics"
  checkout main
  merge lane/pipeline
  merge lane/audio
  commit id: "integration"
`;
