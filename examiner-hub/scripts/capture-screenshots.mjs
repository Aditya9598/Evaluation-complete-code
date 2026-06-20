import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../docs/assets/screenshots");
const BASE = "https://evaluation-complete-code-production.up.railway.app";

const shots = [
  { name: "hub-overview", url: `${BASE}/`, wait: 1500 },
  { name: "hub-ledger", url: `${BASE}/#ledger`, wait: 3500 },
  { name: "hub-converter", url: `${BASE}/#converter`, wait: 3500 },
  { name: "hub-fraud", url: `${BASE}/#fraud`, wait: 3500 },
  { name: "hub-scraper", url: `${BASE}/#scraper`, wait: 3500 },
  { name: "ledger-dashboard", url: `${BASE}/ledger/`, wait: 2500 },
  { name: "converter-ui", url: `${BASE}/converter/`, wait: 2500 },
  { name: "fraud-ui", url: `${BASE}/fraud/ui/`, wait: 2500 },
  { name: "scraper-ops", url: `${BASE}/scraper/ops`, wait: 4000 },
  { name: "ledger-users", url: `${BASE}/ledger/users`, wait: 2500 },
  { name: "ledger-transactions", url: `${BASE}/ledger/transactions`, wait: 2500 },
  { name: "converter-er-diagram", url: `${BASE}/converter/er-diagram`, wait: 2500 },
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

for (const shot of shots) {
  console.log(`Capturing ${shot.name}...`);
  await page.goto(shot.url, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, shot.wait));
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: false,
  });
}

await browser.close();
console.log("Done:", OUT);
