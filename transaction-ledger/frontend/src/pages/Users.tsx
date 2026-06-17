import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { UserWithBalance } from "../types";

export function Users() {
  const [users, setUsers] = useState<UserWithBalance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userList = await api.getUsers();
        const withBalances = await Promise.all(
          userList.map(async (user) => {
            const bal = await api.getBalance(user.id);
            return { ...user, balance: bal.balance, transaction_count: bal.transaction_count };
          }),
        );
        setUsers(withBalances);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="loading">Loading users…</p>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div>
      <header className="page-header">
        <h2>Users & Balances</h2>
      </header>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={user.balance >= 0 ? "amount-credit" : "amount-debit"}>
                  ${user.balance.toFixed(2)}
                </td>
                <td>{user.transaction_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
