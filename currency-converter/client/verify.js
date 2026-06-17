#!/usr/bin/env node

const BASE_URL = process.env.CONVERTER_URL || "http://127.0.0.1:8001";

async function verify() {
  const health = await fetch(`${BASE_URL}/health`);
  if (!health.ok) {
    throw new Error(`Health check failed: ${health.status}`);
  }

  const response = await fetch(`${BASE_URL}/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 100, from: "USD", to: "EUR" }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Convert failed: ${JSON.stringify(body)}`);
  }

  if (body.converted_amount !== 92) {
    throw new Error(`Expected 92, got ${body.converted_amount}`);
  }

  console.log("Verification passed:", body);
}

verify().catch((err) => {
  console.error("Verification failed:", err.message);
  process.exit(1);
});
