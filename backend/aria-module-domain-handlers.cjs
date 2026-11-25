"use strict";

const COMMERCIAL_STATES = Object.freeze({
  billingEnabled: false,
  paymentExecuted: false,
  productionVerified: false,
  state: "DESIGNED_NOT_MONETIZED"
});

function boundedList(value, limit = 100) {
  return Array.isArray(value) ? value.slice(0, limit) : [];
}
function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function textValue(value, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, 2000) : fallback;
}
function deriveSignals(input, manifest) {
  const context = plainObject(input.context);
  const constraints = boundedList(input.constraints || context.constraints, 50);
  const evidence = boundedList(input.sourceReferences || input.source_references || context.sourceReferences, 100);
  const data = plainObject(input.data || context.data);
  const metrics = Object.entries(data).filter(([, value]) => typeof value === "number" && Number.isFinite(value)).map(([key, value]) => ({ key, value }));
  return {
    goal: textValue(input.goal || input.request || input.query || input.task, manifest.name),
    contextKeys: Object.keys(context).sort(),
    constraints,
    evidence,
    metrics,
    suppliedFields: Object.keys(input).filter(key => !["consent"].includes(key)).sort()
  };
}
function buildIdeaArtifact(manifest, signals) {
  const sequence = Number(manifest.sequence || 0);
  const patterns = [
    ["KNOWLEDGE_STRUCTURING", ["entities", "relationships", "sources"], "ساختاردهی دانش و پیوند شواهد"],
    ["LEARNING_DESIGN", ["baseline", "learningObjectives", "practiceSteps"], "طراحی مسیر یادگیری و تمرین"],
    ["CONTENT_WORKFLOW", ["contentBrief", "formats", "qualityChecks"], "تولید و کنترل کیفیت محتوا"],
    ["SERVICE_COORDINATION", ["serviceCriteria", "workflowStages", "handoffChecklist"], "هماهنگی خدمت و تحویل"],
    ["BUSINESS_ANALYSIS", ["businessQuestions", "assumptions", "decisionCriteria"], "تحلیل کسب‌وکار و معیار تصمیم"]
  ];
  const pattern = patterns[(Math.max(1, sequence) - 1) % patterns.length];
  const context = {
    [pattern[1][0]]: boundedList(plainObject(signals).entities || []),
    [pattern[1][1]]: boundedList(signals.constraints),
    [pattern[1][2]]: boundedList(signals.evidence)
  };
  return {
    artifactType: "ARIA_IDEA_" + String(sequence).padStart(3, "0"),
    specialization: pattern[0],
    objective: signals.goal,
    workflow: (manifest.operations || []).map((operation, index) => ({ sequence: index + 1, operation, state: "PROPOSED" })),
    domainPayload: context,
    qualityGate: ["input_validated", "tenant_scoped", "human_review_required"],
    limitations: ["No external connector execution", "No automatic publication or messaging", "No claim of verified outcome"]
  };
}
function buildCatalogArtifact(manifest, signals) {
  const revenue = plainObject(manifest.revenueEngine);
  return {
    artifactType: "ARIA_COMMERCIAL_OFFER_WORKFLOW",
    catalogEntryId: manifest.catalogEntryId,
    commercialModuleId: manifest.commercialModuleId,
    offer: { name: manifest.name, description: manifest.description || manifest.purpose || "", requestedOutcome: signals.goal },
    deliveryPlan: (manifest.operations || []).map((operation, index) => ({ sequence: index + 1, operation, acceptanceState: "PENDING_REVIEW" })),
    entitlement: {
      key: revenue.entitlementKey || null,
      billingModes: boundedList(revenue.billingModes),
      meteringUnit: revenue.meteringUnit || null,
      commercialState: manifest.commercialState || "NOT_LIVE"
    },
    monetization: {
      state: "DESIGNED_NOT_MONETIZED",
      price: revenue.price || null,
      paymentProviderState: revenue.paymentProviderState || "NOT_CONNECTED",
      billingEnabled: false,
      paymentExecuted: false,
      revenueRecognized: false
    },
    commercialControls: ["clear_scope", "acceptance_criteria", "disclosed_price_before_purchase", "refund_terms_before_purchase", "human_approval"]
  };
}
function buildEngineArtifact(manifest, signals) {
  const parentIds = boundedList(manifest.parentModuleIds);
  return {
    artifactType: "ARIA_CHILD_ENGINE_RESULT",
    engineId: manifest.moduleId,
    engineName: manifest.name,
    sourceEngine: manifest.engine || manifest.handlerKey || manifest.sourceId || "DOMAIN_ENGINE",
    parentModuleIds: parentIds,
    objective: signals.goal,
    decisionFramework: {
      constraints: signals.constraints,
      evidenceReferences: signals.evidence,
      numericSignals: signals.metrics,
      unresolvedInputs: signals.evidence.length ? [] : ["Independent source evidence not supplied"],
      decisionState: "LOCAL_PRELIMINARY_ONLY"
    },
    executionPlan: (manifest.operations || []).map((operation, index) => ({ sequence: index + 1, operation, state: "LOCAL_PROPOSAL" })),
    riskFlags: ["provider_not_connected", "external_execution_disabled", "human_review_required"],
    outputs: (manifest.outputContract || []).map(name => ({ name, state: "LOCAL_RESULT_READY" }))
  };
}
function buildModuleSpecificProfile(manifest) {
  const operations = boundedList(manifest.operations, 40).map((operation, index) => ({
    sequence: index + 1,
    operation,
    acceptanceCriteria: [
      "ورودی معتبر و محدود به tenant جاری باشد",
      "خروجی این گام قابل بازبینی و قابل ثبت باشد",
      "هیچ اقدام بیرونی بدون مجوز و تأیید انجام نشود"
    ],
    state: "LOCAL_EXECUTABLE_STEP"
  }));
  const inputs = boundedList(manifest.requiredInputs || manifest.inputContract, 40);
  const outputs = boundedList(manifest.outputContract, 40);
  const revenue = plainObject(manifest.revenueEngine);
  const profile = {
    profileId: "PROFILE:" + manifest.moduleId,
    moduleId: manifest.moduleId,
    moduleName: manifest.name,
    moduleType: manifest.moduleType,
    specialization: textValue(manifest.engine || manifest.purpose || manifest.description, manifest.name),
    purpose: textValue(manifest.purpose || manifest.description || manifest.deliverable, manifest.name),
    inputSchema: inputs.map(name => ({ name, required: true, validation: name === "consent" ? "must_be_true_when_policy_requires" : "type_and_size_checked" })),
    outputSchema: outputs.map(name => ({ name, produced: true, reviewRequired: true })),
    operationPlan: operations,
    decisionRules: [
      { id: "TENANT_BOUNDARY", rule: "تمام داده‌ها فقط در tenant جاری پردازش شوند", failState: "DENY" },
      { id: "EVIDENCE_BOUNDARY", rule: "ادعاهای نتیجه فقط بر اساس ورودی یا منبع ارائه‌شده باشند", failState: "UNVERIFIED" },
      { id: "HUMAN_REVIEW", rule: "خروجی حساس یا قابل انتشار پیش از اقدام بیرونی بازبینی شود", failState: "REVIEW_REQUIRED" }
    ],
    qualityMetrics: [
      { metric: "input_completeness", unit: "required_fields", target: inputs.length, state: "MEASURE_ON_EXECUTION" },
      { metric: "operation_coverage", unit: "steps", target: operations.length, state: "MEASURE_ON_EXECUTION" },
      { metric: "evidence_coverage", unit: "references", target: "USER_OR_CONNECTOR_SUPPLIED", state: "MEASURE_ON_EXECUTION" }
    ],
    commercialContract: manifest.moduleType === "COMMERCIAL_CATALOG_MODULE" ? {
      entitlementKey: revenue.entitlementKey || null,
      billingModes: boundedList(revenue.billingModes),
      meteringUnit: revenue.meteringUnit || null,
      state: "DESIGNED_NOT_MONETIZED",
      billingEnabled: false,
      paymentExecuted: false,
      price: revenue.price || null
    } : null,
    parentModuleIds: boundedList(manifest.parentModuleIds),
    sourceLineage: manifest.sourceLineage || null,
    executionBoundary: "TENANT_SCOPED_LOCAL_ONLY",
    externalExecution: false,
    productionVerified: false
  };
  return Object.freeze(profile);
}

function createModuleDomainHandler(manifest) {
  if (!manifest || typeof manifest.moduleId !== "string" || !manifest.moduleType) throw new Error("ARIA_DOMAIN_HANDLER_MANIFEST_INVALID");
  return async function moduleDomainHandler(input, context) {
    if (!context || !context.tenantId || !context.actorId) throw new Error("ARIA_DOMAIN_HANDLER_CONTEXT_INVALID");
    const signals = deriveSignals(input, manifest);
    const moduleSpecificProfile = buildModuleSpecificProfile(manifest);
    let domainArtifact;
    if (manifest.moduleType === "IDEA_BACKLOG_MODULE") domainArtifact = { ...buildIdeaArtifact(manifest, signals), moduleSpecificProfile };
    else if (manifest.moduleType === "COMMERCIAL_CATALOG_MODULE") domainArtifact = { ...buildCatalogArtifact(manifest, signals), moduleSpecificProfile };
    else if (manifest.moduleType === "CHILD_ENGINE_MODULE") domainArtifact = { ...buildEngineArtifact(manifest, signals), moduleSpecificProfile };
    else throw new Error("ARIA_DOMAIN_HANDLER_TYPE_UNSUPPORTED");
    return Object.freeze({
      moduleId: manifest.moduleId,
      moduleName: manifest.name,
      moduleType: manifest.moduleType,
      tenantScope: String(context.tenantId),
      actorScope: String(context.actorId),
      domainArtifact,
      commercialization: manifest.moduleType === "COMMERCIAL_CATALOG_MODULE" ? domainArtifact.monetization : COMMERCIAL_STATES,
      reviewRequired: true,
      externalSideEffect: false,
      externalExecutionPerformed: false,
      paymentExecuted: false,
      productionVerified: false
    });
  };
}

module.exports = { createModuleDomainHandler };
