"use strict";

function list(v, limit=100){return Array.isArray(v)?v.slice(0,limit):[];}
function obj(v){return v&&typeof v==="object"&&!Array.isArray(v)?v:{};}
function txt(v,fallback=""){return typeof v==="string"&&v.trim()?v.trim().slice(0,1000):fallback;}
function records(v){return list(v).filter(x=>x&&typeof x==="object"&&!Array.isArray(x));}
function makeProfile(sequence, manifest){
 return Object.freeze({
  profileId:"PROFILE:"+manifest.moduleId,moduleId:manifest.moduleId,moduleName:manifest.name,
  specialization:manifest.commercialModuleId||manifest.name,
  executionBoundary:"TENANT_SCOPED_LOCAL_ONLY",
  operationPlan:list(manifest.operations).map((operation,i)=>({sequence:i+1,operation,state:"LOCAL_EXECUTABLE_STEP"})),
  reviewRequired:true,externalExecution:false,productionVerified:false
 });
}
const STRATEGIES=Object.freeze({
  651:(goal,c)=>{const workItems=records(c.requests).map((r,i)=>({id:txt(r.id,"request-"+(i+1)),type:txt(r.type,"general"),urgency:txt(r.urgency,"normal").toLowerCase(),status:"OPEN"}));const rank={critical:0,high:1,normal:2,low:3};const priorityOrder=[...workItems].sort((a,b)=>(rank[a.urgency]??2)-(rank[b.urgency]??2)).map(x=>x.id);return {commandCenter:{workItems,priorityOrder,unclassifiedCount:workItems.filter(x=>!rank.hasOwnProperty(x.urgency)).length,actionsDispatched:false},objective:goal};},
  652:(goal,c)=>{const idea=txt(c.idea,goal);const resources=list(c.resources);const risks=list(c.risks);const stages=["Problem validation","Solution prototype","Pilot delivery","Outcome measurement","Scale decision"].map((name,i)=>({sequence:i+1,name,acceptanceGate:i===0?"USER_PROBLEM_EVIDENCE_REQUIRED":i===4?"OWNER_SCALE_APPROVAL":"EVIDENCE_AND_REVIEW_REQUIRED",status:"PROPOSED"}));return {ideaToValue:{idea,resources,risks,stages,assumptions:risks.map(x=>txt(x)),investmentReleased:false},objective:goal};},
  653:(goal,c)=>{const opportunities=records(c.opportunities).map(x=>({id:txt(x.id),value:Number(x.value)||0,effort:Number(x.effort)||0,evidenceCount:Math.max(0,Number(x.evidenceCount)||0)}));const rankings=opportunities.map(x=>({...x,score:x.effort>0?(x.value*x.evidenceCount)/x.effort:0})).sort((a,b)=>b.score-a.score);rankings.forEach((x,i)=>x.rank=i+1);return {opportunityPortfolio:{rankings,decisionState:"PRIORITIZATION_ONLY",investmentApproved:false},objective:goal};},
  654:(goal,c)=>{const objectives=list(c.learningObjectives).map(x=>txt(x)).filter(Boolean);const lessons=records(c.lessons).map((x,i)=>({id:txt(x.id,"lesson-"+(i+1)),objective:txt(x.objective),sequence:i+1,status:"DRAFT"}));const covered=new Set(lessons.map(x=>x.objective));return {learningProgram:{goal,learnerLevel:txt(c.learnerLevel,"UNASSESSED"),objectives,modules:lessons,uncoveredObjectives:objectives.filter(x=>!covered.has(x)),objectiveCoverage:objectives.length?objectives.filter(x=>covered.has(x)).length/objectives.length:0,certificationIssued:false},objective:goal};},
  655:(goal,c)=>{const steps=records(c.steps).map((x,i)=>({id:txt(x.id,"step-"+(i+1)),dependsOn:list(x.dependsOn).map(y=>txt(y)),approvalRequired:x.approvalRequired===true}));const ids=new Set(steps.map(x=>x.id));const invalid=steps.filter(x=>x.dependsOn.some(d=>!ids.has(d))).map(x=>x.id);const indegree=new Map(steps.map(x=>[x.id,0]));const next=new Map(steps.map(x=>[x.id,[]]));for(const step of steps)for(const dep of step.dependsOn)if(ids.has(dep)){indegree.set(step.id,indegree.get(step.id)+1);next.get(dep).push(step.id);}const queue=steps.filter(x=>indegree.get(x.id)===0).map(x=>x.id);const order=[];while(queue.length){const id=queue.shift();order.push(id);for(const child of next.get(id)){indegree.set(child,indegree.get(child)-1);if(indegree.get(child)===0)queue.push(child);}}const hasCycle=order.length!==steps.length-invalid.length;return {workflowGraph:{steps,valid:invalid.length===0&&!hasCycle,invalidDependencies:invalid,hasCycle,executionOrder:order,externalActionsEnabled:false},objective:goal};},
  656:(goal,c)=>{const action=obj(c.action);const policies=records(c.policies);const matched=policies.filter(p=>txt(p.when)===txt(action.type));const consentRequired=matched.some(p=>p.requiresConsent===true);const flags=[];if(consentRequired&&action.consent!==true)flags.push("CONSENT_REQUIRED");if(txt(action.dataClass)==="confidential"&&action.type==="external_publish")flags.push("CONFIDENTIAL_EXTERNAL_PUBLICATION");if(action.external===true&&action.approved!==true)flags.push("EXPLICIT_APPROVAL_REQUIRED");const decision=flags.length?"DENY":matched.some(p=>p.requiresApproval===true)?"REVIEW":"ALLOW_LOCAL_ONLY";return {trustDecision:{decision,matchedPolicyIds:matched.map(p=>txt(p.id)),riskFlags:flags,approvalRequired:decision!=="ALLOW_LOCAL_ONLY",externalActionExecuted:false},objective:goal};},
  657:(goal,c)=>{const consent=c.consent===true;return {creativeBrief:{platform:txt(c.platform,"instagram"),format:txt(c.format,"post"),message:txt(c.message,goal),brandColors:list(c.brandColors),visualDirection:txt(c.visualDirection,"BRAND_ALIGNED_MINIMAL"),assetSpec:{aspectRatio:txt(c.aspectRatio,c.format==="cover"?"1:1":"4:5"),deliverable:"EDITABLE_CREATIVE_BRIEF"},rightsGate:consent?"CONSENT_RECORDED":"BLOCKED_PENDING_CONSENT",imageGenerationPerformed:false},objective:goal};},
  658:(goal,c)=>{const edits=list(c.editGoals).map((x,i)=>({sequence:i+1,operation:txt(x),state:"PROPOSED"}));const authorized=c.consent===true&&c.ownershipConfirmed===true;return {imageEditPlan:{sourceAssetId:txt(c.sourceAssetId,"SOURCE_REQUIRED"),edits,originalPreservation:"REQUIRED",rightsGate:authorized?"AUTHORIZED_FOR_REVIEW":"BLOCKED_PENDING_RIGHTS_AND_CONSENT",editExecuted:false,destructiveOverwrite:false},objective:goal};},
  659:(goal,c)=>{const consent=c.consent===true;return {portraitBrief:{useCase:txt(c.useCase,"professional profile"),background:txt(c.background,"neutral"),sourceAssetId:txt(c.sourceAssetId,"SOURCE_REQUIRED"),outputFormats:["1:1 profile","4:5 portrait"],lightingDirection:"NATURAL_AND_EVEN",identityPreservation:"SUBJECT_IDENTITY_MUST_REMAIN_AUTHENTIC",consentState:consent?"RECORDED":"BLOCKED_PENDING_CONSENT",imageGenerated:false},objective:goal};},
  660:(goal,c)=>{const shots=list(c.views).map((view,i)=>({sequence:i+1,view:txt(view),purpose:i===0?"PRIMARY_PRODUCT_VIEW":"SUPPORTING_DETAIL",state:"SHOT_BRIEF_ONLY"}));return {productPhotoPlan:{productId:txt(c.productId,"PRODUCT_REQUIRED"),productName:txt(c.productName,"Unnamed product"),background:txt(c.background,"NEUTRAL"),shots,productFidelity:"MUST_PRESERVE",ownershipConfirmed:c.ownershipConfirmed===true,productionRendered:false},objective:goal};}
});
function createCatalogDomainHandler(sequence){
 const build=STRATEGIES[sequence];if(!build)throw new Error("ARIA_CATALOG_STRATEGY_NOT_FOUND");
 return async function catalogDomainHandler(input,context,meta){
  if(!context||!context.tenantId||!context.actorId)throw new Error("ARIA_CATALOG_CONTEXT_INVALID");
  const manifest=meta&&meta.manifest||{};const revenue=obj(manifest.revenueEngine);
  return Object.freeze({
   moduleId:manifest.moduleId,tenantScope:String(context.tenantId),actorScope:String(context.actorId),
   artifactType:"ARIA_CATALOG_"+sequence,domainOutput:build(txt(input.goal,manifest.name),obj(input.context)),
   moduleSpecificProfile:makeProfile(sequence,manifest),
   commercialization:{model:list(revenue.billingModes),entitlementKey:revenue.entitlementKey||null,meteringUnit:revenue.meteringUnit||null,state:"DESIGNED_NOT_MONETIZED",price:revenue.price||null,billingEnabled:false,paymentExecuted:false},
   reviewRequired:true,externalSideEffect:false,externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false
  });
 };
}
module.exports={createCatalogDomainHandler};
