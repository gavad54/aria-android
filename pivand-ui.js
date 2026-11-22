"use strict";

const ENGINE_LABELS = Object.freeze({
  messenger_connection: "اتصال پیام‌رسان‌ها",
  audience_campaign: "جذب مخاطب و کمپین",
  points_referrals: "امتیاز و دعوت دوستان",
  analytics_reporting: "تحلیل و گزارش",
  revenue_subscription_wallet: "درآمد، اشتراک و کیف پول"
});

const PLATFORM_LABELS = Object.freeze({
  telegram: "تلگرام",
  whatsapp_business: "واتساپ بیزینس",
  discord: "دیسکورد",
  slack: "اسلک"
});

function normalizePivandStatus(payload) {
  if (!payload || payload.product !== "PIVAND" || payload.parentProduct !== "ARIA") {
    throw new Error("PIVAND_STATUS_CONTRACT_INVALID");
  }
  if (!Array.isArray(payload.engines) || payload.engines.length !== 5) {
    throw new Error("PIVAND_ENGINE_REGISTRY_INVALID");
  }
  if (!Array.isArray(payload.platforms)) {
    throw new Error("PIVAND_PLATFORM_REGISTRY_INVALID");
  }
  return {
    product: payload.product,
    parentProduct: payload.parentProduct,
    integrationState: String(payload.integrationState || "UNVERIFIED"),
    liveProviderConnections: Number.isInteger(payload.liveProviderConnections) ? payload.liveProviderConnections : 0,
    externalDeliveryEnabled: payload.externalDeliveryEnabled === true,
    engines: payload.engines.map(engine => ({
      id: String(engine.id),
      label: ENGINE_LABELS[engine.id] || String(engine.id),
      state: String(engine.state || "UNVERIFIED"),
      persistentStorage: String(engine.persistentStorage || "UNVERIFIED")
    })),
    platforms: payload.platforms.map(platform => ({
      id: String(platform.platform),
      label: PLATFORM_LABELS[platform.platform] || String(platform.platform),
      adapterId: String(platform.adapterId || ""),
      state: String(platform.adapterState || "UNVERIFIED"),
      operations: Array.isArray(platform.operations) ? platform.operations.map(String) : [],
      membershipMutation: platform.membershipMutation === true,
      liveConnectionVerified: platform.liveConnectionVerified === true
    })),
    limitations: Array.isArray(payload.limitations) ? payload.limitations.map(String) : []
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { normalizePivandStatus };
} else if (typeof document !== "undefined") {
  const root = document.getElementById("pivand-status");
  const state = document.getElementById("pivand-state");
  const enginesRoot = document.getElementById("pivand-engines");
  const platformsRoot = document.getElementById("pivand-platforms");
  const limitationsRoot = document.getElementById("pivand-limitations");

  function addCard(parent, title, description, meta) {
    const card = document.createElement("article");
    card.className = "glass module-card";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const body = document.createElement("p");
    body.textContent = description;
    const footer = document.createElement("div");
    footer.className = "module-meta";
    const badge = document.createElement("span");
    badge.className = "state";
    badge.textContent = meta;
    footer.appendChild(badge);
    card.append(heading, body, footer);
    parent.appendChild(card);
  }

  async function loadPivand() {
    if (!root) return;
    try {
      const response = await fetch("/api/pivand/engines", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin"
      });
      if (!response.ok) throw new Error("PIVAND_STATUS_HTTP_" + response.status);
      const data = normalizePivandStatus(await response.json());
      state.textContent = data.integrationState + " · " +
        data.liveProviderConnections + " اتصال زنده · " +
        (data.externalDeliveryEnabled ? "ارسال بیرونی فعال" : "ارسال بیرونی غیرفعال");
      for (const engine of data.engines) {
        addCard(enginesRoot, engine.label, "وضعیت ذخیره‌سازی: " + engine.persistentStorage, engine.state);
      }
      for (const platform of data.platforms) {
        const operations = platform.operations.length ? platform.operations.join("، ") : "عملیات ثبت نشده";
        addCard(platformsRoot, platform.label, "آداپتور: " + platform.adapterId + " · عملیات: " + operations,
          platform.state + (platform.membershipMutation ? " · تغییر عضویت پشتیبانی می‌شود" : " · تغییر عضویت پشتیبانی نمی‌شود"));
      }
      for (const limitation of data.limitations) {
        const item = document.createElement("li");
        item.textContent = limitation;
        limitationsRoot.appendChild(item);
      }
    } catch (_) {
      state.textContent = "وضعیت از سرور دریافت نشد؛ اتصال و قابلیت‌ها تأییدنشده هستند.";
    }
  }

  loadPivand();
}
