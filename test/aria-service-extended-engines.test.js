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
  });
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
