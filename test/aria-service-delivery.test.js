"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  SERVICE_MODULES,
  createServiceCase,
  transitionServiceCase,
  buildQuote,
  evaluateDeliveryQuality
} = require("../backend/aria-service-delivery.cjs");

test("service delivery exposes eight additive commercial modules without claiming production readiness", () => {
  assert.equal(SERVICE_MODULES.length, 8);
  assert.equal(new Set(SERVICE_MODULES.map(x => x.id)).size, 8);
  assert.ok(SERVICE_MODULES.every(x => x.ownerProduct === "ARIA"));
  assert.ok(SERVICE_MODULES.every(x => x.productionVerified === false));
  assert.ok(SERVICE_MODULES.every(x => x.persistenceState === "DATABASE_REQUIRED"));
});

test("service case requires a valid module and creates a reviewable intake artifact", () => {
  const item = createServiceCase({
    moduleId: "ARIA-SVC-INTAKE",
    title: "تهیه بسته محتوایی",
    customerRef: "customer-1",
    scope: "تقویم و ده محتوای شبکه اجتماعی"
  }, { userId: "42", tenantId: "tenant-1" });
  assert.equal(item.status, "INTAKE_PENDING");
  assert.equal(item.ownerProduct, "ARIA");
  assert.equal(item.externalExecutionPerformed, false);
  assert.equal(item.tenantId, "tenant-1");
  assert.throws(() => createServiceCase({ moduleId: "UNKNOWN", title: "عنوان معتبر", scope: "شرح معتبر" }, { userId: "42", tenantId: "tenant-1" }), /SERVICE_MODULE_UNKNOWN/);
  assert.throws(() => createServiceCase({ moduleId: "ARIA-SVC-INTAKE", title: "x", scope: "شرح معتبر" }, { userId: "42", tenantId: "tenant-1" }), /SERVICE_CASE_INPUT_INVALID/);
});

test("service case state machine rejects skipped approvals and records explicit transitions", () => {
  const item = createServiceCase({
    moduleId: "ARIA-SVC-INTAKE",
    title: "تهیه بسته محتوایی",
    customerRef: "customer-1",
    scope: "تقویم و ده محتوای شبکه اجتماعی"
  }, { userId: "42", tenantId: "tenant-1" });
  assert.throws(() => transitionServiceCase(item, "START_DELIVERY", { userId: "42" }), /SERVICE_TRANSITION_NOT_ALLOWED/);
  const qualified = transitionServiceCase(item, "QUALIFY", { userId: "42" });
  assert.equal(qualified.status, "QUALIFIED");
  const quoted = transitionServiceCase(qualified, "ISSUE_QUOTE", { userId: "42" });
  assert.equal(quoted.status, "QUOTE_PENDING_APPROVAL");
  assert.throws(() => transitionServiceCase(quoted, "ACCEPT_QUOTE", { userId: "42" }), /OWNER_APPROVAL_REQUIRED/);
  const accepted = transitionServiceCase(quoted, "APPROVE_QUOTE", { userId: "owner-1", isOwner: true });
  assert.equal(accepted.status, "QUOTE_ACCEPTED");
});

test("quote calculation rejects invalid amounts and keeps currency explicit", () => {
  const quote = buildQuote({
    currency: "IRR",
    lines: [{ description: "طراحی محتوا", quantity: 2, unitPrice: 1500000 }],
    discount: 0
  });
  assert.equal(quote.subtotal, 3000000);
  assert.equal(quote.total, 3000000);
  assert.equal(quote.paymentExecuted, false);
  assert.throws(() => buildQuote({ currency: "IRR", lines: [{ description: "کار", quantity: -1, unitPrice: 10 }] }), /QUOTE_INPUT_INVALID/);
});

test("delivery quality requires explicit evidence and never marks a failed checklist delivered", () => {
  const pending = evaluateDeliveryQuality({ checklist: [{ name: "محتوا مطابق بریف", passed: true, evidence: "artifact://v1" }, { name: "تأیید مشتری", passed: false, evidence: "" }] });
  assert.equal(pending.passed, false);
  assert.equal(pending.deliverable, false);
  assert.equal(pending.failedChecks.length, 1);
  const passed = evaluateDeliveryQuality({ checklist: [{ name: "محتوا مطابق بریف", passed: true, evidence: "artifact://v1" }] });
  assert.equal(passed.passed, true);
  assert.equal(passed.deliverable, true);
});
