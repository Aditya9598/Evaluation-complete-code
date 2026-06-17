import { useEffect, useState } from "react";
import { api } from "../api/client";
import { TransactionTable } from "../components/TransactionTable";
import type { Transaction, User } from "../types";

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filterId, setFilterId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const userList = await api.getUsers();
        setUsers(userList);
        const txns = await api.getTransactions(filterId === "" ? undefined : filterId);
        setTransactions(txns);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filterId]);

  return (
    <div>
      <header className="page-header">
        <h2>Transactions</h2>
        <div className="filter-row">
          <label htmlFor="filter">Filter by account</label>
          <select
            id="filter"
            value={filterId}
            onChange={(e) =>
              setFilterId(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">All accounts</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} (#{u.id})
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <p className="loading">Loading transactions…</p>}
      {error && <div className="error-banner">{error}</div>}
      {!loading && !error && (
        <TransactionTable transactions={transactions} users={users} />
      )}
    </div>
  );
}
