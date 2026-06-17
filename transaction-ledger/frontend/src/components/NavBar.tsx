import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/users", label: "Users" },
  { to: "/transactions", label: "Transactions" },
  { to: "/transactions/new", label: "New Transaction" },
];

export function NavBar() {
  return (
    <nav className="sidebar">
      <div className="brand">
        <span className="brand-icon">₹</span>
        <div>
          <h1>Transaction Ledger</h1>
          <p>Account dashboard</p>
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
