"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {handlers}=require("../backend/aria-039-domain-handlers.cjs");

test("personal finance computes available balance from supplied income and expenses",()=>{
 const r=handlers.personal_finance({income:5000,expenses:[{amount:1200},{amount:800}]});
 assert.equal(r.remainingBalance,3000);
});
test("career guidance identifies missing application evidence",()=>{
 const r=handlers.career_guidance({requiredEvidence:["CV","Portfolio"],providedEvidence:["CV"]});
 assert.deepEqual(r.evidenceGaps,["Portfolio"]);
});
test("small business inventory flags reorder risk and builds a purchase list",()=>{
 const r=handlers.small_business_inventory({items:[{sku:"A",onHand:2,reorderPoint:5,reorderQuantity:10}]});
 assert.equal(r.lowStockItems.length,1);
 assert.deepEqual(r.suggestedPurchaseList,[{sku:"A",quantity:10}]);
});
test("customer request management preserves valid urgency",()=>{
 assert.equal(handlers.customer_request_management({urgency:"high"}).urgency,"high");
});
test("appointment coordination excludes already-booked slots",()=>{
 const r=handlers.appointment_coordination({availabilitySlots:[{slotKey:"A"},{slotKey:"B"}],existingBookings:[{slotKey:"A"}]});
 assert.deepEqual(r.proposedSlots,[{slotKey:"B"}]);
});
test("event planning sequences tasks and totals cost items",()=>{
 const r=handlers.event_planning({tasks:[{name:"Venue"},{name:"Program"}],costItems:[{amount:100},{amount:50}]});
 assert.equal(r.timeline[1].sequence,2);
 assert.equal(r.estimatedBudget,150);
});
test("group travel detects declared reservation conflicts",()=>{
 const r=handlers.travel_planning({sharedReservations:[{id:"R1",conflict:true}]});
 assert.equal(r.scheduleConflicts.length,1);
 assert.equal(r.bookingExecuted,false);
});
test("provider evidence marks claims without evidence as unverified",()=>{
 const r=handlers.local_services_discovery({claims:[{id:"license"}],providerEvidence:[]});
 assert.equal(r.claimReview[0].state,"UNVERIFIED");
});
test("accessibility planner emits test cases and keeps compatibility unverified",()=>{
 const r=handlers.digital_accessibility({});
 assert.ok(r.testCases.includes("صفحه‌خوان"));
 assert.equal(r.compatibilityConclusion,"NOT_VERIFIED_UNTIL_TEST_EVIDENCE");
});
test("terminology management deduplicates terms and versions the glossary",()=>{
 const r=handlers.terminology_management({terms:["API","api","UX"],glossaryVersion:3});
 assert.deepEqual(r.extractedTerms,["API","UX"]);
 assert.equal(r.glossaryVersion,3);
});
test("knowledge base links claims to declared source records",()=>{
 const r=handlers.knowledge_base({sources:[{id:"S1"}],claims:[{sourceId:"S1"},{sourceId:"S2"}]});
 assert.deepEqual(r.claims.map(x=>x.citationAttached),[true,false]);
});
test("research synthesis preserves source findings without inventing confidence",()=>{
 const r=handlers.research_synthesis({researchQuestion:"Q",sources:[{id:"S"}],findings:["F"]});
 assert.equal(r.screenedSources.length,1);
 assert.equal(r.confidence,"NOT_SCORED_WITHOUT_SOURCE_QUALITY_REVIEW");
});
test("study planning allocates available hours across topics",()=>{
 const r=handlers.study_planning({availableHoursPerWeek:10,topics:["A","B"]});
 assert.deepEqual(r.studyPlan.map(x=>x.suggestedHours),[5,5]);
});
test("language practice refuses an unsupported automatic score",()=>{
 const r=handlers.language_practice({responses:["sample"]});
 assert.equal(r.score,null);
 assert.equal(r.scoreState,"AWAITING_VALIDATED_RUBRIC_AND_RESPONSE_REVIEW");
});
test("portfolio management identifies skill evidence gaps",()=>{
 const r=handlers.portfolio_management({targetSkills:["analysis","design"],projects:[{skills:["analysis"]}]});
 assert.deepEqual(r.evidenceGaps,["design"]);
});
test("volunteer coordination matches declared skills to roles",()=>{
 const r=handlers.volunteer_coordination({roles:[{requiredSkill:"first-aid"}],volunteers:[{id:"V1",skills:["first-aid"],availableHours:2}]});
 assert.deepEqual(r.assignments[0].candidates,["V1"]);
});
test("donation transparency reconciles donations and allocations",()=>{
 const r=handlers.donation_transparency({donationRecords:[{amount:100}],allocations:[{amount:70}]});
 assert.equal(r.unallocatedBalance,30);
 assert.equal(r.reconciliationState,"REVIEW_REQUIRED");
});
test("repair lifecycle keeps handover dependent on supplied evidence",()=>{
 const r=handlers.repair_lifecycle({handoverEvidence:["signed-checklist"]});
 assert.equal(r.lifecycleState,"HANDOVER_REVIEW");
});
test("building energy review detects readings outside configured threshold",()=>{
 const r=handlers.building_energy_review({readings:[{value:10},{value:12},{value:20}],anomalyThreshold:5});
 assert.deepEqual(r.anomalies,[20]);
});
test("waste sorting guidance flags unknown local rules",()=>{
 const r=handlers.waste_sorting_guidance({materials:["glass"],materialRules:{}});
 assert.equal(r.sortingGuide[0].rule,"LOCAL_RULE_CONFIRMATION_REQUIRED");
});
test("agriculture planner creates ordered seasonal tasks",()=>{
 const r=handlers.agriculture_planning({seasonalTasks:["prepare","plant"]});
 assert.equal(r.operationSchedule[1].sequence,2);
});
test("supplier comparison normalizes and ranks offers",()=>{
 const r=handlers.supplier_comparison({offers:[{supplier:"B",price:20,deliveryDays:3,qualityScore:80},{supplier:"A",price:10,deliveryDays:5,qualityScore:75}]});
 assert.equal(r.rankedOffers[0].supplier,"A");
});
test("supply chain coordination identifies delayed milestones",()=>{
 const r=handlers.supply_chain_coordination({milestones:[{plannedDay:3,actualDay:5}]});
 assert.equal(r.delayedMilestones.length,1);
});
test("contract review flags missing required terms and requires counsel",()=>{
 const r=handlers.contract_review_checklist({requiredTerms:["termination"],sections:[]});
 assert.deepEqual(r.missingTerms,["termination"]);
 assert.equal(r.professionalReviewRequired,true);
});
test("document workflow applies legal hold without destroying records",()=>{
 const r=handlers.document_workflow({records:[{id:"D1"}],legalHold:true});
 assert.equal(r.legalHold,true);
 assert.equal(r.recordsDestroyed,false);
});
test("form design detects duplicate field names",()=>{
 const r=handlers.form_design({fields:[{name:"email"},{name:"email"}]});
 assert.deepEqual(r.duplicateFieldNames,["email"]);
});
test("survey analysis calculates descriptive average",()=>{
 const r=handlers.survey_analysis({responses:[{score:2,complete:true},{score:4,complete:true}]});
 assert.equal(r.averageScore,3);
 assert.equal(r.completionCount,2);
});
test("product feedback removes duplicate text before theme aggregation",()=>{
 const r=handlers.product_feedback({feedback:[{text:"slow",theme:"performance"},{text:"slow",theme:"performance"}]});
 assert.equal(r.deduplicatedCount,1);
 assert.equal(r.feedbackCount,2);
});
test("quality assurance separates passed and failed tests",()=>{
 const r=handlers.quality_assurance({tests:[{status:"passed"},{status:"failed"}],defects:[{severity:3}]});
 assert.equal(r.passedTests,1);
 assert.equal(r.failedTests.length,1);
});
test("risk register calculates likelihood-impact scores",()=>{
 const r=handlers.risk_register({risks:[{likelihood:4,impact:5,owner:"A"}]});
 assert.equal(r.risks[0].score,20);
 assert.equal(r.highRisks.length,1);
});
test("policy compliance identifies obligations without mapped controls",()=>{
 const r=handlers.policy_compliance({obligations:[{id:"O1"}],controls:[]});
 assert.equal(r.evidenceGaps.length,1);
});
test("connector governance flags excessive scopes without exposing secrets",()=>{
 const r=handlers.connector_governance({connectors:[{name:"C",scopes:["read","write"],requiredScopes:["read"],secretReference:"vault:key"}]});
 assert.deepEqual(r.connectors[0].excessiveScopes,["write"]);
 assert.equal(r.connectors[0].secretValueExposed,false);
});
test("privacy governance prepares deletion tasks but never deletes data",()=>{
 const r=handlers.privacy_governance({requestType:"DELETE",declaredDataSources:["db"]});
 assert.equal(r.taskPlan[0].action,"PREPARE_DELETION_REVIEW");
 assert.equal(r.dataChangedOrDeleted,false);
});
test("backup assurance distinguishes backup evidence from restore proof",()=>{
 const r=handlers.backup_assurance({backupEvidence:[{type:"daily"}],restoreTests:[]});
 assert.equal(r.recoveryDrillState,"RESTORE_PROOF_MISSING");
});
test("localization review detects direction mismatch",()=>{
 const r=handlers.localization({localeSurfaces:[{expectedDirection:"rtl",actualDirection:"ltr"}]});
 assert.equal(r.directionIssues.length,1);
});
test("release management blocks release while gates remain open",()=>{
 const r=handlers.release_management({releaseGates:[{id:"tests",status:"passed"},{id:"restore",status:"missing"}]});
 assert.equal(r.blockedGates.length,1);
 assert.equal(r.releaseApproved,false);
});
test("digital asset management does not infer rights without evidence",()=>{
 const r=handlers.digital_asset_management({assets:[{id:"A"}]});
 assert.equal(r.assets[0].rightsState,"RIGHTS_UNVERIFIED");
});
test("after-sales workflow does not assume missing warranty terms",()=>{
 const r=handlers.after_sales({});
 assert.equal(r.warrantyState,"WARRANTY_TERMS_MISSING");
});
test("organizational memory requires supporting evidence for a complete record",()=>{
 const r=handlers.organizational_memory({decision:"D"});
 assert.equal(r.evidenceCompleteness,"EVIDENCE_MISSING");
});
