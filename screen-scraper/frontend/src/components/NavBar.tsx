import { NavLink } from "react-router-dom";
import { scraperBaseUrl } from "../api/scraperClient";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/ops", label: "Ops Pipeline" },
  { to: "/apis", label: "API Catalog" },
  { to: "/analytics", label: "Analytics" },
  { to: "/eval/advanced", label: "Eval A1–A6" },
];

export function NavBar() {
  return (
    <nav className="sidebar">
      <div className="brand">
        <span className="brand-icon">S</span>
        <div>
          <h1>Screen Scraper Ops</h1>
          <p>Live API dashboard</p>
        </div>
      </div>
      <p className="api-base">{scraperBaseUrl()}</p>
      <ul>
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
