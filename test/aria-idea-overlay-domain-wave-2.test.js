"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {executeAriaDomainModule}=require("../backend/aria-144-domain-runtime.cjs");
async function runIdea(id,context){
 return executeAriaDomainModule("ARIA-IDEA-MODULE-"+id,{goal:"Prepare a reviewable domain result",context,consent:true},{actorId:"idea-wave-2-test",tenantId:"tenant-idea-wave-2"});
}
test("purchase request approvals remain pending until each role approves",async()=>{
 const r=await runIdea("003",{requestId:"req-1",requiredRoles:["manager","finance"],approvals:[{role:"manager",status:"approved"},{role:"finance",status:"pending"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.pendingRoles,["finance"]);assert.equal(o.approved,false);assert.equal(o.requestSubmitted,false);
});
test("product traceability reports missing batch evidence without inventing provenance",async()=>{
 const r=await runIdea("006",{batches:[{id:"b1",productId:"p1",supplierId:"s1",sourceEvidenceId:"invoice-1"},{id:"b2",productId:"p2",supplierId:"",sourceEvidenceId:""}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.traceableBatchIds,["b1"]);assert.deepEqual(o.traceabilityGapBatchIds,["b2"]);
});
test("technical dossier computes document completeness from supplied requirements",async()=>{
 const r=await runIdea("010",{requiredDocuments:["spec","certificate","label"],documents:[{type:"spec",evidenceId:"doc-1"},{type:"label",evidenceId:"doc-2"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.completenessPercent,67);assert.deepEqual(o.missingDocumentTypes,["certificate"]);assert.equal(o.complianceCertified,false);
});
test("quality batch control flags measurements outside declared tolerance",async()=>{
 const r=await runIdea("011",{batchId:"lot-7",checks:[{id:"c1",value:10,min:8,max:12},{id:"c2",value:15,min:8,max:12}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.nonconformingCheckIds,["c2"]);assert.equal(o.batchReleased,false);
});
test("recall readiness maps affected lots and drafts actions without notifying customers",async()=>{
 const r=await runIdea("012",{issueCode:"label-error",affectedProductIds:["p1"],batches:[{id:"b1",productId:"p1",customerIds:["c1","c2"]},{id:"b2",productId:"p2",customerIds:["c3"]}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.affectedBatchIds,["b1"]);assert.deepEqual(o.reviewCustomerIds,["c1","c2"]);assert.equal(o.notificationsSent,false);
});
test("warranty claim remains reviewable and never promises eligibility",async()=>{
 const r=await runIdea("013",{claimId:"w1",purchaseDate:"2026-01-01",claimDate:"2026-11-20",policyDays:365,evidenceIds:["receipt-1"]});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.withinSuppliedPolicyWindow,true);assert.equal(o.eligibilityDecision,"REVIEW_REQUIRED");assert.equal(o.claimApproved,false);
});
test("asset maintenance identifies due work from explicit service intervals",async()=>{
 const r=await runIdea("015",{asOfDate:"2026-11-20",assets:[{id:"a1",lastServiced:"2026-10-01",intervalDays:30},{id:"a2",lastServiced:"2026-11-01",intervalDays:60}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.dueAssetIds,["a1"]);assert.equal(o.workOrdersCreated,false);
});
test("franchise audit calculates evidence-backed checklist gaps",async()=>{
 const r=await runIdea("023",{checklist:[{id:"c1",required:true,evidenceId:"photo-1",status:"pass"},{id:"c2",required:true,evidenceId:"",status:"unknown"},{id:"c3",required:false,evidenceId:"",status:"n/a"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.evidenceGaps,["c2"]);assert.equal(o.auditFinalized,false);
});
test("project dependency review reports unresolved links and milestone slippage",async()=>{
 const r=await runIdea("026",{asOfDate:"2026-11-20",tasks:[{id:"a",dependencies:[],dueDate:"2026-11-19",status:"open"},{id:"b",dependencies:["a","missing"],dueDate:"2026-11-25",status:"open"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.unresolvedDependencies,[{taskId:"b",dependencyId:"missing"}]);assert.deepEqual(o.overdueTaskIds,["a"]);
});
test("team capacity planner avoids assigning work beyond declared available hours",async()=>{
 const r=await runIdea("027",{people:[{id:"p1",availableHours:3},{id:"p2",availableHours:2}],tasks:[{id:"t1",estimatedHours:2},{id:"t2",estimatedHours:2},{id:"t3",estimatedHours:2}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.totalDemandHours,6);assert.equal(o.totalCapacityHours,5);assert.deepEqual(o.unallocatedTaskIds,["t3"]);assert.equal(o.assignmentsCommitted,false);
});
