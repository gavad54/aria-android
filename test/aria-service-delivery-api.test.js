"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");

test("service delivery catalog is discoverable and never advertises live execution", async () => {
  const port = 35000 + Math.floor(Math.random() * 1000);
  const env = { ...process.env, PORT: String(port) };
  delete env.DATABASE_URL; delete env.ARIA_JWT_SECRET; delete env.OPENAI_API_KEY;
  const child = spawn(process.execPath, ["server.js"], { env, stdio: "ignore" });
  const base = "http://127.0.0.1:" + port;
  try {
    let started = false;
    for (let i = 0; i < 60; i++) {
      try { const response = await fetch(base + "/health"); if (response.ok) { started = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(started, true, "server should start");
    const moduleCatalogResponse = await fetch(base + "/api/aria-modules/catalog");
    const moduleCatalog = await moduleCatalogResponse.json();
    assert.equal(moduleCatalogResponse.status, 200);
    assert.equal(moduleCatalog.independentBackendModuleCount, 201);
    assert.deepEqual(moduleCatalog.counts, { ideas: 50, governanceControls: 4, commercialCatalog: 72, childEngines: 71, serviceDeliveryEngines: 4 });
    assert.equal(new Set(moduleCatalog.modules.map(x => x.moduleId)).size, 201);
    assert.equal(moduleCatalog.productionVerifiedCount, 0);
    const unauthorizedModuleRun = await fetch(base + "/api/aria-modules/ARIA-IDEA-BACKLOG-001/execute", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": "unauth-test-0001" }, body: JSON.stringify({ goal: "test", context: {} }) });
    assert.equal(unauthorizedModuleRun.status, 401);
    const unauthAction = await fetch(base + "/api/aria-modules/ARIA-SVC-SUPPORT/work-items/00000000-0000-4000-8000-000000000001/actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "START_WORK" }) });
    assert.equal(unauthAction.status, 401, "service lifecycle actions must require authentication");
    const catalogResponse = await fetch(base + "/api/aria-expansion/service-delivery/catalog");
    const catalog = await catalogResponse.json();
    assert.equal(catalogResponse.status, 200);
    assert.equal(catalog.modules.length, 8);
    assert.equal(catalog.productionVerified, false);
    assert.equal(catalog.paymentExecuted, false);
    assert.equal(catalog.externalExecutionPerformed, false);
    const adapterCoverageResponse = await fetch(base + "/api/aria-expansion/adapter-runtime");
    const adapterCoverage = await adapterCoverageResponse.json();
    assert.equal(adapterCoverageResponse.status, 200);
    assert.equal(adapterCoverage.totalRequirements, 191);
    assert.equal(adapterCoverage.familyCount, 14);
    assert.equal(adapterCoverage.mappedModuleCount, 191);
    assert.equal(adapterCoverage.providerConfiguredCount, 0);
    assert.equal(adapterCoverage.productionVerifiedCount, 0);
    assert.ok(adapterCoverage.families.every(x => x.providerState === "NOT_CONFIGURED_FAIL_CLOSED" && x.productionEnabled === false));
    const adapterModuleResponse = await fetch(base + "/api/aria-expansion/adapter-runtime/modules/633");
    const adapterModule = await adapterModuleResponse.json();
    assert.equal(adapterModuleResponse.status, 200);
    assert.equal(adapterModule.moduleId, 633);
    assert.equal(adapterModule.family, "PAYMENT_AND_FINANCIAL_RAILS");
    assert.equal(adapterModule.productionVerified, false);
    const unknownAdapterModule = await fetch(base + "/api/aria-expansion/adapter-runtime/modules/9999");
    assert.equal(unknownAdapterModule.status, 404);
    const privateCases = await fetch(base + "/api/aria-expansion/service-cases");
    assert.equal(privateCases.status, 401, "service cases must require authentication");
    const createAttempt = await fetch(base + "/api/aria-expansion/service-cases", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ moduleId: "ARIA-SVC-INTAKE", title: "درخواست خدمت", customerRef: "x", scope: "شرح درخواست آزمایشی" })
    });
    assert.equal(createAttempt.status, 401, "unauthenticated users must not create service cases");
  } finally {
    await new Promise(resolve => {
      if (child.exitCode !== null || child.signalCode !== null) return resolve();
      child.once("exit", resolve);
      child.kill();
    });
  }
});
