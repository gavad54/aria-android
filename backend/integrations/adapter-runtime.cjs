"use strict";

const fs = require("node:fs");
const path = require("node:path");

const MANIFEST = JSON.parse(fs.readFileSync(
  path.join(__dirname, "..", "data", "aria_191_adapter_family_manifest.json"),
  "utf8"
));

const FAMILY_CONTRACTS = Object.freeze({
  AI_MODEL_AND_AGENT_RUNTIME: { operations: ["generate", "embed", "invoke", "evaluate"], writes: [] },
  ANALYTICS_AND_OBSERVABILITY: { operations: ["query_metrics", "emit_event"], writes: ["emit_event"] },
  CLOUD_AND_INFRASTRUCTURE: { operations: ["inspect_resource", "request_change"], writes: ["request_change"], sensitive: true },
  COMMERCE_AND_CATALOG: { operations: ["search_catalog", "get_product", "sync_catalog", "create_order", "update_listing"], writes: ["sync_catalog", "create_order", "update_listing"] },
  GENERAL_DOMAIN_API: { operations: ["discover", "execute", "validate"], writes: ["execute"] },
  IDENTITY_AND_ACCESS: { operations: ["verify_identity", "lookup_subject"], writes: [], sensitive: true },
  LOCALIZATION_AND_ACCESSIBILITY: { operations: ["translate", "localize", "format_accessible"], writes: [] },
  LOGISTICS_AND_DELIVERY: { operations: ["quote", "track", "create_shipment", "confirm_delivery"], writes: ["create_shipment", "confirm_delivery"] },
  MEDIA_AND_CREATIVE: { operations: ["generate_image", "generate_audio", "transform_media", "publish_asset"], writes: ["publish_asset"] },
  PAYMENT_AND_FINANCIAL_RAILS: { operations: ["create_payment_intent", "get_payment_status", "refund", "reconcile", "payout"], writes: ["create_payment_intent", "refund", "reconcile", "payout"], sensitive: true },
  SEARCH_AND_DISCOVERY: { operations: ["search", "index", "rank"], writes: ["index"] },
  STORAGE_AND_FILE: { operations: ["put_object", "get_object", "delete_object"], writes: ["put_object", "delete_object"], sensitive: true },
  TRUST_SAFETY_AND_COMPLIANCE: { operations: ["screen", "verify", "record_decision"], writes: ["record_decision"], sensitive: true },
  VOICE_AND_MESSAGING: { operations: ["send_message", "transcribe", "synthesize"], writes: ["send_message"] }
});

const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const moduleToFamily = new Map();
for (const [family, moduleIds] of Object.entries(MANIFEST.families)) {
  if (!FAMILY_CONTRACTS[family]) throw new Error("ARIA_ADAPTER_FAMILY_CONTRACT_MISSING");
  for (const moduleId of moduleIds) {
    if (!Number.isInteger(moduleId) || moduleToFamily.has(moduleId)) {
      throw new Error("ARIA_ADAPTER_MODULE_MAPPING_INVALID");
    }
    moduleToFamily.set(moduleId, family);
  }
}
if (moduleToFamily.size !== MANIFEST.totalRequirements || moduleToFamily.size !== 191) {
  throw new Error("ARIA_ADAPTER_REQUIREMENT_COVERAGE_INVALID");
}

class AdapterRuntimeError extends Error {
  constructor(code) {
    super(code);
    this.name = "AdapterRuntimeError";
    this.code = code;
  }
}

function assertId(value, code) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) throw new AdapterRuntimeError(code);
  return value;
}

class AdapterRuntime {
  constructor({ authorize, audit, timeoutMs = 10000, clock = () => new Date().toISOString() } = {}) {
    if (typeof authorize !== "function") throw new AdapterRuntimeError("AUTHORIZATION_CALLBACK_REQUIRED");
    if (typeof audit !== "function") throw new AdapterRuntimeError("AUDIT_CALLBACK_REQUIRED");
    if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60000) {
      throw new AdapterRuntimeError("INVALID_TIMEOUT");
    }
    this.authorize = authorize;
    this.audit = audit;
    this.timeoutMs = timeoutMs;
    this.clock = clock;
    this.providers = new Map();
  }

  listFamilies() {
    return Object.entries(MANIFEST.families).map(([family, moduleIds]) => ({
      family,
      moduleCount: moduleIds.length,
      providerState: this.providers.has(family) ? "SANDBOX_OR_MOCK_CONFIGURED" : "NOT_CONFIGURED_FAIL_CLOSED",
      productionEnabled: false
    }));
  }

  familyForModule(moduleId) {
    return moduleToFamily.get(Number(moduleId)) || null;
  }

  registerProvider({ family, providerId, execute, approval = "MOCK_ONLY", evidenceId = null }) {
    if (!Object.prototype.hasOwnProperty.call(FAMILY_CONTRACTS, family)) {
      throw new AdapterRuntimeError("UNKNOWN_ADAPTER_FAMILY");
    }
    assertId(providerId, "INVALID_PROVIDER_ID");
    if (typeof execute !== "function") throw new AdapterRuntimeError("PROVIDER_EXECUTOR_REQUIRED");
    if (!["MOCK_ONLY", "SANDBOX_APPROVED"].includes(approval)) {
      throw new AdapterRuntimeError("PRODUCTION_PROVIDER_REGISTRATION_BLOCKED");
    }
    if (approval === "SANDBOX_APPROVED") assertId(evidenceId, "SANDBOX_EVIDENCE_REQUIRED");
    this.providers.set(family, Object.freeze({ providerId, execute, approval, evidenceId }));
    return { family, providerId, approval, productionEnabled: false };
  }

  async execute({ moduleId, operation, tenantId, actorId, requestId, consent, payload = {}, idempotencyKey }) {
    const family = this.familyForModule(moduleId);
    if (!family) throw new AdapterRuntimeError("MODULE_ADAPTER_NOT_MAPPED");
    const contract = FAMILY_CONTRACTS[family];
    if (!contract.operations.includes(operation)) throw new AdapterRuntimeError("OPERATION_NOT_ALLOWED");
    assertId(tenantId, "TENANT_REQUIRED");
    assertId(actorId, "ACTOR_REQUIRED");
    assertId(requestId, "REQUEST_ID_REQUIRED");
    if (consent !== true) throw new AdapterRuntimeError("USER_CONSENT_REQUIRED");
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new AdapterRuntimeError("INVALID_PAYLOAD");
    }
    if (contract.writes.includes(operation)) assertId(idempotencyKey, "IDEMPOTENCY_KEY_REQUIRED");

    const authorization = await this.authorize({ family, moduleId: Number(moduleId), operation, tenantId, actorId });
    if (authorization !== true) throw new AdapterRuntimeError("ACCESS_DENIED");

    const provider = this.providers.get(family);
    if (!provider) throw new AdapterRuntimeError("PROVIDER_NOT_CONFIGURED_FAIL_CLOSED");
    if (provider.approval === "MOCK_ONLY" && contract.sensitive) {
      throw new AdapterRuntimeError("SENSITIVE_MOCK_EXECUTION_BLOCKED");
    }

    const baseEvent = {
      family, moduleId: Number(moduleId), operation, tenantId, actorId, requestId,
      providerId: provider.providerId, providerApproval: provider.approval,
      timestamp: this.clock(), productionVerified: false
    };
    await this.audit({ ...baseEvent, event: "ADAPTER_EXECUTION_REQUESTED" });

    const controller = new AbortController();
    let timeoutHandle;
    try {
      const result = await Promise.race([
        Promise.resolve().then(() => provider.execute({
          operation, tenantId, actorId, requestId,
          idempotencyKey: idempotencyKey || null,
          payload, signal: controller.signal
        })),
        new Promise((_, reject) => {
          timeoutHandle = setTimeout(() => {
            controller.abort();
            reject(new AdapterRuntimeError("PROVIDER_TIMEOUT"));
          }, this.timeoutMs);
        })
      ]);
      await this.audit({ ...baseEvent, event: "ADAPTER_EXECUTION_SUCCEEDED" });
      return Object.freeze({
        ...baseEvent,
        result,
        activationState: provider.approval,
        productionVerified: false
      });
    } catch (error) {
      await this.audit({
        ...baseEvent,
        event: "ADAPTER_EXECUTION_FAILED",
        errorCode: error && error.code ? error.code : "PROVIDER_EXECUTION_FAILED"
      });
      throw error;
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
  }
}

module.exports = {
  AdapterRuntime,
  AdapterRuntimeError,
  FAMILY_CONTRACTS,
  MANIFEST,
  moduleToFamily
};
