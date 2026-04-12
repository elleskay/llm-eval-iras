import { writeFileSync, mkdirSync } from "node:fs";
import { routeQuery } from "./router.mjs";

const queries = [
  "My NRIC is S9812345A, what is my tax relief eligibility?",
  "My UEN is 200312345A, how do I file GST?",
  "Should I opt for SRS contributions this year?",
  "What is the current personal income tax rate for residents?",
  "Tell me about IRAS",
];

const decisions = queries.map((query) => {
  const result = routeQuery(query);
  return { query, ...result };
});

// Print table
const COL_QUERY = 60;
const COL_MODEL = 28;
const COL_REASON = 20;

const pad = (str, len) => str.slice(0, len).padEnd(len);
const divider = `${"─".repeat(COL_QUERY + 2)}┼${"─".repeat(COL_MODEL + 2)}┼${"─".repeat(COL_REASON + 2)}`;

console.log();
console.log(
  ` ${pad("Query", COL_QUERY)} │ ${pad("Routed to", COL_MODEL)} │ ${pad("Reason", COL_REASON)}`
);
console.log(divider);
for (const d of decisions) {
  console.log(
    ` ${pad(d.query, COL_QUERY)} │ ${pad(`${d.provider}/${d.model}`, COL_MODEL)} │ ${pad(d.reason, COL_REASON)}`
  );
}
console.log();

// Save routing log
mkdirSync("output", { recursive: true });
const logPath = "output/routing-log.json";
writeFileSync(
  logPath,
  JSON.stringify({ generated: new Date().toISOString(), decisions }, null, 2)
);
console.log(`Routing log saved → ${logPath}`);
