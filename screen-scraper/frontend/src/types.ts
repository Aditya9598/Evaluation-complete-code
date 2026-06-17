export type ProbeStatus = "ok" | "error" | "slow" | "idle" | "loading";

export interface ProbeResult {
  status: ProbeStatus;
  httpCode?: number;
  durationMs?: number;
  preview?: string;
  error?: string;
}

export interface MarketStatus {
  date: string;
  is_trading_day: boolean;
  market_status: string;
  opens_at?: string;
}

export interface EmailRecipient {
  id: string;
  email: string;
  label: string;
}

export interface OpenApiRoute {
  tag: string;
  method: string;
  path: string;
  summary?: string;
  expectedStatus: ProbeStatus;
  slow?: boolean;
}

export interface PerfBenchmark {
  label: string;
  beforeMs: number;
  afterMs: number;
}
