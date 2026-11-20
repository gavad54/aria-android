"use strict";

/**
 * Provider-neutral ARIA adapter boundary.
 *
 * This registry intentionally ships with no live providers. Provider drivers
 * must be injected by a separately reviewed integration package. A family
 * definition is a contract boundary, not proof of connectivity.
 */
const FAMILY_DEFINITIONS = Object.freeze({
  AI_MODEL_AND_AGENT_RUNTIME: { operations: ["generate", "embed", "invoke"], writes: false },
  COMMERCE_AND_CATALOG: { operations: ["search", "get_product", "sync_catalog"], writes: true },
  PAYMENT_AND_FINANCIAL_RAILS: { operations: ["create_payment_intent", "get_payment_status", "refund"], writes: true, sensitive: true },
  MEDIA_AND_CREATIVE: { operations: ["generate_image", "generate_audio", "transform_media"], writes: true },
  TRUST_SAFETY_AND_COMPLIANCE: { operations: ["screen", "verify", "record_decision"], writes: true, sensitive: true },
  GENERAL_DOMAIN_API: { operations: ["discover", "execute"], writes: true },
  LOGISTICS_AND_DELIVERY: { operations: ["quote", "track", "create_shipment"], writes: true },
  ANALYTICS_AND_OBSERVABILITY: { operations: ["query_metrics", "emit_event"], writes: true },
  IDENTITY_AND_ACCESS: { operations: ["verify_identity", "lookup_subject"], writes: false, sensitive: true },
  VOICE_AND_MESSAGING: { operations: ["send_message", "transcribe", "synthesize"], writes: true },
  SEARCH_AND_DISCOVERY: { operations: ["search", "index", "rank"], writes: true },
  LOCALIZATION_AND_ACCESSIBILITY: { operations: ["translate", "localize", "format_accessible"], writes: false },
  STORAGE_AND_FILE: { operations: ["put_object", "get_object", "delete_object"], writes: true, sensitive: true },
  CLOUD_AND_INFRASTRUCTURE: { operations: ["inspect_resource", "request_change"], writes: true, sensitive: true }
});

const FAMILY_NAMES = Object.freeze(Object.keys(FAMILY_DEFINITIONS));
const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;

class AdapterError extends Error {
  constructor(code) {
    super(code);
    this.name = "AdapterError";
    this.code = code;
  }
}

function requireId(value, code) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) throw new AdapterError(code);
  return value;
}

class AdapterRegistry {
  constructor({ timeoutMs = 10000, clock = () => new Date().toISOString() } = {}) {
    if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60000) {
      throw new AdapterError("INVALID_TIMEOUT");
    }
    this.timeoutMs = timeoutMs;
    this.clock = clock;
    this.providers = new Map();
  }

  listFamilies() {
    return FAMILY_NAMES.map((family) => ({
      family,
      operations: [...FAMILY_DEFINITIONS[family].operations],
      sensitive: Boolean(FAMILY_DEFINITIONS[family].sensitive),
      providerState: this.providers.has(family) ? "INJECTED_NOT_PRODUCTION_APPROVED" : "NOT_CONFIGURED_FAIL_CLOSED"
    }));
  }

  registerProvider({ family, providerId, execute, approvalState = "MOCK_ONLY", approvalEvidenceId }) {
    if (!Object.prototype.hasOwnProperty.call(FAMILY_DEFINITIONS, family)) {
      throw new AdapterError("UNKNOWN_ADAPTER_FAMILY");
    }
    requireId(providerId, "INVALID_PROVIDER_ID");
    if (typeof execute !== "function") throw new AdapterError("PROVIDER_EXECUTOR_REQUIRED");
    if (!["MOCK_ONLY", "SANDBOX_APPROVED", "PRODUCTION_APPROVED"].includes(approvalState)) {
      throw new AdapterError("INVALID_APPROVAL_STATE");
    }
    if (approvalState === "PRODUCTION_APPROVED") {
      requireId(approvalEvidenceId, "PRODUCTION_APPROVAL_EVIDENCE_REQUIRED");
    }
    this.providers.set(family, Object.freeze({ providerId, execute, approvalState, approvalEvidenceId: approvalEvidenceId || null }));
    return { family, providerId, approvalState, approvalEvidenceId: approvalEvidenceId || null };
  }

  async execute({ family, operation, tenantId, actorId, requestId, payload = {}, idempotencyKey }) {
    if (!Object.prototype.hasOwnProperty.call(FAMILY_DEFINITIONS, family)) {
      throw new AdapterError("UNKNOWN_ADAPTER_FAMILY");
    }
    const definition = FAMILY_DEFINITIONS[family];
    if (!definition.operations.includes(operation)) throw new AdapterError("OPERATION_NOT_ALLOWED");
    requireId(tenantId, "TENANT_REQUIRED");
    requireId(actorId, "ACTOR_REQUIRED");
    requireId(requestId, "REQUEST_ID_REQUIRED");
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new AdapterError("INVALID_PAYLOAD");
    }
    if (definition.writes) requireId(idempotencyKey, "IDEMPOTENCY_KEY_REQUIRED");

    const provider = this.providers.get(family);
    if (!provider) throw new AdapterError("PROVIDER_NOT_CONFIGURED_FAIL_CLOSED");
    if (provider.approvalState === "MOCK_ONLY" && definition.sensitive) {
      // Sensitive families can be exercised in unit tests, never routed as live integrations.
      throw new AdapterError("SENSITIVE_MOCK_EXECUTION_BLOCKED");
    }

    let timeout;
    const controller = new AbortController();
    try {
      const result = await Promise.race([
        Promise.resolve().then(() => provider.execute({
          operation,
          tenantId,
          actorId,
          requestId,
          idempotencyKey: idempotencyKey || null,
          payload,
          signal: controller.signal
        })),
        new Promise((_, reject) => {
          timeout = setTimeout(() => {
            reject(new AdapterError("PROVIDER_TIMEOUT"));
            controller.abort();
          }, this.timeoutMs);
        })
      ]);
      return Object.freeze({
        family,
        providerId: provider.providerId,
        tenantId,
        requestId,
        executedAt: this.clock(),
        providerApprovalState: provider.approvalState,
        productionVerified: false,
        result
      });
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}

module.exports = { AdapterRegistry, AdapterError, FAMILY_DEFINITIONS, FAMILY_NAMES };
