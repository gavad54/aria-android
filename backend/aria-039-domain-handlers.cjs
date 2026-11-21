"use strict";

function object(value) { return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
function list(value) { return Array.isArray(value) ? value.slice(0, 500) : []; }
function str(value, fallback = "") { return typeof value === "string" ? value.trim().slice(0, 2000) : fallback; }
function num(value) { return typeof value === "number" && Number.isFinite(value) ? value : 0; }
function sum(items, key = "amount") { return items.reduce((total, item) => total + Math.max(0, num(object(item)[key])), 0); }
function unique(items, keyFn = x => String(x).trim().toLowerCase()) { const seen = new Set(); return items.filter(x => { const k = keyFn(x); if (!k || seen.has(k)) return false; seen.add(k); return true; }); }

const handlers = {
  personal_finance: c => {
    const incomes = list(c.incomes || c.incomeItems);
    const expenses = list(c.expenses);
    const incomeTotal = incomes.length ? sum(incomes) : Math.max(0, num(c.income));
    const expenseTotal = expenses.length ? sum(expenses) : Math.max(0, num(c.fixedCosts)) + Math.max(0, num(c.variableCosts));
    const budgetLimits = object(c.budgetLimits);
    const overLimitCategories = expenses.filter(x => num(object(x).amount) > num(budgetLimits[object(x).category]));
    return { incomeTotal, expenseTotal, remainingBalance: incomeTotal - expenseTotal, expenseCategories: [...new Set(expenses.map(x => str(object(x).category)).filter(Boolean))], overLimitCategories, scenarioInputsRequired: !incomes.length && !expenses.length };
  },
  career_guidance: c => ({ jobRequirements: list(c.jobRequirements), interviewQuestions: list(c.interviewQuestions).length ? list(c.interviewQuestions) : ["شرح تجربه مرتبط", "نمونه حل مسئله", "معیارهای موفقیت"], practiceResponses: list(c.practiceResponses), evidenceGaps: list(c.requiredEvidence).filter(x => !list(c.providedEvidence).includes(x)), applicationReview: "HUMAN_REVIEW_REQUIRED" }),
  small_business_inventory: c => {
    const items = list(c.items);
    const stock = items.map(x => ({ sku: str(object(x).sku), onHand: Math.max(0, num(object(x).onHand)), reorderPoint: Math.max(0, num(object(x).reorderPoint)), reorderQuantity: Math.max(0, num(object(x).reorderQuantity)) }));
    return { itemCount: stock.length, stock, lowStockItems: stock.filter(x => x.onHand <= x.reorderPoint), suggestedPurchaseList: stock.filter(x => x.onHand <= x.reorderPoint).map(x => ({ sku: x.sku, quantity: x.reorderQuantity })), stockValue: items.reduce((a, x) => a + Math.max(0, num(object(x).onHand)) * Math.max(0, num(object(x).unitCost)), 0) };
  },
  customer_request_management: c => ({ category: str(c.category, "UNCLASSIFIED"), urgency: ["low", "normal", "high", "urgent"].includes(c.urgency) ? c.urgency : "REQUIRES_TRIAGE", queue: list(c.openRequests).map((x, i) => ({ requestId: str(object(x).id), position: i + 1 })), responseDraft: str(c.responseDraft, "پیش‌نویس پاسخ پس از تکمیل اطلاعات درخواست تهیه می‌شود."), resolutionEvidence: list(c.resolutionEvidence) }),
  appointment_coordination: c => {
    const slots = list(c.availabilitySlots);
    const bookings = list(c.existingBookings);
    const conflictKeys = new Set(bookings.map(x => str(object(x).slotKey)).filter(Boolean));
    const proposedSlots = slots.filter(x => !conflictKeys.has(str(object(x).slotKey))).slice(0, 20);
    return { proposedSlots, conflictingBookings: bookings.filter(x => conflictKeys.has(str(object(x).slotKey))), confirmationRequired: true, appointmentRecorded: false };
  },
  event_planning: c => {
    const tasks = list(c.tasks);
    return { scope: object(c.scope), timeline: tasks.map((x, i) => ({ ...object(x), sequence: i + 1 })), taskCount: tasks.length, estimatedBudget: sum(list(c.costItems)), budgetCurrency: str(c.currency) || null, readinessGaps: list(c.readinessRequirements).filter(x => !list(c.completedRequirements).includes(x)) };
  },
  travel_planning: c => {
    const reservations = list(c.sharedReservations);
    const conflicts = reservations.filter(x => object(x).conflict === true || object(x).status === "CONFLICT");
    return { participants: list(c.participants), sharedConstraints: list(c.groupConstraints), reservations, scheduleConflicts: conflicts, disruptionOptions: list(c.disruptionOptions), confirmationRequired: true, bookingExecuted: false };
  },
  local_services_discovery: c => {
    const claims = list(c.claims);
    const evidence = list(c.providerEvidence);
    const evidenceIds = new Set(evidence.map(x => str(object(x).claimId)).filter(Boolean));
    return { providerId: str(c.providerId) || null, evidenceCount: evidence.length, claimReview: claims.map(x => ({ claim: x, evidencePresent: evidenceIds.has(str(object(x).id)), state: evidenceIds.has(str(object(x).id)) ? "EVIDENCE_ATTACHED_NOT_VERIFIED" : "UNVERIFIED" })), reviewDecision: "HUMAN_VERIFICATION_REQUIRED" };
  },
  digital_accessibility: c => ({ targetTechnologies: list(c.assistiveTechnologies), userJourneys: list(c.userJourneys), testCases: list(c.testCases).length ? list(c.testCases) : ["صفحه‌کلید", "صفحه‌خوان", "بزرگ‌نمایی", "ترتیب فوکوس", "کنتراست"], observedBarriers: list(c.observedBarriers), compatibilityConclusion: "NOT_VERIFIED_UNTIL_TEST_EVIDENCE" }),
  terminology_management: c => {
    const terms = unique(list(c.terms).map(x => typeof x === "string" ? x : str(object(x).term)).filter(Boolean));
    return { extractedTerms: terms, proposedEquivalents: object(c.proposedEquivalents), ambiguousTerms: list(c.ambiguousTerms), glossaryVersion: Math.max(1, Math.floor(num(c.glossaryVersion) || 1)), approvalRequired: true };
  },
  knowledge_base: c => {
    const sources = list(c.sources);
    const claims = list(c.claims);
    return { sourceCount: sources.length, sources, claims: claims.map(x => ({ claim: x, citationAttached: sources.some(s => str(object(s).id) === str(object(x).sourceId)) })), articles: list(c.articleDrafts), versionReviewRequired: true };
  },
  research_synthesis: c => ({ researchQuestion: str(c.researchQuestion), screenedSources: list(c.sources), findings: list(c.findings), evidenceGaps: list(c.evidenceGaps), synthesisDraft: str(c.synthesisDraft), confidence: "NOT_SCORED_WITHOUT_SOURCE_QUALITY_REVIEW" }),
  study_planning: c => {
    const topics = list(c.topics);
    const hours = Math.max(0, num(c.availableHoursPerWeek));
    return { baseline: object(c.baseline), studyPlan: topics.map((topic, i) => ({ topic, sequence: i + 1, suggestedHours: topics.length ? Math.round(hours / topics.length * 100) / 100 : 0 })), revisionTasks: list(c.revisionTasks), progressEvidence: list(c.progressEvidence) };
  },
  language_practice: c => ({ proficiencyRubric: object(c.rubric), submittedResponses: list(c.responses), assessedResponseCount: list(c.responses).length, competencyGaps: list(c.competencyGaps), score: null, scoreState: "AWAITING_VALIDATED_RUBRIC_AND_RESPONSE_REVIEW" }),
  portfolio_management: c => {
    const projects = list(c.projects);
    const skills = unique(list(c.targetSkills).map(str).filter(Boolean));
    const evidenced = new Set(projects.flatMap(x => list(object(x).skills).map(str)));
    return { projects, mappedSkills: skills.map(skill => ({ skill, evidencePresent: evidenced.has(skill) })), evidenceGaps: skills.filter(skill => !evidenced.has(skill)), portfolioReviewRequired: true };
  },
  volunteer_coordination: c => {
    const volunteers = list(c.volunteers);
    const roles = list(c.roles);
    return { assignments: roles.map(role => ({ role, candidates: volunteers.filter(v => list(object(v).skills).includes(str(object(role).requiredSkill))).map(v => str(object(v).id)).filter(Boolean) })), capacityRisks: volunteers.filter(v => num(object(v).availableHours) <= 0), assignmentExecuted: false };
  },
  donation_transparency: c => {
    const records = list(c.donationRecords);
    const allocations = list(c.allocations);
    const donated = sum(records);
    const allocated = sum(allocations);
    return { campaign: object(c.campaign), donationTotal: donated, allocationTotal: allocated, unallocatedBalance: donated - allocated, recordGaps: list(c.requiredRecordFields).filter(field => records.some(r => !Object.prototype.hasOwnProperty.call(object(r), field))), reconciliationState: donated === allocated ? "BALANCED" : "REVIEW_REQUIRED" };
  },
  repair_lifecycle: c => ({ asset: object(c.asset), issue: str(c.issue), diagnosticChecklist: list(c.diagnosticChecklist).length ? list(c.diagnosticChecklist) : ["شرح مشکل", "شواهد/تصویر", "برآورد اولیه", "تأیید پیشنهاد"], quote: object(c.quote), handoverEvidence: list(c.handoverEvidence), lifecycleState: c.handoverEvidence ? "HANDOVER_REVIEW" : "DIAGNOSIS_OR_QUOTE_PENDING" }),
  building_energy_review: c => {
    const readings = list(c.readings).map(x => num(object(x).value)).filter(Number.isFinite);
    const baseline = readings.length ? readings.reduce((a, b) => a + b, 0) / readings.length : null;
    const threshold = Math.max(0, num(c.anomalyThreshold));
    return { readingsCount: readings.length, baseline, anomalies: baseline === null ? [] : readings.filter(x => threshold > 0 && Math.abs(x - baseline) > threshold), savingsOptions: list(c.savingsOptions), savingsEstimate: Math.max(0, num(c.estimatedSavings)), unit: str(c.unit) || null };
  },
  waste_sorting_guidance: c => ({ materials: list(c.materials), localRules: list(c.localRules), sortingGuide: list(c.materials).map(material => ({ material, rule: object(c.materialRules)[str(material)] || "LOCAL_RULE_CONFIRMATION_REQUIRED" })), collectionSchedule: list(c.collectionSchedule), outcomeEvidence: list(c.outcomeEvidence) }),
  agriculture_planning: c => ({ fieldProfile: object(c.field), seasonalTasks: list(c.seasonalTasks), resourceConstraints: list(c.resourceConstraints), operationSchedule: list(c.seasonalTasks).map((task, i) => ({ task, sequence: i + 1 })), riskReview: list(c.risks) }),
  supplier_comparison: c => {
    const offers = list(c.offers).map(x => ({ supplier: str(object(x).supplier), price: Math.max(0, num(object(x).price)), deliveryDays: Math.max(0, num(object(x).deliveryDays)), qualityScore: Math.max(0, Math.min(100, num(object(x).qualityScore))) }));
    const ranked = [...offers].sort((a, b) => a.price - b.price || a.deliveryDays - b.deliveryDays || b.qualityScore - a.qualityScore);
    return { normalizedOffers: offers, rankedOffers: ranked, missingFields: list(c.requiredFields).filter(field => offers.some(o => !Object.prototype.hasOwnProperty.call(o, field))), rankingPolicy: "PRICE_THEN_DELIVERY_THEN_QUALITY" };
  },
  supply_chain_coordination: c => {
    const milestones = list(c.milestones);
    return { dependencies: list(c.dependencies), milestones, delayedMilestones: milestones.filter(x => num(object(x).actualDay) > num(object(x).plannedDay)), contingencyPlans: list(c.contingencies), status: "LOCAL_REVIEW_ONLY" };
  },
  contract_review_checklist: c => ({ sections: list(c.sections), missingTerms: list(c.requiredTerms).filter(term => !list(c.sections).some(section => str(object(section).term) === str(term))), ambiguities: list(c.ambiguities), questionsForCounsel: list(c.questionsForCounsel), professionalReviewRequired: true, legalOpinionProvided: false }),
  document_workflow: c => ({ recordSeries: list(c.records), retentionRules: object(c.retentionRules), metadataGaps: list(c.requiredMetadata).filter(field => list(c.records).some(record => !Object.prototype.hasOwnProperty.call(object(record), field))), legalHold: c.legalHold === true, dispositionApprovalRequired: true, recordsDestroyed: false }),
  form_design: c => {
    const fields = list(c.fields);
    const names = fields.map(x => str(object(x).name)).filter(Boolean);
    return { schema: fields, duplicateFieldNames: names.filter((name, i) => names.indexOf(name) !== i), validationRules: object(c.validationRules), privacySensitiveFields: fields.filter(x => object(x).sensitive === true).map(x => str(object(x).name)), submissionTest: "NOT_EXECUTED_WITHOUT_TEST_PAYLOAD" };
  },
  survey_analysis: c => {
    const responses = list(c.responses);
    const scores = responses.map(x => num(object(x).score)).filter(x => x >= 0);
    return { responseCount: responses.length, completionCount: responses.filter(x => object(x).complete === true).length, averageScore: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null, feedbackThemes: unique(responses.map(x => str(object(x).theme)).filter(Boolean)), insightLimit: "DESCRIPTIVE_ONLY_UNTIL_SAMPLE_AND_BIAS_REVIEW" };
  },
  product_feedback: c => {
    const feedback = unique(list(c.feedback), x => str(object(x).text || x).toLowerCase());
    return { feedbackCount: list(c.feedback).length, deduplicatedCount: feedback.length, themes: unique(feedback.map(x => str(object(x).theme)).filter(Boolean)), roadmapLinks: list(c.roadmapLinks), impactEstimates: list(c.impactEstimates), prioritizationState: "REQUIRES_PRODUCT_REVIEW" };
  },
  quality_assurance: c => {
    const tests = list(c.tests);
    const defects = list(c.defects);
    return { qualityGates: list(c.qualityGates), testCount: tests.length, passedTests: tests.filter(x => object(x).status === "passed").length, failedTests: tests.filter(x => object(x).status === "failed"), defectCount: defects.length, prioritizedDefects: [...defects].sort((a, b) => num(object(b).severity) - num(object(a).severity)) };
  },
  risk_register: c => {
    const risks = list(c.risks).map(x => ({ ...object(x), likelihood: Math.max(1, Math.min(5, num(object(x).likelihood))), impact: Math.max(1, Math.min(5, num(object(x).impact))) })).map(x => ({ ...x, score: x.likelihood * x.impact }));
    return { risks, highRisks: risks.filter(x => x.score >= 15), ownersMissing: risks.filter(x => !str(x.owner)), mitigationReview: "REQUIRED" };
  },
  policy_compliance: c => {
    const obligations = list(c.obligations);
    const controls = list(c.controls);
    return { obligations, controlMappings: obligations.map(obligation => ({ obligation, controls: controls.filter(control => list(object(control).covers).includes(str(object(obligation).id))) })), evidenceGaps: obligations.filter(obligation => !controls.some(control => list(object(control).covers).includes(str(object(obligation).id)))), auditPack: list(c.evidence) };
  },
  connector_governance: c => {
    const connectors = list(c.connectors);
    return { connectors: connectors.map(x => ({ name: str(object(x).name), scopes: list(object(x).scopes), excessiveScopes: list(object(x).scopes).filter(scope => list(object(x).requiredScopes).length && !list(object(x).requiredScopes).includes(scope)), secretPresent: Boolean(object(x).secretReference), secretValueExposed: false, healthEvidence: object(x).healthEvidence || null })), rotationPlan: list(c.rotationPlan), leastPrivilegeReviewRequired: true };
  },
  privacy_governance: c => ({ requestType: str(c.requestType, "ACCESS"), requestScope: list(c.requestScope), declaredDataSources: list(c.declaredDataSources), taskPlan: list(c.declaredDataSources).map(source => ({ source, action: str(c.requestType, "ACCESS") === "DELETE" ? "PREPARE_DELETION_REVIEW" : "PREPARE_ACCESS_EXPORT" })), completionEvidence: list(c.completionEvidence), dataChangedOrDeleted: false, identityVerificationRequired: true }),
  backup_assurance: c => {
    const backups = list(c.backupEvidence);
    const restores = list(c.restoreTests);
    return { backupEvidenceCount: backups.length, restoreTestCount: restores.length, failedRestoreTests: restores.filter(x => object(x).status !== "passed"), recoveryTargets: object(c.recoveryTargets), missingEvidence: list(c.requiredEvidence).filter(x => !backups.some(b => str(object(b).type) === str(x))), recoveryDrillState: restores.length ? "EVIDENCE_REVIEW_REQUIRED" : "RESTORE_PROOF_MISSING" };
  },
  localization: c => {
    const surfaces = list(c.localeSurfaces);
    return { surfaceCount: surfaces.length, directionIssues: surfaces.filter(x => object(x).expectedDirection && object(x).actualDirection !== object(x).expectedDirection), overflowIssues: list(c.overflowIssues), formatIssues: list(c.formatIssues), placeholderIssues: list(c.placeholderIssues), qaState: "LOCAL_STATIC_REVIEW_ONLY" };
  },
  release_management: c => {
    const gates = list(c.releaseGates);
    return { changeInventory: list(c.changes), gates, passedGates: gates.filter(x => object(x).status === "passed"), blockedGates: gates.filter(x => object(x).status !== "passed"), evidence: list(c.evidence), rollbackPlan: list(c.rollbackSteps), releaseApproved: false };
  },
  digital_asset_management: c => {
    const assets = list(c.assets);
    return { assets: assets.map(x => ({ ...object(x), rightsState: object(x).rightsEvidence ? "EVIDENCE_ATTACHED_REVIEW_REQUIRED" : "RIGHTS_UNVERIFIED" })), taxonomy: object(c.taxonomy), versionHistory: list(c.versionHistory), deliveryManifest: assets.map(x => str(object(x).id)).filter(Boolean) };
  },
  after_sales: c => ({ reference: str(c.reference), caseType: str(c.caseType), warrantyTerms: object(c.warrantyTerms), warrantyState: c.warrantyTerms ? "TERMS_REVIEW_REQUIRED" : "WARRANTY_TERMS_MISSING", resolutionOptions: list(c.resolutionOptions), satisfactionEvidence: list(c.satisfactionEvidence), caseClosed: false }),
  organizational_memory: c => ({ decision: str(c.decision), decisionOwner: str(c.decisionOwner) || null, supportingEvidence: list(c.supportingEvidence), supersedes: list(c.supersedes), supersededBy: list(c.supersededBy), reviewDate: str(c.reviewDate) || null, evidenceCompleteness: list(c.supportingEvidence).length ? "EVIDENCE_LINKED_REVIEW_REQUIRED" : "EVIDENCE_MISSING" })
};

function executeDomainModule(module, input, context) {
  if (!module || !handlers[module.domain]) throw new Error("ARIA_ADDITIONAL_DOMAIN_HANDLER_NOT_FOUND");
  const goal = str(input.goal);
  const domainContext = object(input.context);
  const result = handlers[module.domain](domainContext);
  const operationResults = module.operations.map((operation, index) => ({
    sequence: index + 1,
    operation,
    status: "EXECUTED_LOCAL",
    evidenceKeys: Object.keys(result)
  }));
  return Object.freeze({
    moduleId: module.moduleId,
    domain: module.domain,
    executionMode: "LOCAL_DOMAIN_LOGIC",
    goal,
    result: Object.freeze(result),
    operationResults,
    tenantScope: String(context.tenantId),
    actorScope: String(context.actorId),
    externalExecutionPerformed: false,
    paymentExecuted: false,
    productionVerified: false
  });
}

module.exports = { executeDomainModule, handlers };
