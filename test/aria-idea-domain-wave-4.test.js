"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");

const cases = [
  ["031", { providers: [{ id: "p1", name: "Provider A", criteria: { quality: 4, price: 3 } }, { id: "p2", name: "Provider B", criteria: { quality: 3, price: 5 } }], weights: { quality: 0.7, price: 0.3 } }, "providerComparison", x => x.rankings.length === 2 && x.rankings[0].score !== undefined && x.explanations.length === 2],
  ["032", { resources: [{ id: "r1", capacity: 1 }], appointments: [{ id: "a1", resourceId: "r1", start: "2026-12-01T09:00:00Z", end: "2026-12-01T09:30:00Z" }, { id: "a2", resourceId: "r1", start: "2026-12-01T09:00:00Z", end: "2026-12-01T09:30:00Z" }] }, "queueSchedule", x => x.appointments.length === 2 && x.conflicts.length === 1 && x.externalNotificationsSent === false],
  ["033", { assets: [{ id: "asset-1", name: "Generator", lastMaintenance: "2026-01-01", intervalDays: 90 }] }, "maintenancePlan", x => x.assets.length === 1 && x.assets[0].nextDueDate === "2026-04-01" && x.remindersScheduled === false],
  ["034", { event: { title: "Community Day", date: "2026-12-10", venue: "Hall A" }, tasks: [{ id: "t1", title: "Book venue", dueDate: "2026-12-01" }, { id: "t2", title: "Publish notice", dueDate: "2026-12-03" }] }, "eventPlan", x => x.tasks.length === 2 && x.timeline.length >= 2 && x.publicationState === "DRAFT_ONLY"],
  ["035", { places: [{ id: "l1", name: "Library", attributes: [{ key: "step_free_entry", value: true, evidence: "site-audit-1", verified: true }, { key: "accessible_toilet", value: true, verified: false }] }] }, "accessibilityDirectory", x => x.places.length === 1 && x.places[0].verifiedAttributes.length === 1 && x.places[0].unverifiedAttributes.length === 1],
  ["036", { missions: [{ id: "m1", requiredSkills: ["first-aid", "organizing"], capacity: 1 }], volunteers: [{ id: "v1", skills: ["first-aid", "organizing"], consent: true }, { id: "v2", skills: ["organizing"], consent: false }] }, "volunteerMatches", x => x.matches.length === 1 && x.matches[0].volunteerId === "v1" && x.unmatchedMissions.length === 0],
  ["037", { issues: [{ id: "i1", title: "Broken streetlight", category: "infrastructure", urgency: "high", status: "open" }, { id: "i2", title: "Suggestion", category: "general", urgency: "low", status: "open" }] }, "issueRegister", x => x.items.length === 2 && x.items[0].priorityRank < x.items[1].priorityRank && x.resolutionActionsExecuted === false],
  ["038", { constraints: { startDate: "2026-12-01", days: 2, maxStopsPerDay: 2 }, stops: [{ id: "s1", day: 1, name: "Museum" }, { id: "s2", day: 1, name: "Park" }, { id: "s3", day: 2, name: "Market" }] }, "itinerary", x => x.days.length === 2 && x.days[0].stops.length === 2 && x.externalBookingsMade === false],
  ["039", { carePlan: { recipientId: "r1", consent: true }, tasks: [{ id: "c1", title: "Grocery pickup", assigneeId: "helper-1", category: "daily-living" }, { id: "c2", title: "Medication adjustment", assigneeId: "helper-1", category: "clinical" }] }, "careCoordination", x => x.tasks.length === 2 && x.tasks[0].state === "READY_FOR_CONFIRMATION" && x.tasks[1].state === "OUT_OF_SCOPE_CLINICAL"],
  ["040", { offers: [{ id: "o1", ownerId: "u1", skill: "woodworking", hours: 2 }], requests: [{ id: "q1", requesterId: "u2", skill: "woodworking", hours: 1 }] }, "skillExchange", x => x.matches.length === 1 && x.matches[0].offerId === "o1" && x.matches[0].agreementState === "PROPOSED_NOT_ACCEPTED"]
];

for (const [sequence, context, outputKey, predicate] of cases) {
  test("ARIA-IDEA-BACKLOG-" + sequence + " runs a dedicated domain workflow", async () => {
    const id = "ARIA-IDEA-BACKLOG-" + sequence;
    const module = MODULES.find(item => item.manifest.moduleId === id);
    assert.ok(module, id);
    const result = await module.execute(
      { goal: "Prepare a reviewable domain result for " + id, context, consent: true },
      { actorId: "wave-four-actor", tenantId: "wave-four-tenant" }
    );
    const domain = result.artifact.domainResult;
    assert.equal(result.domainLogicExecuted, true);
    assert.equal(domain.tenantScope, "wave-four-tenant");
    assert.ok(domain.domainOutput && domain.domainOutput[outputKey], "missing " + outputKey);
    assert.equal(predicate(domain.domainOutput[outputKey]), true, "incomplete " + outputKey);
    assert.equal(domain.moduleSpecificProfile.specialization, domain.artifactType);
    assert.equal(result.externalExecutionPerformed, false);
    assert.equal(result.paymentExecuted, false);
    assert.equal(result.productionVerified, false);
  });
}

test("wave-four rejects missing tenant and invalid goal", async () => {
  const module = MODULES.find(item => item.manifest.moduleId === "ARIA-IDEA-BACKLOG-031");
  await assert.rejects(module.execute({ goal: "", context: {}, consent: true }, { actorId: "a", tenantId: "t" }), { message: "MODULE_INPUT_MISSING" });
  await assert.rejects(module.execute({ goal: "Compare providers", context: {} }, { actorId: "a" }), { message: "MODULE_TENANT_REQUIRED" });
});
