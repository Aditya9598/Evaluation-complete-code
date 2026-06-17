import type { UserWithBalance } from "../types";

interface Props {
  user: UserWithBalance;
}

export function BalanceCard({ user }: Props) {
  const positive = user.balance >= 0;

  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <h3>{user.name}</h3>
        <span className="account-id">#{user.id}</span>
      </div>
      <p className="email">{user.email}</p>
      <p className={`balance ${positive ? "positive" : "negative"}`}>
        ${user.balance.toFixed(2)}
      </p>
      <p className="meta">{user.transaction_count} transactions</p>
    </div>
  );
}
