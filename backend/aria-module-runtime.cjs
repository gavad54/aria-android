"use strict";
const { createHash, randomUUID } = require("node:crypto");

const RESERVED_INPUTS = new Set(["authenticated_actor", "tenant_context", "actor", "tenant"]);

function stableJson(value) {
  if (Array.isArray(value)) return "[" + value.map(stableJson).join(",") + "]";
  if (value && typeof value === "object") {
    return "{" + Object.keys(value).sort().map(key => JSON.stringify(key) + ":" + stableJson(value[key])).join(",") + "}";
  }
  return JSON.stringify(value);
}

function createDomainModule(definition) {
  const domainHandler = definition?.domainHandler === true
    ? require("./aria-module-domain-handlers.cjs").createModuleDomainHandler(definition)
    : definition?.domainHandler;
  const publicDefinition = definition ? Object.fromEntries(Object.entries(definition).filter(([key]) => key !== "domainHandler")) : definition;
  if (!definition || typeof definition.moduleId !== "string" || !definition.moduleId ||
      typeof definition.name !== "string" || !Array.isArray(definition.inputContract) ||
      !Array.isArray(definition.outputContract) || !Array.isArray(definition.operations)) {
    throw new Error("MODULE_DEFINITION_INVALID");
  }
  const manifest = Object.freeze({
    ...publicDefinition,
    inputContract: Object.freeze([...definition.inputContract]),
    outputContract: Object.freeze([...definition.outputContract]),
    operations: Object.freeze([...definition.operations]),
    requiredInputs: Object.freeze([...(definition.requiredInputs || definition.inputContract.filter(x => !RESERVED_INPUTS.has(x)))]),
    productionVerified: false,
    externalExecutionEnabled: false,
    paymentExecuted: false,
    implementationState: domainHandler ? "DOMAIN_LOGIC_LOCAL" : "LOCAL_HANDLER_WITH_SHARED_RUNTIME"
  });

  async function execute(input, context) {
    if (!context || !context.actorId) throw new Error("MODULE_ACTOR_REQUIRED");
    if (!context.tenantId) throw new Error("MODULE_TENANT_REQUIRED");
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("MODULE_INPUT_INVALID");

    const missing = manifest.requiredInputs.filter(key =>
      !Object.prototype.hasOwnProperty.call(input, key) ||
      input[key] === undefined || input[key] === null || input[key] === ""
    );
    if (missing.length) {
      const error = new Error("MODULE_INPUT_MISSING");
      error.missingFields = missing;
      throw error;
    }

    if ((manifest.accessPolicy?.includes("consent_and_purpose_limitation") || manifest.accessPolicy?.includes("explicit_contact_consent")) && input.consent !== true) {
      throw new Error("MODULE_CONSENT_REQUIRED");
    }
    if (context.tenantId !== String(context.tenantId)) throw new Error("MODULE_TENANT_INVALID");

    const createdAt = new Date().toISOString();
    const workItemId = randomUUID();
    const inputDigest = createHash("sha256").update(stableJson(input)).digest("hex");
    const operationPlan = manifest.operations.map((operation, index) => ({
      sequence: index + 1,
      operation,
      state: "LOCAL_STEP_PLANNED",
      externalSideEffect: false
    }));
    const artifact = {
      id: workItemId,
      moduleId: manifest.moduleId,
      moduleName: manifest.name,
      moduleType: manifest.moduleType,
      domain: manifest.domain || null,
      purpose: manifest.purpose || manifest.description || manifest.deliverable || manifest.name,
      sourceLineage: manifest.sourceLineage,
      hostCanonicalContractId: manifest.hostCanonicalContractId ?? null,
      parentModuleIds: manifest.parentModuleIds || [],
      inputDigest,
      inputFields: Object.keys(input).sort(),
      operationPlan,
      deliverable: manifest.deliverable || manifest.outputContract.join(", "),
      reviewRequired: true,
      status: "LOCAL_RESULT_READY",
      createdAt
    };
    const auditRecord = {
      eventId: randomUUID(),
      eventType: "ARIA_MODULE_LOCAL_EXECUTION",
      moduleId: manifest.moduleId,
      actorId: String(context.actorId),
      tenantId: String(context.tenantId),
      inputDigest,
      createdAt,
      externalExecutionPerformed: false
    };

    const domainResult = typeof domainHandler === "function"
      ? await domainHandler(Object.freeze({ ...input }), Object.freeze({ ...context }), Object.freeze({ manifest, workItemId, inputDigest, createdAt }))
      : null;
    if (domainResult !== null && (!domainResult || typeof domainResult !== "object" || Array.isArray(domainResult))) {
      throw new Error("MODULE_DOMAIN_HANDLER_RESULT_INVALID");
    }

    const output = {};
    for (const field of manifest.outputContract) {
      if (/status/i.test(field)) output[field] = "LOCAL_RESULT_READY";
      else if (/audit/i.test(field)) output[field] = auditRecord;
      else if (/explain|reason/i.test(field)) output[field] = { operations: manifest.operations, assumptions: manifest.assumptions || [] };
      else if (/source|provenance|reference/i.test(field)) output[field] = input.source_references || input.sourceReferences || [];
      else if (/plan|workflow|steps|checklist/i.test(field)) output[field] = operationPlan;
      else if (/result|artifact|deliverable|report|scorecard|summary/i.test(field)) output[field] = domainResult || artifact;
      else output[field] = { state: "LOCAL_RESULT_READY", moduleId: manifest.moduleId, artifactId: workItemId };
    }

    return {
      workItemId,
      moduleId: manifest.moduleId,
      moduleName: manifest.name,
      tenantId: String(context.tenantId),
      actorId: String(context.actorId),
      status: "LOCAL_RESULT_READY",
      artifact: domainResult ? { ...artifact, domainResult } : artifact,
      output,
      auditRecord,
      externalExecutionPerformed: false,
      paymentExecuted: false,
      productionVerified: false,
      domainLogicExecuted: Boolean(domainResult)
    };
  }

  return Object.freeze({ manifest, execute });
}

module.exports = { createDomainModule };
