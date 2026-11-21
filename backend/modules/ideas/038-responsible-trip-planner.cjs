"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createIdeaDomainHandler } = require("../../aria-idea-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-IDEA-BACKLOG-038",
  "moduleType": "IDEA_BACKLOG_MODULE",
  "sequence": 38,
  "name": "Responsible Trip Planner",
  "engine": "Constraint-aware Itinerary Engine",
  "purpose": "برنامه سفر با منابع و برآورد",
  "deliverable": "برنامه سفر با منابع و برآورد",
  "domain": "general",
  "sourceLineage": "docs/aria/ARIA_54_MODULES_ENGINES_OPERATIONALIZATION_BACKLOG_2026-11-19_FA.md#IDEA-038",
  "hostCanonicalContractId": null,
  "parentModuleIds": [],
  "inputContract": [
    "goal",
    "context"
  ],
  "outputContract": [
    "domainArtifact",
    "actionPlan",
    "status",
    "auditRecord"
  ],
  "requiredInputs": [
    "goal",
    "context"
  ],
  "operations": [
    "validate_input",
    "authorize_tenant_and_role",
    "apply_constraint_aware_itinerary_engine",
    "quality_review",
    "record_audit_and_outcome"
  ],
  "accessPolicy": [
    "tenant_isolation",
    "least_privilege",
    "consent_and_purpose_limitation",
    "audit_log",
    "human_approval_for_sensitive_or_external_actions"
  ],
  "assumptions": [
    "Local workflow only; no external connector is invoked."
  ],
  "revenueModel": "NOT_MONETIZED_UNTIL_ENTITLEMENT_AND_PAYMENT_VERIFIED",
  domainHandler: createIdeaDomainHandler(38)
});
