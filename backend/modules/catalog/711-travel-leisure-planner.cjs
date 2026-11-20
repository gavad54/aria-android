"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-711",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 711,
  "commercialModuleId": "travel-leisure-planner",
  "name": "برنامه‌ریز سفر و اوقات فراغت",
  "domain": "personal",
  "description": "برنامه سفر، اقامت، بودجه، تجربه‌های محلی، حمل‌ونقل، مسیر، مدارک، حیوان خانگی و گروه همسفر؛ رزرو و پرداخت فقط با اتصال تأییدشده",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#travel-leisure-planner",
  "hostCanonicalContractId": 235,
  "parentModuleIds": [],
  "inputContract": [
    "goal",
    "context"
  ],
  "outputContract": [
    "domainArtifact",
    "workItem"
  ],
  "requiredInputs": [
    "goal",
    "context"
  ],
  "operations": [
    "capture_personal_goal",
    "identify_constraints",
    "prepare_options",
    "create_safe_action_plan",
    "review_progress"
  ],
  "revenueModel": "اشتراک سفر؛ کمیسیون رزرو افشاشده؛ بسته برنامه‌ریزی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "marketplace_fee_or_commission"
    ],
    "meteringUnit": "completed_task_or_seat",
    "entitlementKey": "aria.module.travel-leisure-planner",
    "price": {
      "amount": null,
      "currency": null,
      "policy": "OWNER_CONFIGURED"
    },
    "freeTier": {
      "enabled": false,
      "quota": null,
      "policy": "OWNER_CONFIGURED"
    },
    "usageLimits": {
      "policy": "OWNER_CONFIGURED"
    },
    "refundPolicy": "OWNER_CONFIGURED",
    "taxAndFeeDisclosureRequired": true,
    "providerRequired": true,
    "paymentProviderState": "NOT_CONNECTED",
    "externalProviderState": "NOT_CONNECTED",
    "revenueRecognition": "RECORD_ONLY_AFTER_VERIFIED_PAYMENT_OR_PROVIDER_EVENT",
    "antiAbuse": "RATE_LIMIT_QUOTA_IDEMPOTENCY_AND_AUDIT_REQUIRED"
  },
  "commercialState": "NOT_LIVE",
  "accessPolicy": [
    "tenant_isolation",
    "least_privilege",
    "audit_log",
    "idempotency",
    "rate_limit"
  ],
  "assumptions": [
    "No payment or external provider is executed by this local module handler."
  ],
  "productionVerified": false
  domainHandler: true
});
