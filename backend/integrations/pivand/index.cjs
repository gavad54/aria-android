"use strict";

// PIVAND is an internal ARIA capability with its own domain boundary.
// This package intentionally ships without live provider credentials or network calls.

const PLATFORM_CAPABILITIES = Object.freeze({
  telegram: Object.freeze({
    adapterId: "telegram-bot-api",
    supportedOperations: Object.freeze(["send_message", "read_updates", "create_invite_link"]),
    requiredScopes: Object.freeze({
      send_message: ["bot_token", "chat_send"],
      read_updates: ["bot_token", "updates_read"],
      create_invite_link: ["bot_token", "chat_admin", "invite_manage"]
    }),
    membershipMutation: false
  }),
  whatsapp_business: Object.freeze({
    adapterId: "whatsapp-business-cloud",
    supportedOperations: Object.freeze(["send_template_message", "read_delivery_status"]),
    requiredScopes: Object.freeze({
      send_template_message: ["business_account", "message_send", "template_approved"],
      read_delivery_status: ["business_account", "message_status_read"]
    }),
    membershipMutation: false
  }),
  discord: Object.freeze({
    adapterId: "discord-bot",
    supportedOperations: Object.freeze(["send_message", "read_events", "create_invite_link"]),
    requiredScopes: Object.freeze({
      send_message: ["bot_token", "message_send"],
      read_events: ["bot_token", "guild_events_read"],
      create_invite_link: ["bot_token", "guild_manage", "invite_create"]
    }),
    membershipMutation: false
  }),
  slack: Object.freeze({
    adapterId: "slack-app",
    supportedOperations: Object.freeze(["send_message", "read_events"]),
    requiredScopes: Object.freeze({
      send_message: ["bot_token", "chat_write"],
      read_events: ["bot_token", "events_read"]
    }),
    membershipMutation: false
  })
});

const ENGINE_IDS = Object.freeze([
  "messenger_connection",
  "audience_campaign",
  "points_referrals",
  "analytics_reporting",
  "revenue_subscription_wallet"
]);

class PivandError extends Error {
  constructor(code) {
    super(code);
    this.name = "PivandError";
    this.code = code;
  }
}

function assertText(value, code) {
  if (typeof value !== "string" || !value.trim() || value.length > 160) {
    throw new PivandError(code);
  }
  return value.trim();
}

function assertObject(value, code) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new PivandError(code);
  }
  return value;
}

class MessengerConnectionEngine {
  constructor({ authorize, audit } = {}) {
    if (typeof authorize !== "function") throw new PivandError("AUTHORIZATION_CALLBACK_REQUIRED");
    if (typeof audit !== "function") throw new PivandError("AUDIT_CALLBACK_REQUIRED");
    this.authorize = authorize;
    this.audit = audit;
    this.adapters = new Map();
  }

  listPlatforms() {
    return Object.entries(PLATFORM_CAPABILITIES).map(([platform, contract]) => ({
      platform,
      adapterId: contract.adapterId,
      configured: this.adapters.has(platform),
      supportedOperations: [...contract.supportedOperations],
      membershipMutation: false
    }));
  }

  registerAdapter({ platform, execute, credentialRef, grantedScopes = [] }) {
    const contract = PLATFORM_CAPABILITIES[platform];
    if (!contract) throw new PivandError("UNSUPPORTED_PLATFORM");
    if (typeof execute !== "function") throw new PivandError("ADAPTER_EXECUTOR_REQUIRED");
    assertText(credentialRef, "CREDENTIAL_REFERENCE_REQUIRED");
    if (!Array.isArray(grantedScopes) || grantedScopes.some(scope => typeof scope !== "string")) {
      throw new PivandError("INVALID_GRANTED_SCOPES");
    }
    this.adapters.set(platform, Object.freeze({
      execute,
      credentialRef,
      grantedScopes: new Set(grantedScopes)
    }));
    return { platform, adapterId: contract.adapterId, configured: true, liveConnectionVerified: false };
  }

  async execute({ platform, operation, tenantId, actorId, requestId, consent, adminAuthorized, payload = {} }) {
    const contract = PLATFORM_CAPABILITIES[platform];
    if (!contract) throw new PivandError("UNSUPPORTED_PLATFORM");
    if (!contract.supportedOperations.includes(operation)) throw new PivandError("OPERATION_NOT_ALLOWED");
    assertText(tenantId, "TENANT_REQUIRED");
    assertText(actorId, "ACTOR_REQUIRED");
    assertText(requestId, "REQUEST_ID_REQUIRED");
    if (consent !== true) throw new PivandError("USER_CONSENT_REQUIRED");
    assertObject(payload, "INVALID_PAYLOAD");
    const requiredScopes = contract.requiredScopes[operation] || [];
    if (requiredScopes.includes("chat_admin") || requiredScopes.includes("guild_manage")) {
      if (adminAuthorized !== true) throw new PivandError("PLATFORM_ADMIN_PERMISSION_REQUIRED");
    }
    if (await this.authorize({ platform, operation, tenantId, actorId }) !== true) {
      throw new PivandError("ACCESS_DENIED");
    }
    const adapter = this.adapters.get(platform);
    if (!adapter) throw new PivandError("ADAPTER_NOT_CONFIGURED_FAIL_CLOSED");
    const missingScopes = requiredScopes.filter(scope => !adapter.grantedScopes.has(scope));
    if (missingScopes.length) throw new PivandError("PLATFORM_SCOPE_MISSING");
    await this.audit({ event: "PIVAND_ADAPTER_REQUESTED", platform, operation, tenantId, actorId, requestId });
    const result = await adapter.execute({ operation, tenantId, actorId, requestId, payload });
    await this.audit({ event: "PIVAND_ADAPTER_SUCCEEDED", platform, operation, tenantId, actorId, requestId });
    return { platform, operation, result, liveConnectionVerified: false };
  }
}

class AudienceCampaignEngine {
  constructor({ authorize, audit } = {}) {
    if (typeof authorize !== "function" || typeof audit !== "function") throw new PivandError("ENGINE_CALLBACKS_REQUIRED");
    this.authorize = authorize;
    this.audit = audit;
  }

  async createCampaign({ tenantId, actorId, campaignId, audienceConsent, audienceSize, content }) {
    assertText(tenantId, "TENANT_REQUIRED");
    assertText(actorId, "ACTOR_REQUIRED");
    assertText(campaignId, "CAMPAIGN_ID_REQUIRED");
    if (audienceConsent !== true) throw new PivandError("AUDIENCE_CONSENT_REQUIRED");
    if (!Number.isInteger(audienceSize) || audienceSize < 0) throw new PivandError("INVALID_AUDIENCE_SIZE");
    assertText(content, "CAMPAIGN_CONTENT_REQUIRED");
    if (await this.authorize({ tenantId, actorId, operation: "campaign.create" }) !== true) {
      throw new PivandError("ACCESS_DENIED");
    }
    const result = { campaignId, state: "DRAFT", audienceSize, deliveryStarted: false };
    await this.audit({ event: "PIVAND_CAMPAIGN_DRAFTED", tenantId, actorId, campaignId });
    return result;
  }
}

class PointsReferralEngine {
  constructor({ authorize, audit, pointsPerReferral = 0 } = {}) {
    if (typeof authorize !== "function" || typeof audit !== "function") throw new PivandError("ENGINE_CALLBACKS_REQUIRED");
    if (!Number.isInteger(pointsPerReferral) || pointsPerReferral < 0 || pointsPerReferral > 10000) {
      throw new PivandError("INVALID_REFERRAL_REWARD");
    }
    this.authorize = authorize;
    this.audit = audit;
    this.pointsPerReferral = pointsPerReferral;
  }

  async recordReferral({ tenantId, actorId, referralId, inviterId, inviteeConsent, qualifyingEvent }) {
    for (const [value, code] of [[tenantId, "TENANT_REQUIRED"], [actorId, "ACTOR_REQUIRED"], [referralId, "REFERRAL_ID_REQUIRED"], [inviterId, "INVITER_REQUIRED"]]) {
      assertText(value, code);
    }
    if (inviteeConsent !== true) throw new PivandError("INVITEE_CONSENT_REQUIRED");
    if (qualifyingEvent !== true) throw new PivandError("REFERRAL_QUALIFICATION_REQUIRED");
    if (await this.authorize({ tenantId, actorId, operation: "referral.record" }) !== true) {
      throw new PivandError("ACCESS_DENIED");
    }
    await this.audit({ event: "PIVAND_REFERRAL_RECORDED", tenantId, actorId, referralId, inviterId });
    return { referralId, state: "RECORDED_PENDING_REVIEW", points: this.pointsPerReferral, autoPayout: false };
  }
}

class AnalyticsReportingEngine {
  constructor({ authorize, audit } = {}) {
    if (typeof authorize !== "function" || typeof audit !== "function") throw new PivandError("ENGINE_CALLBACKS_REQUIRED");
    this.authorize = authorize;
    this.audit = audit;
  }

  async buildReport({ tenantId, actorId, reportId, metrics = {} }) {
    assertText(tenantId, "TENANT_REQUIRED");
    assertText(actorId, "ACTOR_REQUIRED");
    assertText(reportId, "REPORT_ID_REQUIRED");
    assertObject(metrics, "INVALID_METRICS");
    if (await this.authorize({ tenantId, actorId, operation: "analytics.read" }) !== true) {
      throw new PivandError("ACCESS_DENIED");
    }
    const safeMetrics = {};
    for (const [key, value] of Object.entries(metrics)) {
      if (!/^[a-z][a-z0-9_]{0,63}$/.test(key) || typeof value !== "number" || !Number.isFinite(value)) {
        throw new PivandError("INVALID_METRIC");
      }
      safeMetrics[key] = value;
    }
    await this.audit({ event: "PIVAND_REPORT_BUILT", tenantId, actorId, reportId });
    return { reportId, metrics: safeMetrics, generated: true, source: "provided_aggregates_only" };
  }
}

class RevenueSubscriptionWalletEngine {
  constructor({ authorize, audit } = {}) {
    if (typeof authorize !== "function" || typeof audit !== "function") throw new PivandError("ENGINE_CALLBACKS_REQUIRED");
    this.authorize = authorize;
    this.audit = audit;
  }

  async createSubscriptionOffer({ tenantId, actorId, offerId, amountMinor, currency, period }) {
    assertText(tenantId, "TENANT_REQUIRED");
    assertText(actorId, "ACTOR_REQUIRED");
    assertText(offerId, "OFFER_ID_REQUIRED");
    if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) throw new PivandError("INVALID_AMOUNT");
    if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) throw new PivandError("INVALID_CURRENCY");
    if (!["monthly", "annual"].includes(period)) throw new PivandError("INVALID_SUBSCRIPTION_PERIOD");
    if (await this.authorize({ tenantId, actorId, operation: "revenue.offer.create" }) !== true) {
      throw new PivandError("ACCESS_DENIED");
    }
    await this.audit({ event: "PIVAND_SUBSCRIPTION_OFFER_DRAFTED", tenantId, actorId, offerId });
    return { offerId, amountMinor, currency, period, state: "DRAFT", paymentProviderConnected: false };
  }
}

function createPivandEngines({ authorize, audit, pointsPerReferral = 0 } = {}) {
  return Object.freeze({
    connection: new MessengerConnectionEngine({ authorize, audit }),
    campaigns: new AudienceCampaignEngine({ authorize, audit }),
    referrals: new PointsReferralEngine({ authorize, audit, pointsPerReferral }),
    analytics: new AnalyticsReportingEngine({ authorize, audit }),
    revenue: new RevenueSubscriptionWalletEngine({ authorize, audit })
  });
}

module.exports = {
  PivandError,
  PLATFORM_CAPABILITIES,
  ENGINE_IDS,
  MessengerConnectionEngine,
  AudienceCampaignEngine,
  PointsReferralEngine,
  AnalyticsReportingEngine,
  RevenueSubscriptionWalletEngine,
  createPivandEngines
};
