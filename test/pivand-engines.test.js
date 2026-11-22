"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  PivandError,
  PLATFORM_CAPABILITIES,
  ENGINE_IDS,
  createPivandEngines
} = require("../backend/integrations/pivand/index.cjs");

function setup(overrides = {}) {
  const auditEvents = [];
  const authorize = overrides.authorize || (async () => true);
  const audit = overrides.audit || (async event => auditEvents.push(event));
  return { engines: createPivandEngines({ authorize, audit, pointsPerReferral: 25 }), auditEvents };
}

test("PIVAND exposes five separately instantiated domain engines", () => {
  const { engines } = setup();
  assert.deepEqual(Object.keys(engines), ["connection", "campaigns", "referrals", "analytics", "revenue"]);
  assert.equal(ENGINE_IDS.length, 5);
  assert.equal(new Set(Object.values(engines)).size, 5);
});

test("each supported messaging platform has an independent adapter and operation contract", () => {
  assert.deepEqual(Object.keys(PLATFORM_CAPABILITIES).sort(), ["discord", "slack", "telegram", "whatsapp_business"]);
  assert.equal(new Set(Object.values(PLATFORM_CAPABILITIES).map(item => item.adapterId)).size, 4);
  assert.ok(Object.values(PLATFORM_CAPABILITIES).every(item => item.membershipMutation === false));
});

test("messenger adapter fails closed until configured", async () => {
  const { engines } = setup();
  await assert.rejects(engines.connection.execute({
    platform: "telegram", operation: "send_message", tenantId: "t1", actorId: "a1",
    requestId: "r1", consent: true, payload: { text: "hello" }
  }), error => error.code === "ADAPTER_NOT_CONFIGURED_FAIL_CLOSED");
});

test("telegram operation requires consent, authorization and its exact platform scopes", async () => {
  const { engines } = setup();
  engines.connection.registerAdapter({
    platform: "telegram", credentialRef: "secret-ref-1",
    grantedScopes: ["bot_token", "chat_send"],
    execute: async ({ operation }) => ({ operation, accepted: true })
  });
  await assert.rejects(engines.connection.execute({
    platform: "telegram", operation: "send_message", tenantId: "t1", actorId: "a1",
    requestId: "r1", consent: false, payload: { text: "hello" }
  }), error => error.code === "USER_CONSENT_REQUIRED");
  const result = await engines.connection.execute({
    platform: "telegram", operation: "send_message", tenantId: "t1", actorId: "a1",
    requestId: "r2", consent: true, payload: { text: "hello" }
  });
  assert.equal(result.liveConnectionVerified, false);
  assert.deepEqual(result.result, { operation: "send_message", accepted: true });
});

test("invite-link creation requires explicit platform administrator permission", async () => {
  const { engines } = setup();
  engines.connection.registerAdapter({
    platform: "telegram", credentialRef: "secret-ref-2",
    grantedScopes: ["bot_token", "chat_admin", "invite_manage"],
    execute: async () => ({ inviteCreated: true })
  });
  const request = {
    platform: "telegram", operation: "create_invite_link", tenantId: "t1", actorId: "a1",
    requestId: "r3", consent: true, payload: {}
  };
  await assert.rejects(engines.connection.execute(request), error =>
    error.code === "PLATFORM_ADMIN_PERMISSION_REQUIRED");
  const result = await engines.connection.execute({ ...request, adminAuthorized: true });
  assert.equal(result.result.inviteCreated, true);
});

test("unsupported membership mutation and unlisted operations are rejected", async () => {
  const { engines } = setup();
  await assert.rejects(engines.connection.execute({
    platform: "telegram", operation: "add_member", tenantId: "t1", actorId: "a1",
    requestId: "r4", consent: true, payload: {}
  }), error => error.code === "OPERATION_NOT_ALLOWED");
  assert.throws(() => engines.connection.registerAdapter({
    platform: "unknown_platform", credentialRef: "ref", execute: async () => ({})
  }), error => error.code === "UNSUPPORTED_PLATFORM");
});

test("campaign engine creates a draft only with audience consent and authorization", async () => {
  const { engines } = setup();
  const draft = await engines.campaigns.createCampaign({
    tenantId: "t1", actorId: "a1", campaignId: "c1",
    audienceConsent: true, audienceSize: 20, content: "Opt-in update"
  });
  assert.equal(draft.state, "DRAFT");
  assert.equal(draft.deliveryStarted, false);
  await assert.rejects(engines.campaigns.createCampaign({
    tenantId: "t1", actorId: "a1", campaignId: "c2",
    audienceConsent: false, audienceSize: 20, content: "message"
  }), error => error.code === "AUDIENCE_CONSENT_REQUIRED");
});

test("referral engine requires invitee consent and a qualifying event", async () => {
  const { engines } = setup();
  const result = await engines.referrals.recordReferral({
    tenantId: "t1", actorId: "a1", referralId: "ref1", inviterId: "u1",
    inviteeConsent: true, qualifyingEvent: true
  });
  assert.equal(result.state, "RECORDED_PENDING_REVIEW");
  assert.equal(result.autoPayout, false);
  await assert.rejects(engines.referrals.recordReferral({
    tenantId: "t1", actorId: "a1", referralId: "ref2", inviterId: "u1",
    inviteeConsent: false, qualifyingEvent: true
  }), error => error.code === "INVITEE_CONSENT_REQUIRED");
});

test("analytics engine accepts only finite numeric aggregates", async () => {
  const { engines } = setup();
  const report = await engines.analytics.buildReport({
    tenantId: "t1", actorId: "a1", reportId: "rep1", metrics: { delivered: 12, clicks: 3 }
  });
  assert.equal(report.metrics.delivered, 12);
  await assert.rejects(engines.analytics.buildReport({
    tenantId: "t1", actorId: "a1", reportId: "rep2", metrics: { delivered: "12" }
  }), error => error.code === "INVALID_METRIC");
});

test("revenue engine drafts offers but does not create payments or wallet balances", async () => {
  const { engines } = setup();
  const offer = await engines.revenue.createSubscriptionOffer({
    tenantId: "t1", actorId: "a1", offerId: "offer1",
    amountMinor: 9900, currency: "USD", period: "monthly"
  });
  assert.equal(offer.state, "DRAFT");
  assert.equal(offer.paymentProviderConnected, false);
  assert.equal("walletBalance" in offer, false);
});

test("all five engines enforce tenant authorization", async () => {
  const { engines } = setup({ authorize: async () => false });
  await assert.rejects(engines.campaigns.createCampaign({
    tenantId: "t1", actorId: "a1", campaignId: "c1",
    audienceConsent: true, audienceSize: 1, content: "x"
  }), error => error.code === "ACCESS_DENIED");
  await assert.rejects(engines.referrals.recordReferral({
    tenantId: "t1", actorId: "a1", referralId: "r1", inviterId: "u1",
    inviteeConsent: true, qualifyingEvent: true
  }), error => error.code === "ACCESS_DENIED");
  await assert.rejects(engines.analytics.buildReport({
    tenantId: "t1", actorId: "a1", reportId: "rep1", metrics: {}
  }), error => error.code === "ACCESS_DENIED");
  await assert.rejects(engines.revenue.createSubscriptionOffer({
    tenantId: "t1", actorId: "a1", offerId: "o1",
    amountMinor: 100, currency: "USD", period: "monthly"
  }), error => error.code === "ACCESS_DENIED");
});

test("audit events are recorded for accepted domain operations", async () => {
  const { engines, auditEvents } = setup();
  await engines.campaigns.createCampaign({
    tenantId: "t1", actorId: "a1", campaignId: "c1",
    audienceConsent: true, audienceSize: 2, content: "update"
  });
  await engines.analytics.buildReport({ tenantId: "t1", actorId: "a1", reportId: "rep1", metrics: {} });
  assert.ok(auditEvents.some(event => event.event === "PIVAND_CAMPAIGN_DRAFTED"));
  assert.ok(auditEvents.some(event => event.event === "PIVAND_REPORT_BUILT"));
});
