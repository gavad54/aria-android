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

module.exports = {
  SERVICE_MODULES, createServiceCase, transitionServiceCase, buildQuote, evaluateDeliveryQuality
};
