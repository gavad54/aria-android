"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const serviceDelivery = require("../../aria-service-delivery.cjs");
const base = createDomainModule({
  moduleId: "ARIA-SVC-PACKAGES",
  moduleType: "SERVICE_DELIVERY_ENGINE",
  name: "استودیوی بسته‌های خدمت و گردش‌کار",
  engine: "Reusable Service Package Engine",
  domain: "service-delivery",
  description: "ساخت بسته نسخه‌دار از خدمات ARIA با وضعیت پیش‌نویس و بدون فعال‌سازی entitlement.",
  sourceLineage: "docs/ARIA_SERVICE_DELIVERY_IMPLEMENTATION_2026-11-19_FA.md",
  parentModuleIds: ["ARIA-SVC-INTAKE", "ARIA-SVC-PROPOSAL", "ARIA-SVC-DELIVERY", "ARIA-SVC-QUALITY"],
  inputContract: ["name","version","serviceModuleIds","steps","currency"],
  requiredInputs: ["name","version","serviceModuleIds","steps","currency"],
  outputContract: ["serviceResult", "status", "auditRecord"],
  operations: ["validate_input", "authorize_tenant_and_role", "createServicePackage", "record_audit_and_outcome"],
  accessPolicy: ["tenant_isolation", "least_privilege", "audit_log"],
  productionVerified: false
});
async function execute(input, context) {
  const preflight = await base.execute(input, context);
  const serviceResult = serviceDelivery.createServicePackage(input, { userId: String(context.actorId), tenantId: String(context.tenantId) });
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
