import { Link } from "react-router-dom";
import { scraperBaseUrl } from "../api/scraperClient";

export function HomePage() {
  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">screen-scraper · Advanced eval</p>
          <h1>Screen Scraper Operations Dashboard</h1>
          <p className="subtitle">
            Live data from the Web Scraping API — hybrid with local scorer-gateway for A3
          </p>
        </div>
        <span className="badge live">LIVE</span>
      </header>

      <section className="section">
        <h2>Quick links</h2>
        <div className="card-grid">
          <Link to="/ops" className="card link-card">
            <h3>Ops Pipeline</h3>
            <p>React Flow view with per-node green / yellow / red status</p>
          </Link>
          <Link to="/apis" className="card link-card">
            <h3>API Catalog</h3>
            <p>All routes from openapi.json with Try-it probes</p>
          </Link>
          <Link to="/analytics" className="card link-card">
            <h3>Analytics</h3>
            <p>Market context, perf benchmarks, pipeline timings</p>
          </Link>
          <Link to="/eval/advanced" className="card link-card">
            <h3>Eval A1–A6</h3>
            <p>Advanced tier evidence hub</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Configuration</h2>
        <div className="card">
          <p>
            Scraper base: <code>{scraperBaseUrl()}</code>
          </p>
          <p className="hint">
            Set <code>VITE_SCRAPER_API_BASE_URL</code> and <code>VITE_USE_PROXY=true</code> in
            <code>frontend/.env</code> for VPN dev proxy.
          </p>
        </div>
      </section>
    </div>
  );
}
