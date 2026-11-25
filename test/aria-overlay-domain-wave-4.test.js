"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {executeAriaDomainModule}=require("../backend/aria-144-domain-runtime.cjs");
async function run(id,context){
 return executeAriaDomainModule(id,{goal:"Prepare a reviewable domain result",context,consent:true},{actorId:"overlay-wave-4-test",tenantId:"tenant-overlay-wave-4"});
}
test("delivery acceptance requires all declared evidence and owner review",async()=>{
 const r=await run("ARIA-IDEA-MODULE-028",{milestoneId:"m1",requiredEvidence:["test-report","handover"],evidence:[{type:"test-report",id:"e1"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.missingEvidenceTypes,["handover"]);assert.equal(o.acceptanceState,"BLOCKED");assert.equal(o.acceptanceCommitted,false);
});
test("incident review builds an evidence-backed timeline and action register",async()=>{
 const r=await run("ARIA-IDEA-MODULE-030",{incidentId:"i1",events:[{id:"e1",at:"2026-11-20T09:00:00Z",description:"Detected",evidenceId:"log-1"}],actions:[{id:"a1",ownerId:"team-1",status:"open"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.timelineEventIds,["e1"]);assert.deepEqual(o.openActionIds,["a1"]);assert.equal(o.postmortemApproved,false);
});
test("shift coverage identifies unfilled roles without publishing a roster",async()=>{
 const r=await run("ARIA-IDEA-MODULE-047",{shifts:[{id:"s1",role:"support",date:"2026-11-21"}],staff:[{id:"p1",roles:["support"],availableShiftIds:["s1"],verified:true}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.coveredShiftIds,["s1"]);assert.deepEqual(o.uncoveredShiftIds,[]);assert.equal(o.rosterPublished,false);
});
test("operations safety inspection records findings without unsafe instructions",async()=>{
 const r=await run("ARIA-IDEA-MODULE-048",{checks:[{id:"c1",required:true,status:"pass",evidenceId:"photo-1"},{id:"c2",required:true,status:"fail",evidenceId:"report-2"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.findingIds,["c2"]);assert.equal(o.inspectionCertified,false);assert.equal(o.hazardousProcedureProvided,false);
});
test("privacy impact review flags sensitive data and missing safeguards",async()=>{
 const r=await run("ARIA-IDEA-MODULE-049",{dataCategories:["contact","location"],purpose:"service delivery",retentionDays:365,sensitiveData:true,controls:["access-control"],recipients:["internal-team"]});
 const o=r.artifact.domainResult.domainOutput;
 assert.ok(o.riskFlags.includes("SENSITIVE_DATA"));assert.ok(o.riskFlags.includes("RETENTION_REVIEW_REQUIRED"));assert.equal(o.privacyApprovalIssued,false);
});
test("local guide filters places by area, category and evidence",async()=>{
 const r=await run("ARIA-PROBLEM-MODULE-046",{area:"Baku",category:"museum",places:[{id:"a",area:"Baku",categories:["museum"],verified:true,evidenceId:"src-a"},{id:"b",area:"Baku",categories:["museum"],verified:false,evidenceId:""},{id:"c",area:"Ganja",categories:["museum"],verified:true,evidenceId:"src-c"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.eligiblePlaceIds,["a"]);assert.equal(o.navigationStarted,false);
});
test("pet care connector links owner-consented tasks to known pet profiles",async()=>{
 const r=await run("ARIA-PROBLEM-MODULE-048",{ownerConsent:true,petProfiles:[{id:"pet-1",name:"Pet"}],tasks:[{id:"t1",petId:"pet-1",label:"Food"},{id:"t2",petId:"missing",label:"Walk"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.linkedTaskIds,["t1"]);assert.deepEqual(o.unlinkedTaskIds,["t2"]);assert.equal(o.veterinaryAdviceIssued,false);
});
test("travel community matches consented verified members without contacting them",async()=>{
 const r=await run("ARIA-PROBLEM-MODULE-050",{destination:"Baku",dateWindow:"2026-12",interests:["history"],members:[{id:"m1",destination:"Baku",dateWindow:"2026-12",interests:["history"],verified:true,evidenceId:"proof",consentToMatch:true},{id:"m2",destination:"Baku",dateWindow:"2026-12",interests:["history"],verified:false,evidenceId:"",consentToMatch:true}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.matchMemberIds,["m1"]);assert.equal(o.contactExecuted,false);assert.equal(o.tripBooked,false);
});
test("legacy marketplace adapter validates a listing draft and targets CHARSU",async()=>{
 const r=await run("ARIA-LEGACY-APP-MODULE-003",{title:"Item",description:"Description",category:"home",price:25,sellerId:"s1",sellerVerified:true,inventory:2});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.targetProduct,"CHARSU");assert.equal(o.listingState,"READY_FOR_REVIEW");assert.equal(o.listingPublished,false);
});
test("legacy creative adapter creates a rights-gated brief for NEGAH",async()=>{
 const r=await run("ARIA-LEGACY-APP-MODULE-004",{objective:"Product launch",format:"short video",assets:[{id:"a",rightsConfirmed:true}],rightsReviewPassed:true});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.targetProduct,"NEGAH");assert.equal(o.briefState,"READY_FOR_REVIEW");assert.equal(o.mediaGenerated,false);
});
test("legacy cloud adapter prepares a gated infrastructure plan for SEPEHR",async()=>{
 const r=await run("ARIA-LEGACY-APP-MODULE-005",{projectId:"p1",resources:["database","storage"],backupPlan:true,monitoringPlan:true,ownerApproval:false});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.targetProduct,"SEPEHR");assert.equal(o.provisioningState,"OWNER_APPROVAL_REQUIRED");assert.equal(o.resourcesProvisioned,false);
});
test("legacy page builder validates site structure for NAMA without publishing",async()=>{
 const r=await run("ARIA-LEGACY-APP-MODULE-006",{pages:[{slug:"/",title:"Home"},{slug:"/about",title:"About"}],domainVerified:true,publishApproved:false});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.targetProduct,"NAMA");assert.equal(o.publicationReadiness,"OWNER_APPROVAL_REQUIRED");assert.equal(o.sitePublished,false);
});
