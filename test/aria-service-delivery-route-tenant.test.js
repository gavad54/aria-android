"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("all persisted service-case transitions receive the authenticated tenant context", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "backend", "aria_expansion_runtime.cjs"), "utf8");
  const calls = [...source.matchAll(/transitionServiceCase\([^;]+?\);/gs)].map(match => match[0]);
  assert.equal(calls.length, 4, "quote, quality submit, quality result and explicit transition routes must be covered");
  for (const call of calls) {
    assert.match(call, /tenantId/, "every transition actor must carry the same authenticated tenant boundary");
  }
});
