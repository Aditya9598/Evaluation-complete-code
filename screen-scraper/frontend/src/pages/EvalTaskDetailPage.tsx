import { Link, useParams } from "react-router-dom";
import { MarkdownDoc } from "../components/MarkdownDoc";
import { getEvalTask } from "../data/evalAdvanced";

function RelatedLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className="text-link pill-link" target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className="text-link pill-link">
      {label}
    </Link>
  );
}

export function EvalTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const task = taskId ? getEvalTask(taskId) : undefined;

  if (!task) {
    return (
      <div className="page">
        <p className="error-text">Unknown eval task: {taskId}</p>
        <Link to="/eval/advanced" className="text-link">Back to eval hub</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Advanced eval · {task.timeBudget}</p>
          <h1>{task.id} — {task.title}</h1>
          <p className="subtitle">
            <Link to="/eval/advanced" className="text-link">← Back to eval hub</Link>
          </p>
        </div>
        <span className="badge">{task.id}</span>
      </header>

      <section className="section">
        <h2>What it does</h2>
        <div className="card">
          <p>{task.what}</p>
        </div>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <div className="card">
          <p>{task.how}</p>
          <ol className="step-list">
            {task.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <h2>Verification</h2>
        <div className="card">
          <pre className="preview code-block">{task.verification.join("\n")}</pre>
        </div>
      </section>

      {task.relatedLinks && task.relatedLinks.length > 0 && (
        <section className="section">
          <h2>Related in this project</h2>
          <div className="card link-row">
            {task.relatedLinks.map((link) => (
              <RelatedLink key={link.href} {...link} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="artifact-header">
          <h2>Full artifact</h2>
          <div className="artifact-links">
            <a
              href={task.artifactFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Open markdown in new tab
            </a>
            <code className="repo-path">{task.repoPath}</code>
          </div>
        </div>
        <div className="card markdown-card">
          <MarkdownDoc url={task.artifactFile} />
        </div>
      </section>
    </div>
  );
}
