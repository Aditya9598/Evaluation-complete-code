import { useEffect, useState } from "react";
import { api } from "../api/client";
import { TransactionForm } from "../components/TransactionForm";
import type { User } from "../types";

export function NewTransaction() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load users"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading…</p>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div>
      <header className="page-header">
        <h2>New Transaction</h2>
      </header>
      <TransactionForm users={users} />
    </div>
  );
}
