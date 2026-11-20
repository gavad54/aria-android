"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-720",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 720,
  "commercialModuleId": "cloud-workspace-management",
  "name": "مدیریت فضای ابری و منابع",
  "domain": "automation",
  "description": "مدیریت فضای فایل، پروژه‌ها، سهمیه و مصرف، پایش سلامت سرویس‌های متصل، گزارش هزینه، سیاست نگهداری و درخواست پشتیبان‌گیری؛ عملیات زیرساختی حساس فقط از طریق اتصال رسمی، مجوز حداقلی، تأیید مالک و ثبت ممیزی؛ بدون دسترسی خودکار به حساب‌های ابری",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#cloud-workspace-management",
  "hostCanonicalContractId": 107,
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
    "capture_trigger",
    "design_workflow_graph",
    "define_approval_gate",
    "define_failure_handling",
    "prepare_monitoring_spec"
  ],
  "revenueModel": "اشتراک فضای کاری؛ سهمیه ذخیره‌سازی؛ گزارش هزینه و مدیریت سازمانی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "metered_usage"
    ],
    "meteringUnit": "storage_unit",
    "entitlementKey": "aria.module.cloud-workspace-management",
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
