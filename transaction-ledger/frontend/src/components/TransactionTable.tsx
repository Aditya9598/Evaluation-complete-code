import type { Transaction, User } from "../types";

interface Props {
  transactions: Transaction[];
  users: User[];
}

function userName(users: User[], accountId: number): string {
  return users.find((u) => u.id === accountId)?.name ?? `Account ${accountId}`;
}

export function TransactionTable({ transactions, users }: Props) {
  if (transactions.length === 0) {
    return <p className="empty">No transactions found.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.id}</td>
              <td>{userName(users, txn.account_id)}</td>
              <td>
                <span className={`badge ${txn.type}`}>{txn.type}</span>
              </td>
              <td className={txn.type === "credit" ? "amount-credit" : "amount-debit"}>
                {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
              </td>
              <td>{txn.description ?? "—"}</td>
              <td>{new Date(txn.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
