import { test } from "node:test";
import assert from "node:assert/strict";
import { routeQuery } from "../router.mjs";

test("NRIC query routes to pii-sensitive", () => {
  const result = routeQuery("My NRIC is S9812345A, what reliefs apply?");
  assert.equal(result.model, "claude-haiku-4-5-20251001");
  assert.equal(result.reason, "pii-sensitive");
});

test("UEN query routes to pii-sensitive", () => {
  const result = routeQuery("My company UEN is 200312345A, how do I file GST?");
  assert.equal(result.model, "claude-haiku-4-5-20251001");
  assert.equal(result.reason, "pii-sensitive");
});

test("Personalised advice query routes to personalised-advice", () => {
  const result = routeQuery("Should I contribute to my SRS account this year?");
  assert.equal(result.model, "claude-haiku-4-5-20251001");
  assert.equal(result.reason, "personalised-advice");
});

test("Factual lookup query routes to gpt-4o-mini", () => {
  const result = routeQuery("What is the personal income tax rate for 2024?");
  assert.equal(result.provider, "openai");
  assert.equal(result.model, "gpt-4o-mini");
  assert.equal(result.reason, "factual-lookup");
});

test("Unmatched query routes to default", () => {
  const result = routeQuery("Tell me about IRAS");
  assert.equal(result.model, "claude-haiku-4-5-20251001");
  assert.equal(result.reason, "default");
});
