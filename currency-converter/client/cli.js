#!/usr/bin/env node

const DEFAULT_BASE_URL = process.env.CONVERTER_URL || "http://127.0.0.1:8001";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--amount") args.amount = value;
    if (key === "--from") args.from = value;
    if (key === "--to") args.to = value;
    if (key === "--url") args.url = value;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const baseUrl = args.url || DEFAULT_BASE_URL;

  if (!args.amount || !args.from || !args.to) {
    console.error("Usage: node cli.js --amount 100 --from USD --to EUR [--url http://127.0.0.1:8001]");
    process.exit(1);
  }

  const amount = Number(args.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    console.error("Error: amount must be a positive number");
    process.exit(1);
  }

  const response = await fetch(`${baseUrl}/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      from: args.from.toUpperCase(),
      to: args.to.toUpperCase(),
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    console.error(`Error ${response.status}:`, body.detail || body);
    process.exit(1);
  }

  console.log(
    `${body.amount} ${body.from} = ${body.converted_amount} ${body.to} (rate: ${body.rate})`
  );
}

main().catch((err) => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
