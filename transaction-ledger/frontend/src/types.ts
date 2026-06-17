export type TransactionType = "credit" | "debit";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  created_at: string;
}

export interface BalanceResponse {
  id: number;
  balance: number;
  transaction_count: number;
}

export interface HealthResponse {
  status: string;
  environment: string;
}

export interface TransactionCreate {
  id: number;
  amount: number;
  type: TransactionType;
  description?: string;
}

export interface UserWithBalance extends User {
  balance: number;
  transaction_count: number;
}
