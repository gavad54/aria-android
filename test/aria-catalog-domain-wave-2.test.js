"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {MODULES}=require("../backend/modules");
const cases=[
 ["ARIA-CATALOG-661",{goal:"Apply watercolor style",context:{sourceAssetId:"img-1",style:"watercolor",ownershipConfirmed:true,consent:true}},"imageTransformation",x=>x.sourceAssetId==="img-1"&&x.rightsGate==="AUTHORIZED_FOR_REVIEW"&&x.originalPreservation==="REQUIRED"],
 ["ARIA-CATALOG-662",{goal:"Create summer sale banner",context:{offer:"Summer sale",channelSizes:[{channel:"web",width:1200,height:400},{channel:"mobile",width:600,height:800}],brandColors:["#111111"]}},"adBanner",x=>x.variants.length===2&&x.disclosureChecklist.length>0],
 ["ARIA-CATALOG-663",{goal:"Announce new product",context:{platforms:["instagram","facebook"],formats:["post","story"],message:"New product",cta:"Learn more"}},"socialAssets",x=>x.assets.length===4&&x.copyVariants.length===2],
 ["ARIA-CATALOG-664",{goal:"Create video thumbnail",context:{videoTitle:"How to plan",audience:"beginners",concepts:["clear headline","single subject"],variants:3}},"thumbnailPlan",x=>x.variants.length===3&&x.experimentState==="NOT_STARTED"],
 ["ARIA-CATALOG-665",{goal:"Create speaking reel",context:{subjectId:"person-1",consent:true,script:"Welcome",syntheticDisclosure:true}},"faceReelPlan",x=>x.disclosureRequired===true&&x.consentState==="RECORDED"&&x.rendered===false],
 ["ARIA-CATALOG-666",{goal:"Create a brand avatar",context:{style:"illustrated",sourceAssetId:"portrait-1",consent:true,disclosure:true}},"avatarBrief",x=>x.disclosureRequired===true&&x.sourceAssetId==="portrait-1"&&x.generated===false],
 ["ARIA-CATALOG-667",{goal:"Prepare narrated video",context:{script:"Welcome to the course",voice:"licensed-voice-1",voiceRightsConfirmed:true,scenes:[{text:"Welcome"},{text:"Lesson one"}]}},"voiceVideoPlan",x=>x.scenes.length===2&&x.voiceRightsGate==="CLEARED_FOR_REVIEW"&&x.rendered===false],
 ["ARIA-CATALOG-668",{goal:"Prepare bilingual captions",context:{transcript:"Hello world",sourceLanguage:"en",targetLanguages:["fa","az"],segments:[{start:0,end:2,text:"Hello world"}]}},"captionJobs",x=>x.jobs.length===2&&x.jobs[0].reviewRequired===true],
 ["ARIA-CATALOG-669",{goal:"Turn product script into video",context:{script:"Scene one. Scene two.",scenes:[{id:"s1",description:"Opening"},{id:"s2",description:"Demo"}],aspectRatio:"16:9",rightsConfirmed:true}},"textVideoPlan",x=>x.scenes.length===2&&x.aspectRatio==="16:9"&&x.rendered===false],
 ["ARIA-CATALOG-670",{goal:"Create podcast clips",context:{sourceAssetId:"pod-1",ownershipConfirmed:true,segments:[{start:10,end:45,title:"Key insight"},{start:80,end:110,title:"Summary"}]}},"podcastClips",x=>x.clips.length===2&&x.clips[0].durationSeconds===35&&x.rightsGate==="CLEARED_FOR_REVIEW"]
];
for(const [id,input,key,predicate] of cases){
 test(id+" executes a dedicated media domain workflow",async()=>{
  const module=MODULES.find(m=>m.manifest.moduleId===id);assert.ok(module,id);
  const result=await module.execute(input,{actorId:"catalog-wave2-actor",tenantId:"catalog-wave2-tenant"});
  const domain=result.artifact.domainResult;
  assert.equal(result.domainLogicExecuted,true);
  assert.equal(domain.tenantScope,"catalog-wave2-tenant");
  assert.ok(domain.domainOutput&&domain.domainOutput[key],"missing "+key);
  assert.equal(predicate(domain.domainOutput[key]),true,"incomplete "+key);
  assert.equal(domain.commercialization.billingEnabled,false);
  assert.equal(domain.paymentExecuted,false);
  assert.equal(domain.productionVerified,false);
 });
}
