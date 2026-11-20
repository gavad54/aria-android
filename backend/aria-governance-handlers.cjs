"use strict";

function requireObject(value, code) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(code);
  return value;
}
function requireText(value, code, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new Error(code);
  return value.trim();
}
function requireArray(value, code, max = 100) {
  if (!Array.isArray(value) || value.length > max) throw new Error(code);
  return value;
}

async function intentMarketplace(input) {
  const request = requireObject(input.request_payload, "INTENT_REQUEST_INVALID");
  const policy = requireObject(input.policy_or_assumptions, "INTENT_POLICY_INVALID");
  const title = requireText(request.title, "INTENT_TITLE_REQUIRED", 140);
  const description = requireText(request.description, "INTENT_DESCRIPTION_REQUIRED", 1600);
  const category = requireText(request.category, "INTENT_CATEGORY_REQUIRED", 80);
  if (input.consent !== true) throw new Error("INTENT_CONTACT_CONSENT_REQUIRED");
  const candidates = requireArray(policy.candidates || [], "INTENT_CANDIDATES_INVALID");
  const matches = candidates
    .filter(item => item && item.verified === true && item.contactVisible === true && item.category === category)
    .slice(0, 20)
    .map(item => ({
      candidateId: requireText(String(item.id || ""), "INTENT_CANDIDATE_ID_INVALID", 100),
      category,
      matchReason: "VERIFIED_CATEGORY_MATCH",
      contactDisclosed: false
    }));
  return {
    artifactType: "CONSENTED_INTENT_MATCH_RESULT",
    request: { title, description, category },
    matches,
    matchState: matches.length ? "VERIFIED_MATCHES_FOUND" : "NO_VERIFIED_MATCHES",
    consent: { contactConsent: true, purpose: "category_matching_only" },
    privateContactDetailsDisclosed: false,
    externalContactPerformed: false
  };
}

async function autonomyControl(input, context) {
  const request = requireObject(input.request_payload, "AUTONOMY_REQUEST_INVALID");
  const policy = requireObject(input.policy_or_assumptions, "AUTONOMY_POLICY_INVALID");
  const agentId = requireText(request.agentId, "AUTONOMY_AGENT_REQUIRED", 120);
  const action = requireText(request.action, "AUTONOMY_ACTION_REQUIRED", 120);
  const decision = ["allow", "deny", "require_approval"].includes(policy.decision) ? policy.decision : "deny";
  const sensitive = request.sensitive === true || policy.sensitiveActions?.includes?.(action) === true;
  const actorCanApprove = context?.isOwner === true && context?.ownerApprovalVerified === true;
  const effectiveDecision = decision === "allow" && sensitive && !actorCanApprove ? "require_approval" : decision;
  return {
    artifactType: "AUTONOMY_POLICY_DECISION",
    agentId,
    action,
    requestedDecision: decision,
    effectiveDecision,
    reason: effectiveDecision === "deny" ? "DENY_BY_DEFAULT_OR_POLICY" :
      effectiveDecision === "require_approval" ? "SENSITIVE_ACTION_REQUIRES_OWNER_APPROVAL" : "EXPLICIT_POLICY_ALLOW",
    policyVersion: requireText(String(policy.version || "unspecified"), "AUTONOMY_POLICY_VERSION_INVALID", 80),
    selfPrivilegeEscalationAllowed: false,
    immediateRevocationSupportedByThisLocalDecision: false,
    externalActionExecuted: false
  };
}

async function scenarioSimulator(input) {
  const request = requireObject(input.request_payload, "SCENARIO_REQUEST_INVALID");
  const assumptions = requireObject(input.policy_or_assumptions, "SCENARIO_ASSUMPTIONS_INVALID");
  const scenarios = requireArray(request.scenarios, "SCENARIO_LIST_REQUIRED", 20);
  if (scenarios.length < 2) throw new Error("SCENARIO_MINIMUM_TWO_REQUIRED");
  const rows = scenarios.map((scenario, index) => {
    requireObject(scenario, "SCENARIO_ITEM_INVALID");
    const name = requireText(scenario.name, "SCENARIO_NAME_REQUIRED", 100);
    const impact = Number(scenario.impact);
    const likelihood = Number(scenario.likelihood);
    if (!Number.isFinite(impact) || !Number.isFinite(likelihood) || likelihood < 0 || likelihood > 1) {
      throw new Error("SCENARIO_NUMERIC_INPUT_INVALID");
    }
    return { index: index + 1, name, impact, likelihood, weightedEstimate: Math.round(impact * likelihood * 10000) / 10000 };
  });
  const source = requireText(String(assumptions.source || "user_supplied_assumptions"), "SCENARIO_SOURCE_INVALID", 120);
  return {
    artifactType: "ASSUMPTION_BASED_SCENARIO_COMPARISON",
    scenarios: rows,
    assumptions: { ...assumptions, source },
    ranking: [...rows].sort((a, b) => b.weightedEstimate - a.weightedEstimate).map(x => x.name),
    uncertainty: "USER_SUPPLIED_LIKELIHOOD_IS_NOT_A_VERIFIED_PROBABILITY",
    forecastGuaranteed: false,
    externalActionExecuted: false
  };
}

async function ownerControlCenter(input, context) {
  const request = requireObject(input.request_payload, "OWNER_CONTROL_REQUEST_INVALID");
  const action = requireText(request.action, "OWNER_CONTROL_ACTION_REQUIRED", 100);
  const isOwner = context.isOwner === true || context.platformRole === "OWNER";
  if (!isOwner) throw new Error("OWNER_CONTROL_ACCESS_DENIED");
  const readOnlyActions = new Set(["read_health", "read_release_gates", "read_security_summary", "read_revenue_summary"]);
  if (readOnlyActions.has(action)) {
    return {
      artifactType: "OWNER_READ_ONLY_CONTROL_REQUEST",
      action,
      decision: "READ_ONLY_REQUEST_ACCEPTED",
      secretsExposed: false,
      deploymentExecuted: false,
      paymentExecuted: false
    };
  }
  const approvers = Array.isArray(context.approvingUserIds) ? context.approvingUserIds : [];
  const uniqueApprovers = new Set(approvers.filter(x => typeof x === "string" && x));
  const approved = context.dualApprovalVerified === true && uniqueApprovers.size >= 2;
  return {
    artifactType: "OWNER_SENSITIVE_CONTROL_REQUEST",
    action,
    decision: approved ? "READY_FOR_SEPARATE_EXECUTION_GATE" : "PENDING_DUAL_APPROVAL",
    distinctApprovals: uniqueApprovers.size,
    secretsExposed: false,
    executionPerformed: false,
    additionalReleaseAndAuthorizationChecksRequired: true
  };
}

module.exports = { intentMarketplace, autonomyControl, scenarioSimulator, ownerControlCenter };
