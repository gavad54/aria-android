"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const serviceDelivery = require("../../aria-service-delivery.cjs");
const base = createDomainModule({
  moduleId: "ARIA-SVC-SUCCESS",
  moduleType: "SERVICE_DELIVERY_ENGINE",
  name: "مرکز موفقیت و تمدید مشتری",
  engine: "Customer Outcome & Renewal Engine",
  domain: "service-delivery",
  description: "ارزیابی سلامت مشتری از شاخص‌های دوره‌ای؛ تمدید خودکار انجام نمی‌شود.",
  sourceLineage: "docs/ARIA_SERVICE_DELIVERY_IMPLEMENTATION_2026-11-19_FA.md",
  parentModuleIds: ["ARIA-SVC-INTAKE", "ARIA-SVC-PROPOSAL", "ARIA-SVC-DELIVERY", "ARIA-SVC-QUALITY"],
  inputContract: ["period","activeDays","completedTasks","targetTasks","unresolvedTickets"],
  requiredInputs: ["period","activeDays","completedTasks","targetTasks","unresolvedTickets"],
  outputContract: ["serviceResult", "status", "auditRecord"],
  operations: ["validate_input", "authorize_tenant_and_role", "evaluateCustomerSuccess", "record_audit_and_outcome"],
  accessPolicy: ["tenant_isolation", "least_privilege", "audit_log"],
  productionVerified: false
});
async function execute(input, context) {
  const preflight = await base.execute(input, context);
  const serviceResult = serviceDelivery.evaluateCustomerSuccess(input, { userId: String(context.actorId), tenantId: String(context.tenantId) });
  return {
    ...preflight,
    artifact: { ...preflight.artifact, serviceResult },
    output: { ...preflight.output, serviceResult },
    status: "LOCAL_RESULT_READY",
    externalExecutionPerformed: false,
    paymentExecuted: false,
    productionVerified: false
  };
}
module.exports = Object.freeze({ ...base, execute });
