"use strict";

function classifyModule(module) {
  const type = module?.manifest?.moduleType || "UNKNOWN";
  const source = typeof module?.execute === "function" ? Function.prototype.toString.call(module.execute) : "";
  const hasDomainAdapter = /serviceDelivery\\.[A-Za-z_$][\\w$]*/.test(source);
  if (type === "SERVICE_DELIVERY_ENGINE" && hasDomainAdapter) {
    return {
      implementationState: "DOMAIN_LOGIC_LOCAL",
      evidence: "Dedicated service-delivery function is called by the module handler",
      externalExecution: false,
      payment: false,
      production: false
    };
  }
  return {
    implementationState: "SHARED_RUNTIME_CONTRACT_ONLY",
    evidence: "Module uses the shared contract/planning/audit runtime without a dedicated domain adapter",
    externalExecution: false,
    payment: false,
    production: false
  };
}

function buildMaturityReport(modules) {
  if (!Array.isArray(modules)) throw new Error("MODULE_LIST_REQUIRED");
  const rows = modules.map(module => ({
    moduleId: module.manifest.moduleId,
    moduleType: module.manifest.moduleType,
    name: module.manifest.name,
    ...classifyModule(module)
  }));
  const counts = rows.reduce((acc, row) => {
    acc[row.implementationState] = (acc[row.implementationState] || 0) + 1;
    return acc;
  }, {});
  return Object.freeze({
    total: rows.length,
    counts: Object.freeze(counts),
    productionVerifiedCount: rows.filter(row => row.production).length,
    externalExecutionEnabledCount: rows.filter(row => row.externalExecution).length,
    paymentExecutedCount: rows.filter(row => row.payment).length,
    rows
  });
}

module.exports = { classifyModule, buildMaturityReport };
