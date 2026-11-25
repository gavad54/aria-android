"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");

test("production readiness fails closed when DATABASE_URL is absent", async () => {
  const port = 34000 + Math.floor(Math.random() * 1000);
  const env = { ...process.env, PORT: String(port), NODE_ENV: "production" };
  delete env.DATABASE_URL;
  delete env.ARIA_JWT_SECRET;
  delete env.OPENAI_API_KEY;
  const child = spawn(process.execPath, ["server.js"], { env, stdio: "ignore" });
  const base = "http://127.0.0.1:" + port;
  try {
    let started = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        const response = await fetch(base + "/api/health");
        if (response.ok) { started = true; break; }
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(started, true, "liveness endpoint should start without database credentials");
    const response = await fetch(base + "/api/ready");
    const body = await response.json();
    assert.equal(response.status, 503, "production readiness must not pass without a database");
    assert.equal(body.ready, false);
    assert.equal(body.database.configured, false);
    assert.equal(body.database.connected, false);
    assert.equal(body.database.errorCode, "DATABASE_URL_MISSING");
  } finally {
    await new Promise(resolve => {
      if (child.exitCode !== null || child.signalCode !== null) return resolve();
      child.once("exit", resolve);
      child.kill();
    });
  }
});
