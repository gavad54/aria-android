"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  SERVICE_MODULES,
  createServiceCase,
  transitionServiceCase,
  buildQuote,
  evaluateDeliveryQuality,
  createSupportTicket,
  transitionSupportTicket,
  createServicePackage,
  transitionServicePackage,
  evaluateCustomerSuccess,
  approveCustomerRenewal
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
  assert.throws(() => transitionServiceCase(item, "START_DELIVERY", { userId: "42", tenantId: "tenant-1" }), /SERVICE_TRANSITION_NOT_ALLOWED/);
  const qualified = transitionServiceCase(item, "QUALIFY", { userId: "42", tenantId: "tenant-1" });
  assert.equal(qualified.status, "QUALIFIED");
  const quoted = transitionServiceCase(qualified, "ISSUE_QUOTE", { userId: "42", tenantId: "tenant-1" });
  assert.equal(quoted.status, "QUOTE_PENDING_APPROVAL");
  assert.throws(() => transitionServiceCase(quoted, "APPROVE_QUOTE", { userId: "42", tenantId: "tenant-1" }), /OWNER_APPROVAL_REQUIRED/);
  const accepted = transitionServiceCase(quoted, "APPROVE_QUOTE", { userId: "owner-1", isOwner: true, tenantId: "tenant-1" });
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


test("service case transitions reject missing or cross-tenant actor context", () => {
  const item = createServiceCase({
    moduleId: "ARIA-SVC-INTAKE", title: "تهیه بسته محتوایی",
    customerRef: "customer-1", scope: "تقویم و ده محتوای شبکه اجتماعی"
  }, { userId: "42", tenantId: "tenant-1" });
  assert.throws(() => transitionServiceCase(item, "QUALIFY", { userId: "42" }), /SERVICE_TENANT_ACCESS_DENIED/);
  assert.throws(() => transitionServiceCase(item, "QUALIFY", { userId: "42", tenantId: "tenant-2" }), /SERVICE_TENANT_ACCESS_DENIED/);
  assert.equal(transitionServiceCase(item, "QUALIFY", { userId: "42", tenantId: "tenant-1" }).status, "QUALIFIED");
});


test("support tickets and service packages enforce tenant ownership on state transitions", () => {
  const actor = { userId: "42", tenantId: "tenant-1" };
  const ticket = createSupportTicket({
    serviceCaseId: "case-1", title: "پیگیری پشتیبانی",
    description: "بررسی وضعیت تحویل خدمت", priority: "normal", responseHours: 24
  }, actor);
  assert.throws(() => transitionSupportTicket(ticket, "START_WORK", { userId: "42" }), /SUPPORT_TENANT_ACCESS_DENIED/);
  assert.throws(() => transitionSupportTicket(ticket, "START_WORK", { userId: "42", tenantId: "tenant-2" }), /SUPPORT_TENANT_ACCESS_DENIED/);
  assert.equal(transitionSupportTicket(ticket, "START_WORK", actor).status, "IN_PROGRESS");

  const servicePackage = createServicePackage({
    name: "بسته پایه", version: 1, serviceModuleIds: ["ARIA-SVC-INTAKE"],
    steps: ["دریافت درخواست"], currency: "IRR"
  }, actor);
  assert.throws(() => transitionServicePackage(servicePackage, "SUBMIT_REVIEW", { userId: "42" }), /SERVICE_PACKAGE_TENANT_ACCESS_DENIED/);
  assert.throws(() => transitionServicePackage(servicePackage, "SUBMIT_REVIEW", { userId: "42", tenantId: "tenant-2" }), /SERVICE_PACKAGE_TENANT_ACCESS_DENIED/);
  assert.equal(transitionServicePackage(servicePackage, "SUBMIT_REVIEW", actor).state, "REVIEW_PENDING");
});


test("customer success renewal approval is tenant-scoped and owner-gated", () => {
  const report = evaluateCustomerSuccess({
    period: "2026-11", activeDays: 12, completedTasks: 20,
    targetTasks: 18, unresolvedTickets: 0
  }, { userId: "staff-1", tenantId: "tenant-1" });
  assert.throws(() => approveCustomerRenewal(report, { userId: "owner-2", isOwner: true, tenantId: "tenant-2" }), /CUSTOMER_SUCCESS_TENANT_ACCESS_DENIED/);
  assert.throws(() => approveCustomerRenewal(report, { userId: "staff-1", tenantId: "tenant-1" }), /OWNER_APPROVAL_REQUIRED/);
  const approved = approveCustomerRenewal(report, { userId: "owner-1", isOwner: true, tenantId: "tenant-1" });
  assert.equal(approved.renewalDecision, "OWNER_APPROVED_RECOMMENDATION");
  assert.equal(approved.renewalExecuted, false);
  assert.equal(approved.paymentExecuted, false);
});
