"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");

const cases = [
  ["ARIA-IDEA-BACKLOG-021", { channels: ["instagram", "blog"], contentItems: [{ title: "Launch", format: "post", publishAt: "2026-12-01" }] }, "contentCalendar", x => x.entries.length === 1 && x.channels.length === 2],
  ["ARIA-IDEA-BACKLOG-022", { sourceContent: "A long-form product guide", targetFormats: ["email", "carousel"] }, "repurposedAssets", x => x.variants.length === 2 && x.sourceReferenceRequired],
  ["ARIA-IDEA-BACKLOG-023", { brandVoice: ["clear", "helpful"], approvedTerms: ["VAYRO"], contentSamples: ["Welcome to VAYRO"] }, "brandAudit", x => x.rules.length >= 2 && x.samplesReviewed === 1],
  ["ARIA-IDEA-BACKLOG-024", { audience: "small businesses", objective: "qualified leads", channels: ["email"], budget: 100 }, "campaignBlueprint", x => x.kpis.length >= 3 && x.budgetReview === "OWNER_CONFIRMATION_REQUIRED"],
  ["ARIA-IDEA-BACKLOG-025", { feedback: [{ id: "f1", text: "Fast support", sentiment: "positive" }, { id: "f2", text: "Confusing setup", sentiment: "negative" }] }, "feedbackInsights", x => x.themes.length >= 1 && x.feedbackCount === 2],
  ["ARIA-IDEA-BACKLOG-026", { sourceText: "Hello world", sourceLanguage: "en", targetLanguages: ["fa", "az"], timingMode: "sentence" }, "subtitlePlan", x => x.languageJobs.length === 2 && x.alignmentReviewRequired],
  ["ARIA-IDEA-BACKLOG-027", { assets: [{ id: "a1", name: "Logo", license: "owned", version: "1.0" }] }, "assetRegister", x => x.assets.length === 1 && x.rightsReviewQueue.length === 0],
  ["ARIA-IDEA-BACKLOG-028", { publication: { title: "Release", channel: "blog", draft: "Draft text" }, checks: ["links", "metadata"] }, "publishingQa", x => x.checks.length >= 2 && x.publishState === "BLOCKED_PENDING_APPROVAL"],
  ["ARIA-IDEA-BACKLOG-029", { storyGoal: "Explain a product", audience: "new users", scenes: [{ title: "Problem" }, { title: "Solution" }] }, "storyboard", x => x.scenes.length === 2 && x.reviewRequired],
  ["ARIA-IDEA-BACKLOG-030", { learningObjectives: ["identify", "apply"], activities: [{ id: "a1", objective: "identify" }], outcomes: [{ objective: "identify", score: 4 }] }, "learningImpact", x => x.objectiveCoverage.length === 2 && x.measurementState === "USER_DATA_ONLY"]
];

for (const [id, context, outputKey, predicate] of cases) {
  test(id + " executes a dedicated domain workflow", async () => {
    const module = MODULES.find(item => item.manifest.moduleId === id);
    assert.ok(module, id);
    const result = await module.execute(
      { goal: "Prepare a reviewable domain result for " + id, context, consent: true },
      { actorId: "wave-three-actor", tenantId: "wave-three-tenant" }
    );
    const domain = result.artifact.domainResult;
    assert.equal(result.domainLogicExecuted, true);
    assert.equal(domain.tenantScope, "wave-three-tenant");
    assert.ok(domain.domainOutput && domain.domainOutput[outputKey], "missing " + outputKey);
    assert.equal(predicate(domain.domainOutput[outputKey]), true, "incomplete " + outputKey);
    assert.equal(domain.moduleSpecificProfile.specialization, domain.artifactType);
    assert.equal(result.externalExecutionPerformed, false);
    assert.equal(result.paymentExecuted, false);
    assert.equal(result.productionVerified, false);
  });
}

test("wave-three idea handlers reject invalid goal and missing tenant", async () => {
  const module = MODULES.find(item => item.manifest.moduleId === "ARIA-IDEA-BACKLOG-021");
  await assert.rejects(module.execute({ goal: "", context: {}, consent: true }, { actorId: "a", tenantId: "t" }), { message: "MODULE_INPUT_MISSING" });
  await assert.rejects(module.execute({ goal: "Build a content calendar", context: {}, consent: true }, { actorId: "a" }), { message: "MODULE_TENANT_REQUIRED" });
});
