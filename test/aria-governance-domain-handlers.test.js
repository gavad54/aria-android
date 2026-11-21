"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { executeModule } = require("../backend/modules");

const actor = { actorId: "test-owner", tenantId: "tenant-test", isOwner: true, platformRole: "OWNER" };

test("intent marketplace matches only verified, visible category candidates after explicit consent", async () => {
  const result = await executeModule("ARIA-CONTROL-MODULE-001", {
    request_payload: { title: "نیاز به طراح", description: "طراحی هویت بصری", category: "design" },
    policy_or_assumptions: { candidates: [
      { id: "p1", category: "design", verified: true, contactVisible: true },
      { id: "p2", category: "design", verified: false, contactVisible: true },
      { id: "p3", category: "design", verified: true, contactVisible: false },
      { id: "p4", category: "other", verified: true, contactVisible: true }
    ]},
    consent: true
  }, actor);
  assert.equal(result.domainLogicExecuted, true);
  assert.equal(result.artifact.domainResult.matches.length, 1);
  assert.equal(result.artifact.domainResult.matches[0].candidateId, "p1");
  assert.equal(result.artifact.domainResult.privateContactDetailsDisclosed, false);
  await assert.rejects(() => executeModule("ARIA-CONTROL-MODULE-001", {
    request_payload: { title: "نیاز", description: "شرح", category: "design" },
    policy_or_assumptions: { candidates: [] }, consent: false
  }, actor), /MODULE_CONSENT_REQUIRED/);
});

test("autonomy control denies by default and escalates sensitive actions", async () => {
  const denied = await executeModule("ARIA-CONTROL-MODULE-002", {
    request_payload: { agentId: "agent-1", action: "send_external_message" },
    policy_or_assumptions: { version: "v1" }
  }, actor);
  assert.equal(denied.artifact.domainResult.effectiveDecision, "deny");
  const escalated = await executeModule("ARIA-CONTROL-MODULE-002", {
    request_payload: { agentId: "agent-1", action: "send_external_message", sensitive: true },
    policy_or_assumptions: { version: "v2", decision: "allow" }
  }, actor);
  assert.equal(escalated.artifact.domainResult.effectiveDecision, "require_approval");
  const approved = await executeModule("ARIA-CONTROL-MODULE-002", {
    request_payload: { agentId: "agent-1", action: "send_external_message", sensitive: true },
    policy_or_assumptions: { version: "v3", decision: "allow" }
  }, { ...actor, ownerApprovalVerified: true });
  assert.equal(approved.artifact.domainResult.effectiveDecision, "allow");
});

test("scenario simulator computes transparent assumption-weighted comparisons only", async () => {
  const result = await executeModule("ARIA-CONTROL-MODULE-003", {
    request_payload: { scenarios: [
      { name: "A", impact: 100, likelihood: 0.5 },
      { name: "B", impact: 60, likelihood: 0.9 }
    ]},
    policy_or_assumptions: { source: "test assumptions", version: "1" }
  }, actor);
  assert.equal(result.artifact.domainResult.scenarios[0].weightedEstimate, 50);
  assert.equal(result.artifact.domainResult.scenarios[1].weightedEstimate, 54);
  assert.equal(result.artifact.domainResult.forecastGuaranteed, false);
  await assert.rejects(() => executeModule("ARIA-CONTROL-MODULE-003", {
    request_payload: { scenarios: [{ name: "only", impact: 1, likelihood: 0.5 }] },
    policy_or_assumptions: { source: "test" }
  }, actor), /SCENARIO_MINIMUM_TWO_REQUIRED/);
});

test("owner control is owner-only and never trusts client-supplied dual approvals", async () => {
  await assert.rejects(() => executeModule("ARIA-CONTROL-MODULE-004", {
    request_payload: { action: "read_health" }, policy_or_assumptions: {}
  }, { actorId: "member", tenantId: "tenant-test" }), /OWNER_CONTROL_ACCESS_DENIED/);
  const read = await executeModule("ARIA-CONTROL-MODULE-004", {
    request_payload: { action: "read_health" }, policy_or_assumptions: {}
  }, actor);
  assert.equal(read.artifact.domainResult.decision, "READ_ONLY_REQUEST_ACCEPTED");
  const sensitive = await executeModule("ARIA-CONTROL-MODULE-004", {
    request_payload: { action: "change_production_config", approvals: [{ userId: "a" }, { userId: "b" }] },
    policy_or_assumptions: {}
  }, actor);
  assert.equal(sensitive.artifact.domainResult.decision, "PENDING_DUAL_APPROVAL");
  assert.equal(sensitive.artifact.domainResult.executionPerformed, false);
});
