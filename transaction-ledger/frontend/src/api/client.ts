import type {
  BalanceResponse,
  HealthResponse,
  Transaction,
  TransactionCreate,
  User,
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body.detail)) {
        detail = body.detail.map((e: { msg?: string }) => e.msg ?? "").join(", ");
      }
    } catch {
      // use statusText
    }
    throw new Error(`${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getHealth: () => request<HealthResponse>("/health"),
  getUsers: () => request<User[]>("/users"),
  getBalance: (id: number) =>
    request<BalanceResponse>(`/balance?id=${id}`),
  getTransactions: (accountId?: number) => {
    const query = accountId ? `?id=${accountId}` : "";
    return request<Transaction[]>(`/transactions${query}`);
  },
  createTransaction: (payload: TransactionCreate) =>
    request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
