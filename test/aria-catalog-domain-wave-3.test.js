"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {MODULES}=require("../backend/modules");
const cases=[
 ["ARIA-CATALOG-671",{goal:"Promote ceramic mug",context:{productName:"Ceramic mug",benefits:["handmade","durable"],audience:"gift buyers",durationSeconds:30,cta:"Shop now"}},"productVideoAd",x=>x.storyboard.length>=3&&x.durationSeconds===30&&x.rendered===false],
 ["ARIA-CATALOG-672",{goal:"Design VAYRO mark",context:{brandName:"VAYRO",industry:"software",values:["trust","clarity"],directions:["geometric","wordmark"]}},"logoConcepts",x=>x.concepts.length===2&&x.trademarkClearance==="NOT_ASSESSED"],
 ["ARIA-CATALOG-673",{goal:"Package ceramic mug",context:{productId:"m1",dimensions:{width:10,height:12,depth:10,unit:"cm"},materials:["recycled cardboard"],labelClaims:["fragile"]}},"packagingBrief",x=>x.specification.dimensions.width===10&&x.materials.length===1&&x.regulatoryReviewRequired],
 ["ARIA-CATALOG-674",{goal:"Build seasonal catalog",context:{products:[{id:"p1",name:"Mug",description:"Ceramic mug",price:12,currency:"USD",factsVerified:true},{id:"p2",name:"Cup",description:"Cup",price:8,currency:"USD",factsVerified:false}],sections:["Featured","Kitchen"]}},"professionalCatalog",x=>x.items.length===2&&x.unverifiedItems.includes("p2")&&x.publishState==="DRAFT_ONLY"],
 ["ARIA-CATALOG-675",{goal:"Create phone mockup",context:{sourceAssetId:"design-1",mockupTypes:["phone","desktop"],ownershipConfirmed:true}},"mockupPlan",x=>x.compositions.length===2&&x.rightsGate==="CLEARED_FOR_REVIEW"],
 ["ARIA-CATALOG-676",{goal:"Design story mascot",context:{name:"Nova",role:"guide",traits:["curious","helpful"],palette:["blue","silver"],turnaroundViews:["front","side","back"]}},"characterSheet",x=>x.turnaround.length===3&&x.consistencyRules.length>=2],
 ["ARIA-CATALOG-677",{goal:"Create customer discovery prompt",context:{task:"Interview small business owners",variables:["industry","teamSize"],constraints:["avoid leading questions"],evaluationCriteria:["clarity","neutrality"]}},"businessPrompt",x=>x.variables.length===2&&x.evaluationCriteria.length===2&&x.promptTemplate.includes("{{industry}}")],
 ["ARIA-CATALOG-678",{goal:"Package sales prompt bundle",context:{title:"Sales Toolkit",prompts:[{id:"p1",title:"Discovery",body:"Ask neutral discovery questions"}],version:"1.0",license:"owned",rightsEvidence:"author-confirmation"}},"promptPack",x=>x.prompts.length===1&&x.version==="1.0"&&x.rightsGate==="EVIDENCE_RECORDED"],
 ["ARIA-CATALOG-679",{goal:"Write product launch caption",context:{topic:"New ceramic mug",tone:"friendly",audience:"home decor fans",cta:"Explore collection",hashtags:["ceramics","design"]}},"instagramCaption",x=>x.hook.length>0&&x.body.length>0&&x.hashtags.length===2],
 ["ARIA-CATALOG-680",{goal:"Plan a month of content",context:{pillars:["education","product"],audience:"small businesses",ideas:[{title:"How-to guide",pillar:"education"},{title:"Product spotlight",pillar:"product"}],cadencePerWeek:3}},"contentIdeaPlan",x=>x.ideas.length===2&&x.pillars.length===2&&x.calendarDraft.length>0]
];
for(const [id,input,key,predicate] of cases){
 test(id+" executes a dedicated design/content domain workflow",async()=>{
  const module=MODULES.find(m=>m.manifest.moduleId===id);assert.ok(module,id);
  const result=await module.execute(input,{actorId:"catalog-wave3-actor",tenantId:"catalog-wave3-tenant"});
  const domain=result.artifact.domainResult;
  assert.equal(result.domainLogicExecuted,true);
  assert.equal(domain.tenantScope,"catalog-wave3-tenant");
  assert.ok(domain.domainOutput&&domain.domainOutput[key],"missing "+key);
  assert.equal(predicate(domain.domainOutput[key]),true,"incomplete "+key);
  assert.equal(domain.commercialization.billingEnabled,false);
  assert.equal(domain.paymentExecuted,false);
  assert.equal(domain.productionVerified,false);
 });
}
