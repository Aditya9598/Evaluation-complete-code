import { type FormEvent, useEffect, useState } from "react";
import { api } from "../api/client";
import { RATE_ROWS } from "../data/erDiagram";
import type { ConvertResponse, Currency } from "../types";
import { CURRENCIES } from "../types";

export function ConverterPage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<Currency>("USD");
  const [to, setTo] = useState<Currency>("EUR");
  const [result, setResult] = useState<ConvertResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  useEffect(() => {
    api
      .getHealth()
      .then((h) => setApiStatus(h.status))
      .catch(() => setApiStatus("offline"));
  }, []);

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError(null);
  }

  async function handleConvert(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const value = parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Amount must be a positive number");
      setLoading(false);
      return;
    }

    if (from === to) {
      setError("From and to currencies must differ");
      setLoading(false);
      return;
    }

    try {
      const data = await api.convert({ amount: value, from, to });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  const displayRates = RATE_ROWS.filter((r) => r.from !== r.to);

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">currency-converter</p>
          <h1>Convert Currency</h1>
          <p className="subtitle">Live conversion via FastAPI · port 8001</p>
        </div>
        <span className={`status-pill ${apiStatus === "ok" ? "ok" : "down"}`}>
          API {apiStatus ?? "…"}
        </span>
      </header>

      <div className="converter-grid">
        <form className="card converter-card" onSubmit={handleConvert}>
          <h2>Conversion</h2>

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

          <div className="currency-row">
            <div className="field">
              <label htmlFor="from">From</label>
              <select
                id="from"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value as Currency);
                  setResult(null);
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button type="button" className="swap-btn" onClick={swapCurrencies} title="Swap">
              ⇄
            </button>

            <div className="field">
              <label htmlFor="to">To</label>
              <select
                id="to"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value as Currency);
                  setResult(null);
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Converting…" : "Convert"}
          </button>

          {result && (
            <div className="result-box">
              <p className="result-main">
                {result.amount} {result.from} ={" "}
                <strong>{result.converted_amount} {result.to}</strong>
              </p>
              <p className="result-rate">Rate: {result.rate}</p>
            </div>
          )}
        </form>

        <div className="card rates-card">
          <h2>Exchange rates</h2>
          <p className="rates-hint">Hardcoded in service/app/converter.py</p>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {displayRates.map((row) => (
                <tr
                  key={`${row.from}-${row.to}`}
                  className={row.from === from && row.to === to ? "highlight" : ""}
                >
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
