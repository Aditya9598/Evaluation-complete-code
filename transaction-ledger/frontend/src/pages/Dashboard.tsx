import { useEffect, useState } from "react";
import { api } from "../api/client";
import { BalanceCard } from "../components/BalanceCard";
import type { HealthResponse, Transaction, UserWithBalance } from "../types";

export function Dashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [users, setUsers] = useState<UserWithBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [healthData, userList, txnList] = await Promise.all([
          api.getHealth(),
          api.getUsers(),
          api.getTransactions(),
        ]);

        const withBalances = await Promise.all(
          userList.map(async (user) => {
            const bal = await api.getBalance(user.id);
            return { ...user, balance: bal.balance, transaction_count: bal.transaction_count };
          }),
        );

        setHealth(healthData);
        setUsers(withBalances);
        setTransactions(txnList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalCredits = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);

  if (loading) return <p className="loading">Loading dashboard…</p>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div>
      <header className="page-header">
        <h2>Dashboard</h2>
        <span className={`status-badge ${health?.status === "ok" ? "ok" : "down"}`}>
          API {health?.status ?? "unknown"} · {health?.environment}
        </span>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Accounts</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Balance</span>
          <span className="stat-value">${totalBalance.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Credits</span>
          <span className="stat-value credit">${totalCredits.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Debits</span>
          <span className="stat-value debit">${totalDebits.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value">{transactions.length}</span>
        </div>
      </div>

      <h3 className="section-title">Account Balances</h3>
      <div className="balance-grid">
        {users.map((user) => (
          <BalanceCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
