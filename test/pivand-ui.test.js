"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizePivandStatus } = require("../pivand-ui.js");

const payload = {
  product: "PIVAND",
  parentProduct: "ARIA",
  integrationState: "DOMAIN_FOUNDATION_ONLY",
  liveProviderConnections: 0,
  externalDeliveryEnabled: false,
  engines: [
    { id: "messenger_connection", state: "DOMAIN_ENGINE_AVAILABLE", persistentStorage: "NOT_CONNECTED" },
    { id: "audience_campaign", state: "DOMAIN_ENGINE_AVAILABLE", persistentStorage: "NOT_CONNECTED" },
    { id: "points_referrals", state: "DOMAIN_ENGINE_AVAILABLE", persistentStorage: "NOT_CONNECTED" },
    { id: "analytics_reporting", state: "DOMAIN_ENGINE_AVAILABLE", persistentStorage: "NOT_CONNECTED" },
    { id: "revenue_subscription_wallet", state: "DOMAIN_ENGINE_AVAILABLE", persistentStorage: "NOT_CONNECTED" }
  ],
  platforms: [
    { platform: "telegram", adapterId: "telegram-bot-api", adapterState: "NOT_CONFIGURED", operations: ["send_message"], membershipMutation: false, liveConnectionVerified: false }
  ],
  limitations: ["No live delivery"]
};

test("PIVAND status is explicitly nested under ARIA and exposes five engines", () => {
  const result = normalizePivandStatus(payload);
  assert.equal(result.parentProduct, "ARIA");
  assert.equal(result.engines.length, 5);
  assert.equal(result.engines[0].label, "اتصال پیام‌رسان‌ها");
});

test("PIVAND platform capabilities remain fail-closed and do not promise membership mutation", () => {
  const result = normalizePivandStatus(payload);
  assert.equal(result.platforms[0].label, "تلگرام");
  assert.equal(result.platforms[0].membershipMutation, false);
  assert.equal(result.platforms[0].liveConnectionVerified, false);
});

test("invalid parent product and incomplete engine registry are rejected", () => {
  assert.throws(() => normalizePivandStatus({ ...payload, parentProduct: "VAYRO" }), {
    message: "PIVAND_STATUS_CONTRACT_INVALID"
  });
  assert.throws(() => normalizePivandStatus({ ...payload, engines: payload.engines.slice(1) }), {
    message: "PIVAND_ENGINE_REGISTRY_INVALID"
  });
});

test("browser dashboard mounts against the actual PIVAND section id", () => {
  const fs = require("node:fs");
  const source = fs.readFileSync(require.resolve("../pivand-ui.js"), "utf8");
  assert.match(source, /getElementById\("pivand"\)/);
  assert.doesNotMatch(source, /getElementById\("pivand-status"\)/);
});
