export type Currency = "USD" | "EUR" | "GBP";

export const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"];

export interface ConvertResponse {
  amount: number;
  from: Currency;
  to: Currency;
  converted_amount: number;
  rate: number;
}

export interface HealthResponse {
  status: string;
  environment: string;
}

export interface ConvertRequest {
  amount: number;
  from: Currency;
  to: Currency;
}
