import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Convert", end: true },
  { to: "/er-diagram", label: "ER Diagram (I1)" },
];

export function NavBar() {
  return (
    <nav className="sidebar">
      <div className="brand">
        <span className="brand-icon">$</span>
        <div>
          <h1>Currency Converter</h1>
          <p>USD · EUR · GBP</p>
        </div>
      </div>
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
