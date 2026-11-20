"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {executeAriaDomainModule}=require("../backend/aria-144-domain-runtime.cjs");
async function runIdea(id,context){
 return executeAriaDomainModule("ARIA-IDEA-MODULE-"+id,{goal:"Prepare a reviewable domain result",context,consent:true},{actorId:"idea-wave-3-test",tenantId:"tenant-idea-wave-3"});
}
test("knowledge curation groups duplicate source records without deleting them",async()=>{
 const r=await runIdea("031",{items:[{id:"a",title:"Policy A",sourceId:"s1",evidenceId:"e1",topic:"policy"},{id:"b",title:"Policy A",sourceId:"s1",evidenceId:"e2",topic:"policy"},{id:"c",title:"Policy B",sourceId:"s2",evidenceId:"e3",topic:"finance"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.duplicateGroups,[["a","b"]]);assert.equal(o.sourceRecordsDeleted,false);
});
test("document approval workflow retains version and pending role evidence",async()=>{
 const r=await runIdea("032",{documentId:"d1",version:3,requiredRoles:["owner","legal"],approvals:[{role:"owner",status:"approved",evidenceId:"a1"},{role:"legal",status:"pending"}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.version,3);assert.deepEqual(o.pendingRoles,["legal"]);assert.equal(o.approved,false);
});
test("records retention review respects legal holds and never disposes records",async()=>{
 const r=await runIdea("033",{asOfDate:"2026-11-20",records:[{id:"r1",createdAt:"2025-01-01",retentionDays:300,legalHold:false},{id:"r2",createdAt:"2025-01-01",retentionDays:300,legalHold:true}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.retentionReviewDueIds,["r1"]);assert.deepEqual(o.legalHoldIds,["r2"]);assert.equal(o.recordsDeleted,false);
});
test("data quality review reports missing fields and duplicate keys",async()=>{
 const r=await runIdea("035",{requiredFields:["name","email"],uniqueKey:"email",rows:[{id:"a",name:"A",email:"a@example.test"},{id:"b",name:"B",email:"a@example.test"},{id:"c",name:""}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.missingFieldRows,[{rowId:"c",fields:["email"]}]);assert.deepEqual(o.duplicateKeyGroups,[["a","b"]]);
});
test("release readiness gate blocks when required evidence is missing",async()=>{
 const r=await runIdea("040",{gates:[{id:"tests",required:true,passed:true,evidenceId:"ci-1"},{id:"backup",required:true,passed:false,evidenceId:""},{id:"docs",required:false,passed:false,evidenceId:""}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.blockers,["backup"]);assert.equal(o.releaseApproved,false);assert.equal(o.releaseTriggered,false);
});
test("localization review identifies missing and untranslated strings",async()=>{
 const r=await runIdea("041",{locale:"fa-IR",sourceStrings:{hello:"Hello",save:"Save"},translations:{hello:"سلام",save:"Save"}});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.missingKeys,[]);assert.deepEqual(o.untranslatedKeys,["save"]);assert.equal(o.publishApproved,false);
});
test("accessibility audit reports required checks without claiming certification",async()=>{
 const r=await runIdea("042",{checks:[{id:"contrast",required:true,passed:false,evidenceId:""},{id:"labels",required:true,passed:true,evidenceId:"test-1"},{id:"motion",required:false,passed:false,evidenceId:""}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.blockingCheckIds,["contrast"]);assert.equal(o.accessibilityCertified,false);
});
test("license audit blocks assets lacking evidence or permitted usage",async()=>{
 const r=await runIdea("043",{intendedUse:"commercial",assets:[{id:"a",licenseType:"commercial",permittedUses:["commercial"],rightsConfirmed:true,evidenceId:"lic-1"},{id:"b",licenseType:"personal",permittedUses:["personal"],rightsConfirmed:true,evidenceId:"lic-2"},{id:"c",licenseType:"unknown",permittedUses:[],rightsConfirmed:false,evidenceId:""}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.clearedAssetIds,["a"]);assert.deepEqual(o.blockedAssetIds,["b","c"]);assert.equal(o.legalOpinionIssued,false);
});
test("IP provenance ledger identifies incomplete ownership evidence",async()=>{
 const r=await runIdea("044",{assets:[{id:"a",creator:"creator-1",source:"original",license:"owned",evidenceId:"proof-1"},{id:"b",creator:"",source:"unknown",license:"",evidenceId:""}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.deepEqual(o.completeAssetIds,["a"]);assert.deepEqual(o.provenanceGapAssetIds,["b"]);assert.equal(o.ownershipCertified,false);
});
test("role skill matrix computes coverage and skill gaps without employment decisions",async()=>{
 const r=await runIdea("046",{roles:[{id:"r1",requiredSkills:["sql","security"]}],members:[{id:"m1",skills:["sql"]},{id:"m2",skills:["security"]}]});
 const o=r.artifact.domainResult.domainOutput;
 assert.equal(o.coveredRoleCount,1);assert.deepEqual(o.roleSkillGaps,[]);assert.equal(o.employmentDecisionMade,false);
});
