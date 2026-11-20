"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createSupportTicket,
  evaluateCustomerSuccess,
  createServicePackage,
  calculateServiceUnitEconomics
} = require("../backend/aria-service-delivery.cjs");

test("support ticket records ownership, priority and SLA target without sending external messages", () => {
  const ticket = createSupportTicket({
    serviceCaseId: "case-1", title: "پیگیری تحویل", description: "نیاز به بررسی وضعیت خروجی", priority: "normal", responseHours: 24
  }, { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(ticket.status, "OPEN");
  assert.equal(ticket.tenantId, "tenant-1");
  assert.equal(ticket.externalNotificationSent, false);
  assert.throws(() => createSupportTicket({ title: "x", description: "شرح", priority: "urgent" }, { userId: "u", tenantId: "t" }), /SUPPORT_TICKET_INPUT_INVALID/);
});

test("customer success evaluation requires measurable inputs and never auto-renews", () => {
  const result = evaluateCustomerSuccess({
    period: "2026-11", activeDays: 12, completedTasks: 30, targetTasks: 25, unresolvedTickets: 1
  }, { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(result.health, "HEALTHY");
  assert.equal(result.renewalDecision, "OWNER_REVIEW_REQUIRED");
  assert.equal(result.renewalExecuted, false);
  assert.throws(() => evaluateCustomerSuccess({ activeDays: -1 }), /CUSTOMER_SUCCESS_INPUT_INVALID/);
});

test("service package validates included service modules and creates versioned reusable template", () => {
  const pack = createServicePackage({
    name: "بسته راه‌اندازی محتوا", version: 1, serviceModuleIds: ["ARIA-SVC-INTAKE", "ARIA-SVC-DELIVERY"],
    steps: ["دریافت brief", "تحویل نسخه نخست"], currency: "IRR"
  }, { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(pack.version, 1);
  assert.equal(pack.serviceModuleIds.length, 2);
  assert.equal(pack.entitlementActivated, false);
  assert.throws(() => createServicePackage({ name: "بسته", version: 0, serviceModuleIds: ["UNKNOWN"], steps: ["گام"], currency: "IRR" }, { userId: "u", tenantId: "t" }), /SERVICE_PACKAGE_INPUT_INVALID/);
});

test("unit economics separates platform revenue from principal and exposes margin calculation", () => {
  const report = calculateServiceUnitEconomics({
    currency: "IRR", platformRevenue: 100000, principalFunds: 900000,
    costs: { provider: 20000, model: 10000, storage: 5000, support: 5000, payment: 2000 }
  });
  assert.equal(report.totalCost, 42000);
  assert.equal(report.contributionMargin, 58000);
  assert.equal(report.recognizedPlatformRevenue, 100000);
  assert.equal(report.principalExcluded, 900000);
  assert.equal(report.paymentExecuted, false);
  assert.throws(() => calculateServiceUnitEconomics({ currency: "IRR", platformRevenue: -1, principalFunds: 0, costs: {} }), /UNIT_ECONOMICS_INPUT_INVALID/);
});

test("support SLA is evaluated from stored target and ticket lifecycle is auditable", () => {
  const { createSupportTicket, evaluateSupportSla, transitionSupportTicket } = require("../backend/aria-service-delivery.cjs");
  const ticket = createSupportTicket({
    serviceCaseId: "case-1", title: "پیگیری", description: "شرح کافی برای پیگیری", priority: "high", responseHours: 1
  }, { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(evaluateSupportSla(ticket, new Date(Date.now() + 2 * 3600000)).state, "OVERDUE");
  const active = transitionSupportTicket(ticket, "START_WORK", { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(active.status, "IN_PROGRESS");
  const resolved = transitionSupportTicket(active, "RESOLVE", { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(resolved.status, "RESOLVED");
  assert.throws(() => transitionSupportTicket(ticket, "RESOLVE", { userId: "user-1", tenantId: "tenant-1" }), /SUPPORT_TRANSITION_NOT_ALLOWED/);
});

test("customer renewal requires owner approval and never executes a charge", () => {
  const { evaluateCustomerSuccess, approveCustomerRenewal } = require("../backend/aria-service-delivery.cjs");
  const report = evaluateCustomerSuccess({
    period: "2026-11", activeDays: 12, completedTasks: 30, targetTasks: 25, unresolvedTickets: 1
  });
  assert.throws(() => approveCustomerRenewal(report, { userId: "user-1", tenantId: "tenant-1" }), /OWNER_APPROVAL_REQUIRED/);
  const approved = approveCustomerRenewal(report, { userId: "owner-1", isOwner: true, tenantId: "tenant-1" });
  assert.equal(approved.renewalDecision, "OWNER_APPROVED_RECOMMENDATION");
  assert.equal(approved.renewalExecuted, false);
});

test("service package lifecycle requires owner approval before local catalog publication", () => {
  const { createServicePackage, transitionServicePackage } = require("../backend/aria-service-delivery.cjs");
  const pack = createServicePackage({
    name: "بسته محتوا", version: 1, serviceModuleIds: ["ARIA-SVC-INTAKE"], steps: ["دریافت brief"], currency: "IRR"
  }, { userId: "user-1", tenantId: "tenant-1" });
  const review = transitionServicePackage(pack, "SUBMIT_REVIEW", { userId: "user-1", tenantId: "tenant-1" });
  assert.equal(review.state, "REVIEW_PENDING");
  assert.throws(() => transitionServicePackage(review, "APPROVE", { userId: "user-1", tenantId: "tenant-1" }), /OWNER_APPROVAL_REQUIRED/);
  const approved = transitionServicePackage(review, "APPROVE", { userId: "owner-1", isOwner: true, tenantId: "tenant-1" });
  const published = transitionServicePackage(approved, "PUBLISH_LOCAL", { userId: "owner-1", isOwner: true, tenantId: "tenant-1" });
  assert.equal(published.state, "PUBLISHED_LOCAL");
  assert.equal(published.entitlementActivated, false);
  assert.equal(published.externalExecutionPerformed, false);
});
