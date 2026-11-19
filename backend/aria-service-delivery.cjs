"use strict";

const { randomUUID } = require("node:crypto");

const SERVICE_MODULES = Object.freeze([
  { id: "ARIA-SVC-INTAKE", name: "مرکز پذیرش و ارزیابی درخواست", engine: "Service Intake & Qualification Engine", deliverable: "پرونده درخواست با دامنه، نیاز و معیار پذیرش", revenueModel: "اشتراک فضای کار", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-PROPOSAL", name: "سازنده پیشنهاد و برآورد خدمت", engine: "Scope & Quote Composition Engine", deliverable: "پیشنهاد نسخه‌دار با ریز اقلام و مبلغ شفاف", revenueModel: "اعتبار تولید سند یا اشتراک", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-DELIVERY", name: "مرکز تحویل و مدیریت مراحل", engine: "Milestone & Deliverable Orchestration Engine", deliverable: "برنامه مراحل، مسئول و اقلام تحویل", revenueModel: "اشتراک تیمی", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-QUALITY", name: "مرکز تضمین کیفیت و پذیرش", engine: "Evidence-based Quality Gate Engine", deliverable: "چک‌لیست آزمون و گزارش پذیرش مستند", revenueModel: "اشتراک حرفه‌ای", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-SUPPORT", name: "مرکز پشتیبانی و تعهد خدمت", engine: "Service Obligation & Support Engine", deliverable: "پرونده پشتیبانی و تعهدات پاسخ‌گویی", revenueModel: "اشتراک پشتیبانی", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-SUCCESS", name: "مرکز موفقیت و تمدید مشتری", engine: "Customer Outcome & Renewal Engine", deliverable: "گزارش استفاده، نتیجه و موعد تمدید", revenueModel: "اشتراک فضای کار", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-PACKAGES", name: "استودیوی بسته‌های خدمت و گردش‌کار", engine: "Reusable Service Package Engine", deliverable: "قالب خدمت نسخه‌دار و گردش‌کار قابل تکرار", revenueModel: "اشتراک و فروش قالب", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" },
  { id: "ARIA-SVC-UNIT-ECONOMICS", name: "مرکز هزینه و سودآوری خدمت", engine: "Service Unit Economics Engine", deliverable: "گزارش هزینه، درآمد پلتفرمی و حاشیه مشارکت", revenueModel: "اشتراک تحلیل", ownerProduct: "ARIA", productionVerified: false, persistenceState: "DATABASE_REQUIRED" }
].map(Object.freeze));

const MODULE_BY_ID = new Map(SERVICE_MODULES.map(module => [module.id, module]));

const TRANSITIONS = Object.freeze({
  INTAKE_PENDING: { QUALIFY: "QUALIFIED", REJECT: "CLOSED_REJECTED" },
  QUALIFIED: { ISSUE_QUOTE: "QUOTE_PENDING_APPROVAL" },
  QUOTE_PENDING_APPROVAL: { APPROVE_QUOTE: "QUOTE_ACCEPTED", DECLINE_QUOTE: "CLOSED_DECLINED" },
  QUOTE_ACCEPTED: { START_DELIVERY: "IN_PROGRESS" },
  IN_PROGRESS: { SUBMIT_QA: "QA_PENDING" },
  QA_PENDING: { PASS_QA: "READY_FOR_DELIVERY", FAIL_QA: "IN_PROGRESS" },
  READY_FOR_DELIVERY: { DELIVER: "DELIVERED" },
  DELIVERED: { OPEN_SUPPORT: "SUPPORT_OPEN", CLOSE_CASE: "CLOSED" },
  SUPPORT_OPEN: { RESOLVE_SUPPORT: "CLOSED" }
});

function createServiceCase(input, actor) {
  const module = MODULE_BY_ID.get(input?.moduleId);
  if (!module) throw new Error("SERVICE_MODULE_UNKNOWN");
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const scope = typeof input.scope === "string" ? input.scope.trim() : "";
  const customerRef = typeof input.customerRef === "string" ? input.customerRef.trim() : "";
  const userId = actor && actor.userId != null ? String(actor.userId) : "";
  const tenantId = actor && actor.tenantId != null ? String(actor.tenantId) : "";
  if (title.length < 3 || title.length > 160 || scope.length < 8 || scope.length > 3000 ||
      customerRef.length < 1 || customerRef.length > 160 || !userId || !tenantId) {
    throw new Error("SERVICE_CASE_INPUT_INVALID");
  }
  const now = new Date().toISOString();
  return {
    id: randomUUID(), moduleId: module.id, moduleName: module.name, ownerProduct: module.ownerProduct,
    title, customerRef, scope, tenantId, createdBy: userId, status: "INTAKE_PENDING",
    transitions: [{ action: "CREATE", from: null, to: "INTAKE_PENDING", actorId: userId, at: now }],
    externalExecutionPerformed: false, paymentExecuted: false, productionVerified: false,
    createdAt: now, updatedAt: now
  };
}

function transitionServiceCase(serviceCase, action, actor) {
  if (!serviceCase || !MODULE_BY_ID.has(serviceCase.moduleId) || typeof action !== "string") {
    throw new Error("SERVICE_CASE_INVALID");
  }
  if (!actor || !actor.userId || !actor.tenantId ||
      String(serviceCase.tenantId) !== String(actor.tenantId)) {
    throw new Error("SERVICE_TENANT_ACCESS_DENIED");
  }
  const next = TRANSITIONS[serviceCase.status]?.[action];
  if (!next) throw new Error("SERVICE_TRANSITION_NOT_ALLOWED");
  if (action === "APPROVE_QUOTE" && !(actor && actor.isOwner === true)) {
    throw new Error("OWNER_APPROVAL_REQUIRED");
  }
  const actorId = actor && actor.userId != null ? String(actor.userId) : "";
  if (!actorId) throw new Error("SERVICE_ACTOR_REQUIRED");
  const now = new Date().toISOString();
  return {
    ...serviceCase, status: next, updatedAt: now,
    transitions: [...serviceCase.transitions, { action, from: serviceCase.status, to: next, actorId, at: now }]
  };
}

function buildQuote(input) {
  const currency = typeof input?.currency === "string" ? input.currency.trim().toUpperCase() : "";
  const lines = input?.lines;
  const discount = input?.discount === undefined ? 0 : input.discount;
  if (!/^[A-Z]{3}$/.test(currency) || !Array.isArray(lines) || lines.length < 1 || lines.length > 50 ||
      typeof discount !== "number" || !Number.isFinite(discount) || discount < 0) {
    throw new Error("QUOTE_INPUT_INVALID");
  }
  let subtotal = 0;
  const normalizedLines = lines.map(line => {
    const description = typeof line.description === "string" ? line.description.trim() : "";
    const quantity = line.quantity, unitPrice = line.unitPrice;
    if (!description || description.length > 240 || typeof quantity !== "number" ||
        !Number.isFinite(quantity) || quantity <= 0 || quantity > 1e6 ||
        typeof unitPrice !== "number" || !Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 1e12) {
      throw new Error("QUOTE_INPUT_INVALID");
    }
    const amount = quantity * unitPrice;
    if (!Number.isFinite(amount) || amount > 1e15) throw new Error("QUOTE_INPUT_INVALID");
    subtotal += amount;
    return { description, quantity, unitPrice, amount };
  });
  if (!Number.isFinite(subtotal) || discount > subtotal) throw new Error("QUOTE_INPUT_INVALID");
  return {
    currency, lines: normalizedLines, subtotal, discount, total: subtotal - discount,
    paymentExecuted: false, state: "QUOTE_DRAFT", disclaimer: "این برآورد محلی است؛ صورتحساب یا پرداخت واقعی ایجاد نشده است."
  };
}

function evaluateDeliveryQuality(input) {
  const checklist = input?.checklist;
  if (!Array.isArray(checklist) || checklist.length < 1 || checklist.length > 50) {
    throw new Error("QUALITY_CHECKLIST_INVALID");
  }
  const normalized = checklist.map(item => {
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!name || name.length > 200 || typeof item.passed !== "boolean") {
      throw new Error("QUALITY_CHECKLIST_INVALID");
    }
    const evidence = typeof item.evidence === "string" ? item.evidence.trim() : "";
    return { name, passed: item.passed, evidence };
  });
  const failedChecks = normalized.filter(item => !item.passed || !item.evidence);
  const passed = failedChecks.length === 0;
  return {
    passed, deliverable: passed, checklist: normalized, failedChecks,
    state: passed ? "QUALITY_PASSED" : "QUALITY_REVIEW_REQUIRED",
    productionVerified: false
  };
}


function createSupportTicket(input, actor) {
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  const description = typeof input?.description === "string" ? input.description.trim() : "";
  const priority = input?.priority;
  const responseHours = input?.responseHours;
  const userId = actor && actor.userId != null ? String(actor.userId) : "";
  const tenantId = actor && actor.tenantId != null ? String(actor.tenantId) : "";
  const serviceCaseId = typeof input?.serviceCaseId === "string" ? input.serviceCaseId.trim() : "";
  if (!userId || !tenantId || !serviceCaseId || title.length < 3 || title.length > 160 ||
      description.length < 8 || description.length > 3000 ||
      !["low", "normal", "high"].includes(priority) ||
      typeof responseHours !== "number" || !Number.isFinite(responseHours) || responseHours < 1 || responseHours > 720) {
    throw new Error("SUPPORT_TICKET_INPUT_INVALID");
  }
  const now = new Date();
  return {
    id: randomUUID(), serviceCaseId, tenantId, createdBy: userId, title, description, priority,
    status: "OPEN", responseTargetAt: new Date(now.getTime() + responseHours * 3600000).toISOString(),
    responseHours, externalNotificationSent: false, paymentExecuted: false,
    createdAt: now.toISOString(), productionVerified: false
  };
}

function evaluateCustomerSuccess(input) {
  const { period, activeDays, completedTasks, targetTasks, unresolvedTickets } = input || {};
  if (typeof period !== "string" || !/^\d{4}-\d{2}$/.test(period) ||
      !Number.isInteger(activeDays) || activeDays < 0 || activeDays > 31 ||
      !Number.isInteger(completedTasks) || completedTasks < 0 ||
      !Number.isInteger(targetTasks) || targetTasks < 0 ||
      !Number.isInteger(unresolvedTickets) || unresolvedTickets < 0) {
    throw new Error("CUSTOMER_SUCCESS_INPUT_INVALID");
  }
  let health = "NEEDS_ATTENTION";
  if (unresolvedTickets >= 3 || activeDays < 3) health = "AT_RISK";
  else if (activeDays >= 10 && completedTasks >= targetTasks) health = "HEALTHY";
  return {
    period, activeDays, completedTasks, targetTasks, unresolvedTickets, health,
    renewalDecision: "OWNER_REVIEW_REQUIRED", renewalExecuted: false,
    evidenceBasis: ["activeDays", "completedTasks", "targetTasks", "unresolvedTickets"],
    productionVerified: false,
    evidenceQuality: "USER_PROVIDED_METRICS_NOT_INDEPENDENTLY_VERIFIED"
  };
}

function createServicePackage(input, actor) {
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const version = input?.version;
  const serviceModuleIds = input?.serviceModuleIds;
  const steps = input?.steps;
  const currency = typeof input?.currency === "string" ? input.currency.trim().toUpperCase() : "";
  const userId = actor && actor.userId != null ? String(actor.userId) : "";
  const tenantId = actor && actor.tenantId != null ? String(actor.tenantId) : "";
  if (!userId || !tenantId || name.length < 3 || name.length > 120 ||
      !Number.isInteger(version) || version < 1 ||
      !Array.isArray(serviceModuleIds) || serviceModuleIds.length < 1 || serviceModuleIds.length > 8 ||
      !serviceModuleIds.every(id => MODULE_BY_ID.has(id)) ||
      !Array.isArray(steps) || steps.length < 1 || steps.length > 30 ||
      !steps.every(step => typeof step === "string" && step.trim().length >= 3 && step.trim().length <= 200) ||
      !/^[A-Z]{3}$/.test(currency)) {
    throw new Error("SERVICE_PACKAGE_INPUT_INVALID");
  }
  return {
    id: randomUUID(), tenantId, createdBy: userId, name, version,
    serviceModuleIds: [...new Set(serviceModuleIds)],
    steps: steps.map(step => step.trim()), currency,
    state: "DRAFT", entitlementActivated: false, paymentExecuted: false,
    externalExecutionPerformed: false, createdAt: new Date().toISOString(),
    productionVerified: false
  };
}

function calculateServiceUnitEconomics(input) {
  const currency = typeof input?.currency === "string" ? input.currency.trim().toUpperCase() : "";
  const platformRevenue = input?.platformRevenue;
  const principalFunds = input?.principalFunds;
  const costs = input?.costs;
  const costKeys = ["provider", "model", "storage", "support", "payment"];
  if (!/^[A-Z]{3}$/.test(currency) ||
      typeof platformRevenue !== "number" || !Number.isFinite(platformRevenue) || platformRevenue < 0 ||
      typeof principalFunds !== "number" || !Number.isFinite(principalFunds) || principalFunds < 0 ||
      !costs || typeof costs !== "object" || Array.isArray(costs) ||
      costKeys.some(key => costs[key] !== undefined && (typeof costs[key] !== "number" || !Number.isFinite(costs[key]) || costs[key] < 0))) {
    throw new Error("UNIT_ECONOMICS_INPUT_INVALID");
  }
  const normalizedCosts = Object.fromEntries(costKeys.map(key => [key, costs[key] || 0]));
  const totalCost = costKeys.reduce((sum, key) => sum + normalizedCosts[key], 0);
  if (!Number.isFinite(totalCost)) throw new Error("UNIT_ECONOMICS_INPUT_INVALID");
  const contributionMargin = platformRevenue - totalCost;
  return {
    currency, recognizedPlatformRevenue: platformRevenue, principalExcluded: principalFunds,
    costs: normalizedCosts, totalCost, contributionMargin,
    contributionMarginPercent: platformRevenue === 0 ? null : Math.round((contributionMargin / platformRevenue) * 10000) / 100,
    principalRevenueRecognized: false, paymentExecuted: false,
    revenueRecognitionState: "CALCULATED_FROM_INPUTS_NOT_LEDGER_VERIFIED",
    productionVerified: false
  };
}


function evaluateSupportSla(ticket, now = new Date()) {
  if (!ticket || typeof ticket.responseTargetAt !== "string" || !Number.isFinite(new Date(ticket.responseTargetAt).getTime()) ||
      !(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new Error("SUPPORT_SLA_INPUT_INVALID");
  }
  if (["RESOLVED", "CLOSED"].includes(ticket.status)) return { state: "RESOLVED", evaluatedAt: now.toISOString(), responseTargetAt: ticket.responseTargetAt };
  const overdue = now.getTime() > new Date(ticket.responseTargetAt).getTime();
  return { state: overdue ? "OVERDUE" : "ON_TRACK", evaluatedAt: now.toISOString(), responseTargetAt: ticket.responseTargetAt };
}

function transitionSupportTicket(ticket, action, actor) {
  if (!ticket || !ticket.id || !ticket.tenantId || !actor || !actor.userId) {
    throw new Error("SUPPORT_TICKET_INVALID");
  }
  if (!actor.tenantId || String(ticket.tenantId) !== String(actor.tenantId)) {
    throw new Error("SUPPORT_TENANT_ACCESS_DENIED");
  }
  const transitions = {
    OPEN: { START_WORK: "IN_PROGRESS" },
    IN_PROGRESS: { WAIT_FOR_CUSTOMER: "WAITING_CUSTOMER", RESOLVE: "RESOLVED" },
    WAITING_CUSTOMER: { RESUME: "IN_PROGRESS", RESOLVE: "RESOLVED" },
    RESOLVED: { REOPEN: "REOPENED" },
    REOPENED: { START_WORK: "IN_PROGRESS" }
  };
  const next = transitions[ticket.status]?.[action];
  if (!next) throw new Error("SUPPORT_TRANSITION_NOT_ALLOWED");
  const at = new Date().toISOString();
  return {
    ...ticket, status: next,
    transitions: [...(ticket.transitions || []), { action, from: ticket.status, to: next, actorId: String(actor.userId), at }]
  };
}

function approveCustomerRenewal(report, actor) {
  if (!report || report.renewalDecision !== "OWNER_REVIEW_REQUIRED") throw new Error("CUSTOMER_SUCCESS_REPORT_INVALID");
  if (!actor || actor.isOwner !== true || !actor.userId) throw new Error("OWNER_APPROVAL_REQUIRED");
  return {
    ...report, renewalDecision: "OWNER_APPROVED_RECOMMENDATION",
    renewalApprovedBy: String(actor.userId), renewalApprovedAt: new Date().toISOString(),
    renewalExecuted: false, paymentExecuted: false
  };
}

function transitionServicePackage(servicePackage, action, actor) {
  if (!servicePackage || !servicePackage.id || !servicePackage.tenantId || !actor || !actor.userId) {
    throw new Error("SERVICE_PACKAGE_INVALID");
  }
  if (!actor.tenantId || String(servicePackage.tenantId) !== String(actor.tenantId)) {
    throw new Error("SERVICE_PACKAGE_TENANT_ACCESS_DENIED");
  }
  const transitions = {
    DRAFT: { SUBMIT_REVIEW: "REVIEW_PENDING" },
    REVIEW_PENDING: { APPROVE: "APPROVED", REJECT: "DRAFT" },
    APPROVED: { PUBLISH_LOCAL: "PUBLISHED_LOCAL" },
    PUBLISHED_LOCAL: { ARCHIVE: "ARCHIVED" }
  };
  const next = transitions[servicePackage.state]?.[action];
  if (!next) throw new Error("SERVICE_PACKAGE_TRANSITION_NOT_ALLOWED");
  if (["APPROVE", "PUBLISH_LOCAL", "ARCHIVE"].includes(action) && actor.isOwner !== true) {
    throw new Error("OWNER_APPROVAL_REQUIRED");
  }
  const at = new Date().toISOString();
  return {
    ...servicePackage, state: next,
    transitions: [...(servicePackage.transitions || []), { action, from: servicePackage.state, to: next, actorId: String(actor.userId), at }],
    entitlementActivated: false, externalExecutionPerformed: false, paymentExecuted: false
  };
}

module.exports = {
  createSupportTicket, evaluateSupportSla, transitionSupportTicket, evaluateCustomerSuccess, approveCustomerRenewal, createServicePackage, transitionServicePackage, calculateServiceUnitEconomics,
  SERVICE_MODULES, createServiceCase, transitionServiceCase, buildQuote, evaluateDeliveryQuality
};
