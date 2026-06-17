import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { TransactionType, User } from "../types";

interface Props {
  users: User[];
}

export function TransactionForm({ users }: Props) {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(users[0]?.id ?? 1);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("credit");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createTransaction({
        id: accountId,
        amount: parseFloat(amount),
        type,
        description: description || undefined,
      });
      navigate("/transactions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="account">Account</label>
        <select
          id="account"
          value={accountId}
          onChange={(e) => setAccountId(Number(e.target.value))}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} (#{u.id})
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="type">Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100.00"
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          type="text"
          maxLength={200}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deposit, purchase, etc."
        />
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create Transaction"}
      </button>
    </form>
  );
}
