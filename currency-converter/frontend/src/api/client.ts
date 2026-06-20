import type { ConvertRequest, ConvertResponse, HealthResponse } from "../types";

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
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // use statusText
    }
    throw new Error(`${response.status}: ${detail}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getHealth: () => request<HealthResponse>("/health"),
  convert: (payload: ConvertRequest) =>
    request<ConvertResponse>("/convert", {
      method: "POST",
      body: JSON.stringify({
        amount: payload.amount,
        from: payload.from,
        to: payload.to,
      }),
    }),
};
