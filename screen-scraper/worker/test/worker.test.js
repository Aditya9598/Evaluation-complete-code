import { spawn } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";
import { runScorer } from "../worker.js";

test("runScorer uses stdin pipe not shell", async () => {
  const mockBin = process.execPath;
  const mockScript = `
    const chunks = [];
    process.stdin.on('data', c => chunks.push(c));
    process.stdin.on('end', () => {
      const input = JSON.parse(Buffer.concat(chunks).toString());
      console.log(JSON.stringify({
        contract_version: '1.0',
        job_id: input.job_id,
        relevance_score: 50,
        risk_score: 10,
        reasons: ['market_keywords']
      }));
    });
  `;

  const score = await runScorer(
    {
      contract_version: "1.0",
      job_id: "job-mock",
      title: "Nifty rally",
      body: "market stock",
      source: "economic_times",
    },
    mockBin,
    ["-e", mockScript]
  );

  assert.equal(score.job_id, "job-mock");
  assert.equal(score.relevance_score, 50);
});

test("runScorer rejects invalid contract from real scorer when built", async (t) => {
  const scorerPath = new URL("../../scorer/target/debug/scorer", import.meta.url).pathname;
  t.skip(!process.env.RUN_SCORER_INTEGRATION, "set RUN_SCORER_INTEGRATION=1 to run");
  await assert.rejects(() =>
    runScorer(
      {
        contract_version: "2.0",
        job_id: "job-bad",
        title: "Test",
        body: "",
        source: "economic_times",
      },
      scorerPath
    )
  );
});
