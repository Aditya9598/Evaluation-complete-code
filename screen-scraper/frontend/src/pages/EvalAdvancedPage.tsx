import { Link } from "react-router-dom";
import { MermaidDiagram } from "../components/MermaidDiagram";
import { EVAL_TASKS, EVAL_README } from "../data/evalAdvanced";
import { EVAL_A1_MERMAID } from "./AnalyticsPage";

export function EvalAdvancedPage() {
  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Advanced eval tier</p>
          <h1>Eval A1–A6 Hub</h1>
          <p className="subtitle">
            What each task proves, how it was done, and links to full markdown artifacts.
          </p>
        </div>
        <a href={EVAL_README} target="_blank" rel="noopener noreferrer" className="btn btn-small">
          Index (README)
        </a>
      </header>

      <section className="section">
        <h2>A1 — Parallel lane merge (Mermaid)</h2>
        <div className="card mermaid-card">
          <MermaidDiagram chart={EVAL_A1_MERMAID} id="eval-a1" />
        </div>
      </section>

      <section className="section">
        <h2>Tasks</h2>
        <div className="eval-list">
          {EVAL_TASKS.map((task) => (
            <article key={task.id} className="card eval-card">
              <div className="eval-head">
                <span className="badge">{task.id}</span>
                <div>
                  <h3>{task.title}</h3>
                  <p className="meta">{task.timeBudget}</p>
                </div>
              </div>

              <div className="eval-block">
                <h4>What</h4>
                <p>{task.what}</p>
              </div>

              <div className="eval-block">
                <h4>How</h4>
                <p>{task.how}</p>
              </div>

              <div className="eval-actions">
                <Link to={`/eval/advanced/${task.id}`} className="btn btn-small">
                  Read full guide →
                </Link>
                <a
                  href={task.artifactFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-small btn-ghost"
                >
                  Open {task.id}-artifact.md
                </a>
              </div>

              <p className="doc-path">
                Repo: <code>{task.repoPath}</code>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
