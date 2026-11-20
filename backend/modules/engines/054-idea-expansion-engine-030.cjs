"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createEngineDomainHandler } = require("../../aria-engine-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-054",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-030",
  "name": "مدیریت رخداد و گزارش پس از حادثه — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-054",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-030"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "incident",
    "severity",
    "events",
    "owners"
  ],
  "outputContract": [
    "incident_timeline",
    "action_log",
    "postmortem"
  ],
  "requiredInputs": [
    "incident",
    "severity",
    "events",
    "owners"
  ],
  "operations": [
    "validate_input",
    "authorize_tenant_and_role",
    "check_consent_and_policy",
    "execute_scoped_workflow",
    "quality_review",
    "record_audit_and_outcome"
  ],
  "handlerKey": "engine.NEW_IDEA_ENGINE",
  "hostCanonicalContractId": null,
  "accessPolicy": [
    "tenant_isolation",
    "least_privilege",
    "audit_log"
  ],
  "executionState": "LOCAL_WORK_ITEM_ONLY",
  "productionVerified": false,
  domainHandler: createEngineDomainHandler(54)
});
