import { MermaidDiagram } from "../components/MermaidDiagram";
import {
  ENTITIES,
  ER_MERMAID,
  I1_NOTES,
  RATE_ROWS,
  RELATIONSHIPS,
} from "../data/erDiagram";

const kindLabel: Record<string, string> = {
  enum: "Enum (not a table)",
  dto: "DTO (request/response)",
  lookup: "In-memory lookup",
};

export function ErDiagramPage() {
  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">currency-converter · Intermediate eval</p>
          <h1>I1 — ER Diagram from Repo</h1>
          <p className="subtitle">Built from repo source only — no SQL database</p>
        </div>
        <span className="badge">I1</span>
      </header>

      <section className="section">
        <h2>Summary</h2>
        <p>
          Logical entities defined as Pydantic models. Exchange rates live in an in-memory{" "}
          <code>dict</code> keyed by <code>(from_currency, to_currency)</code> tuples.
        </p>
      </section>

      <section className="section">
        <h2>Mermaid ER diagram</h2>
        <div className="card mermaid-card">
          <MermaidDiagram chart={ER_MERMAID} id="currency-er" />
        </div>
      </section>

      <section className="section">
        <h2>Entities ({ENTITIES.length})</h2>
        <div className="entity-list">
          {ENTITIES.map((entity) => (
            <div key={entity.name} className="card entity-card">
              <div className="entity-head">
                <h3>{entity.name}</h3>
                <span className={`kind ${entity.kind}`}>{kindLabel[entity.kind]}</span>
              </div>
              {entity.storage && <p className="storage"><strong>Storage:</strong> {entity.storage}</p>}
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>PK</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {entity.fields.map((f) => (
                    <tr key={f.field}>
                      <td><code>{f.field}</code></td>
                      <td>{f.type}</td>
                      <td>{f.primaryKey ? "Yes" : "—"}</td>
                      <td className="source">{f.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>RATES lookup table</h2>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Rate</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {RATE_ROWS.map((row) => (
                <tr key={`${row.from}-${row.to}`}>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.rate}</td>
                  <td className="source">{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Relationships</h2>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Type</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {RELATIONSHIPS.map((rel) => (
                <tr key={`${rel.from}-${rel.to}`}>
                  <td><code>{rel.from}</code></td>
                  <td><code>{rel.to}</code></td>
                  <td>{rel.type}</td>
                  <td className="source">{rel.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">No database foreign keys — stateless conversion service.</p>
        </div>
      </section>

      <section className="section">
        <h2>Notes</h2>
        <ul className="notes">
          {I1_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
