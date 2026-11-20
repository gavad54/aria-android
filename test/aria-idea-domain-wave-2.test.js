"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULE_BY_ID } = require("../backend/modules");

const cases = [
  ["ARIA-IDEA-BACKLOG-011", { entities: [{ id: "e1", label: "AI" }, { id: "e2", label: "learning" }], relationships: [{ from: "e1", to: "e2", type: "supports" }], sources: [{ id: "s1", title: "Provided source" }] }, "knowledgeGraph", value => value.nodes.length === 2 && value.edges.length === 1 && value.sourceReferences.length === 1],
  ["ARIA-IDEA-BACKLOG-012", { targetSkills: ["research", "writing"], currentLevel: "beginner", weeklyMinutes: 120, learningObjectives: ["write a sourced summary"] }, "learningPath", value => value.stages.length >= 2 && value.milestones.length >= 1],
  ["ARIA-IDEA-BACKLOG-013", { skill: "source evaluation", difficulty: "beginner", practiceItems: [{ prompt: "Identify the author", expectedEvidence: ["author"] }] }, "practicePlan", value => value.exercises.length === 1 && value.scoringRubric.length >= 2],
  ["ARIA-IDEA-BACKLOG-014", { sources: [{ id: "s1", title: "Study", author: "A. Author", publishedAt: "2025-01-01", sourceType: "journal" }, { id: "s2", title: "Untitled" }] }, "sourceReview", value => value.sourceCards.length === 2 && value.sourceCards.some(item => item.missingMetadata.length > 0)],
  ["ARIA-IDEA-BACKLOG-015", { papers: [{ id: "p1", title: "Learning systems", keywords: ["learning", "AI"], finding: "A" }, { id: "p2", title: "AI education", keywords: ["AI", "education"], finding: "B" }] }, "literatureSynthesis", value => value.clusters.length > 0 && value.evidenceMatrix.length === 2],
  ["ARIA-IDEA-BACKLOG-016", { competencies: [{ name: "critical thinking", indicators: ["compare evidence", "explain reasoning"] }], levels: ["emerging", "developing", "proficient"] }, "competencyRubric", value => value.competencies.length === 1 && value.levels.length === 3],
  ["ARIA-IDEA-BACKLOG-017", { role: "junior analyst", competencies: ["communication", "reasoning"], questionBank: [{ question: "Explain a decision", competency: "reasoning" }] }, "interviewPlan", value => value.questionSets.length === 1 && value.feedbackDimensions.includes("evidence")],
  ["ARIA-IDEA-BACKLOG-018", { task: "organize digital files", tool: "file manager", device: "mobile", skillLevel: "beginner" }, "digitalGuide", value => value.steps.length >= 3 && value.safetyChecks.length > 0],
  ["ARIA-IDEA-BACKLOG-019", { documents: [{ id: "d1", title: "Policy", version: "1.0", owner: "team-a", access: "private" }, { id: "d2", title: "Guide", version: "2.0", owner: "team-a", access: "team" }] }, "knowledgeArchive", value => value.records.length === 2 && value.accessRules.length > 0],
  ["ARIA-IDEA-BACKLOG-020", { skill: "data analysis", evidenceItems: [{ id: "ev1", type: "project", description: "Completed project", issuer: "self", date: "2026-01-01" }], sharingConsent: false }, "skillPassport", value => value.evidenceRecords.length === 1 && value.sharing.state === "PRIVATE"]
];

for (const [id, context, outputKey, predicate] of cases) {
  test("idea module " + id + " emits its own domain result", async () => {
    const module = MODULE_BY_ID.get(id);
    assert.ok(module, id);
    const result = await module.execute(
      { goal: "Create a reviewable result for " + id, context, consent: true },
      { actorId: "wave-two-test-actor", tenantId: "wave-two-test-tenant" }
    );
    const domain = result.artifact.domainResult;
    assert.equal(result.domainLogicExecuted, true);
    assert.equal(domain.tenantScope, "wave-two-test-tenant");
    assert.ok(domain.domainOutput && domain.domainOutput[outputKey], id + " missing " + outputKey);
    assert.equal(predicate(domain.domainOutput[outputKey]), true, id + " returned an incomplete domain result");
    assert.equal(result.externalExecutionPerformed, false);
    assert.equal(result.paymentExecuted, false);
    assert.equal(result.productionVerified, false);
  });
}

test("wave-two idea handlers reject invalid goal and preserve tenant boundary", async () => {
  const module = MODULE_BY_ID.get("ARIA-IDEA-BACKLOG-011");
  await assert.rejects(module.execute({ goal: "", context: {}, consent: true }, { actorId: "a", tenantId: "t" }), { message: "MODULE_INPUT_MISSING" });
  await assert.rejects(module.execute({ goal: "map", context: {}, consent: true }, { actorId: "a" }), { message: "MODULE_TENANT_REQUIRED" });
});
