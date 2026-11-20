"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {executeAriaDomainModule}=require("../backend/aria-144-domain-runtime.cjs");
async function run(sequence,context) {
  const moduleId=sequence>=51&&sequence<=54
    ?"ARIA-CONTROL-MODULE-"+String(sequence-50).padStart(3,"0")
    :"ARIA-PROBLEM-MODULE-"+String(sequence).padStart(3,"0");
  return executeAriaDomainModule(moduleId,{goal:"Prepare a reviewable domain result",context,consent:true},{actorId:"overlay-wave-1-test",tenantId:"tenant-overlay-wave-1"});
}
test("repairer discovery ranks only verified providers with matching service and evidence",async()=>{
 const result=await run(1,{serviceType:"plumbing",serviceArea:"Baku",providers:[
 {id:"p1",name:"Verified plumber",serviceTypes:["plumbing"],serviceAreas:["Baku"],verified:true,evidenceId:"doc-1",rating:4.8},
 {id:"p2",name:"Unverified plumber",serviceTypes:["plumbing"],serviceAreas:["Baku"],verified:false,evidenceId:""},
 {id:"p3",name:"Wrong trade",serviceTypes:["electrical"],serviceAreas:["Baku"],verified:true,evidenceId:"doc-3"}]});
 const output=result.artifact.domainResult.domainOutput;assert.deepEqual(output.eligibleProviders.map(x=>x.id),["p1"]);assert.equal(output.contactOrBookingExecuted,false);assert.equal(result.artifact.domainResult.tenantScope,"tenant-overlay-wave-1");
});
test("repair estimate calculates supplied line items and labels estimate as non-binding",async()=>{
 const result=await run(2,{currency:"AZN",laborHours:2,laborRate:30,materials:[{name:"pipe",quantity:2,unitPrice:5},{name:"seal",quantity:1,unitPrice:3}]});
 const o=result.artifact.domainResult.domainOutput;assert.equal(o.materialSubtotal,13);assert.equal(o.laborSubtotal,60);assert.equal(o.totalEstimate,73);assert.equal(o.bindingQuote,false);
});
test("task delegation keeps unassigned tasks visible and sorts explicit priorities",async()=>{
 const result=await run(3,{tasks:[{id:"later",title:"Later",priority:"low",assigneeId:""},{id:"urgent",title:"Urgent",priority:"urgent",assigneeId:"worker-1"},{id:"normal",title:"Normal",priority:"normal"}]});
 const o=result.artifact.domainResult.domainOutput;assert.equal(o.tasks[0].id,"urgent");assert.deepEqual(o.unassignedTaskIds,["normal","later"]);assert.equal(o.tasksScheduled,false);
});
test("pantry inventory flags expiry from an explicit as-of date",async()=>{
 const result=await run(4,{asOfDate:"2026-11-20",items:[{id:"expired",name:"Milk",quantity:1,expiryDate:"2026-11-19"},{id:"soon",name:"Yogurt",quantity:2,expiryDate:"2026-11-22"},{id:"safe",name:"Rice",quantity:3,expiryDate:"2027-01-01"}]});
 const o=result.artifact.domainResult.domainOutput;assert.deepEqual(o.expiredItemIds,["expired"]);assert.deepEqual(o.expiringSoonItemIds,["soon"]);
});
test("space planning identifies objects that exceed supplied room dimensions",async()=>{
 const result=await run(5,{room:{width:3,length:4},items:[{id:"desk",width:1,length:1.2},{id:"wardrobe",width:4,length:2}]});
 const o=result.artifact.domainResult.domainOutput;assert.deepEqual(o.fitCheck.map(x=>x.fitsRoomFootprint),[true,false]);assert.equal(o.layoutApproved,false);
});
test("cleaning marketplace excludes unverified and unavailable providers",async()=>{
 const result=await run(6,{serviceArea:"Baku",providers:[{id:"a",verified:true,evidenceId:"proof-a",available:true,serviceAreas:["Baku"]},{id:"b",verified:false,evidenceId:"",available:true,serviceAreas:["Baku"]},{id:"c",verified:true,evidenceId:"proof-c",available:false,serviceAreas:["Baku"]}]});
 assert.deepEqual(result.artifact.domainResult.domainOutput.eligibleProviderIds,["a"]);assert.equal(result.artifact.domainResult.domainOutput.bookingExecuted,false);
});
test("moving estimate uses supplied volume and distance rates without booking",async()=>{
 const result=await run(7,{volumeCubicMeters:8,distanceKm:12,ratePerCubicMeter:4,ratePerKm:2,currency:"AZN"});
 const o=result.artifact.domainResult.domainOutput;assert.equal(o.estimatedCost,56);assert.equal(o.bookingExecuted,false);
});
test("plant care calculates due review dates only from user-supplied intervals",async()=>{
 const result=await run(8,{asOfDate:"2026-11-20",plants:[{id:"p1",name:"Plant A",lastWatered:"2026-11-16",wateringIntervalDays:4},{id:"p2",name:"Plant B",lastWatered:"2026-11-18",wateringIntervalDays:7}]});
 const o=result.artifact.domainResult.domainOutput;assert.deepEqual(o.duePlantIds,["p1"]);assert.equal(o.remindersScheduled,false);
});
test("installer matching requires skill, availability, verification and evidence",async()=>{
 const result=await run(9,{jobs:[{id:"j1",skill:"solar"}],providers:[{id:"a",skills:["solar"],available:true,verified:true,evidenceId:"proof-a"},{id:"b",skills:["solar"],available:true,verified:false,evidenceId:""},{id:"c",skills:["plumbing"],available:true,verified:true,evidenceId:"proof-c"}]});
 assert.deepEqual(result.artifact.domainResult.domainOutput.matches[0].providerIds,["a"]);assert.equal(result.artifact.domainResult.domainOutput.appointmentBooked,false);
});
test("meal planning creates a shopping gap list from pantry inventory",async()=>{
 const result=await run(10,{pantry:["rice","tomato"],meals:[{id:"m1",name:"Meal 1",ingredients:["rice","tomato","beans"],prepMinutes:20},{id:"m2",name:"Meal 2",ingredients:["tomato","oil"],prepMinutes:10}]});
 const o=result.artifact.domainResult.domainOutput;assert.deepEqual(o.shoppingList,["beans","oil"]);assert.equal(o.totalPrepMinutes,30);assert.equal(o.shoppingExecuted,false);
});
test("overlay domain execution never crosses tenant or performs external side effects",async()=>{
 const result=await run(1,{serviceType:"plumbing",providers:[]});assert.equal(result.domainLogicExecuted,true);assert.equal(result.externalExecutionPerformed,false);assert.equal(result.paymentExecuted,false);assert.equal(result.productionVerified,false);
});

test("returns and warranty triage separates return-window eligibility from warranty review",async()=>{
 const result=await run(15,{asOfDate:"2026-11-20",returns:[
  {id:"r1",purchaseDate:"2026-11-10",returnWindowDays:14,condition:"unused",orderId:"o1"},
  {id:"r2",purchaseDate:"2026-10-01",returnWindowDays:14,condition:"used",orderId:"o2"}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.cases[0].returnEligibility,"POTENTIALLY_ELIGIBLE");
 assert.equal(o.cases[1].returnEligibility,"OUTSIDE_RETURN_WINDOW");
 assert.equal(o.refundIssued,false);
});
test("household budget totals supplied income and expenses without giving investment advice",async()=>{
 const result=await run(16,{currency:"AZN",income:[{amount:2000}],expenses:[{category:"housing",amount:900},{category:"food",amount:300}],budgetLimits:{housing:1000,food:250}});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.totalIncome,2000);assert.equal(o.totalExpenses,1200);assert.equal(o.remaining,800);
 assert.deepEqual(o.overLimitCategories,["food"]);
});
test("tool rental excludes unavailable and maintenance-blocked inventory",async()=>{
 const result=await run(17,{requestedToolType:"drill",tools:[
  {id:"t1",type:"drill",available:true,maintenanceDue:false},
  {id:"t2",type:"drill",available:false,maintenanceDue:false},
  {id:"t3",type:"drill",available:true,maintenanceDue:true}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.eligibleToolIds,["t1"]);assert.equal(o.rentalReserved,false);
});
test("clothing rental checks explicit date overlap without ranking body appearance",async()=>{
 const result=await run(18,{itemIds:["coat-1","coat-2"],startDate:"2026-12-01",endDate:"2026-12-05",rentals:[
  {itemId:"coat-1",startDate:"2026-12-03",endDate:"2026-12-07"},
  {itemId:"coat-2",startDate:"2026-11-20",endDate:"2026-11-25"}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.availableItemIds,["coat-2"]);assert.equal(o.rentalConfirmed,false);
});
test("gift suggestions match only supplied interests and budget bounds",async()=>{
 const result=await run(19,{interests:["books","puzzles"],budgetMin:10,budgetMax:30,gifts:[
  {id:"g1",price:20,interests:["books"]},{id:"g2",price:40,interests:["books"]},{id:"g3",price:15,interests:["sports"]}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.recommendedGiftIds,["g1"]);assert.equal(o.purchaseExecuted,false);
});
test("recycling coordinator distinguishes accepted, unverified and rejected materials",async()=>{
 const result=await run(20,{materials:["paper","glass","battery"],acceptedMaterials:["paper","glass"],rejectedMaterials:["battery"]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.acceptedMaterials,["paper","glass"]);assert.deepEqual(o.rejectedMaterials,["battery"]);
 assert.equal(o.unclassifiedMaterials.length,0);assert.equal(o.collectionScheduled,false);
});

test("career guidance maps supplied skills to role requirements and flags evidence gaps",async()=>{
 const result=await run(31,{requiredSkills:["writing","analysis","excel"],providedSkills:["writing","analysis"],requiredEvidence:["portfolio","certificate"],providedEvidence:["portfolio"]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.skillGaps,["excel"]);assert.deepEqual(o.evidenceGaps,["certificate"]);assert.equal(o.employmentDecisionMade,false);
});
test("skill map creates prerequisite-aware learning stages without claiming certification",async()=>{
 const result=await run(32,{skills:[{id:"s1",name:"Basics"},{id:"s2",name:"Advanced",prerequisites:["s1"]}],completedSkillIds:["s1"]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.stages[1].prerequisitesMet,true);assert.deepEqual(o.remainingSkillIds,["s2"]);assert.equal(o.certificationIssued,false);
});
test("focus planner prioritizes tasks within supplied time capacity without scheduling",async()=>{
 const result=await run(33,{availableMinutes:60,tasks:[{id:"a",priority:"high",estimatedMinutes:40},{id:"b",priority:"normal",estimatedMinutes:30},{id:"c",priority:"low",estimatedMinutes:10}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.selectedTaskIds,["a","c"]);assert.deepEqual(o.deferredTaskIds,["b"]);assert.equal(o.scheduleCreated,false);
});
test("content studio creates channel-specific drafts and blocks unconfirmed rights",async()=>{
 const result=await run(34,{topic:"Product launch",platforms:["instagram","youtube"],formats:["post","short"],rightsConfirmed:false,assets:[{id:"a1",rightsConfirmed:false}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.draftVariants.length,4);assert.equal(o.rightsGate,"BLOCKED_PENDING_RIGHTS_REVIEW");assert.equal(o.published,false);
});
test("website builder detects duplicate slugs and requires domain and owner approval",async()=>{
 const result=await run(36,{pages:[{id:"p1",slug:"/about"},{id:"p2",slug:"/about"}],domainVerified:false,publishApproved:false});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.duplicateSlugs,["/about"]);assert.equal(o.publicationReadiness,"BLOCKED");assert.equal(o.sitePublished,false);
});
test("data analyst computes descriptive metrics only from supplied numeric observations",async()=>{
 const result=await run(38,{rows:[{sales:10,units:2},{sales:20,units:3},{sales:30,units:5}],numericFields:["sales","units"]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.metrics.sales.sum,60);assert.equal(o.metrics.sales.average,20);assert.equal(o.rowCount,3);
});
test("payment follow-up calculates outstanding balances without initiating payments",async()=>{
 const result=await run(39,{asOfDate:"2026-11-20",invoices:[
  {id:"i1",amount:100,paidAmount:40,dueDate:"2026-11-19"},
  {id:"i2",amount:50,paidAmount:50,dueDate:"2026-11-25"}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.totalOutstanding,60);assert.deepEqual(o.overdueInvoiceIds,["i1"]);assert.equal(o.paymentInitiated,false);
});
test("trip planner detects overlapping itinerary slots and never books",async()=>{
 const result=await run(41,{items:[
  {id:"a",day:"2026-12-01",startTime:"10:00",endTime:"12:00"},
  {id:"b",day:"2026-12-01",startTime:"11:00",endTime:"13:00"},
  {id:"c",day:"2026-12-01",startTime:"14:00",endTime:"15:00"}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.conflictPairs,[["a","b"]]);assert.equal(o.bookingExecuted,false);
});
test("travel budget totals itemized costs and reports budget variance",async()=>{
 const result=await run(43,{currency:"AZN",budget:500,costs:[{category:"stay",amount:200},{category:"transport",amount:100},{category:"food",amount:80}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.totalEstimatedCost,380);assert.equal(o.remainingBudget,120);assert.equal(o.withinBudget,true);
});
test("local experience discovery returns only supplied matching candidates and preserves evidence state",async()=>{
 const result=await run(44,{location:"Baku",interests:["museum"],experiences:[
  {id:"e1",location:"Baku",categories:["museum"],evidenceId:"src-1",verified:true},
  {id:"e2",location:"Baku",categories:["museum"],evidenceId:"",verified:false},
  {id:"e3",location:"Ganja",categories:["museum"],evidenceId:"src-3",verified:true}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.candidateIds,["e1","e2"]);assert.deepEqual(o.unverifiedCandidateIds,["e2"]);assert.equal(o.reservationExecuted,false);
});

test("intent marketplace matches only same-domain candidates with consent and evidence",async()=>{
 const result=await run(51,{intent:{category:"repair",location:"Baku",consent:true},offers:[
  {id:"o1",category:"repair",location:"Baku",visible:true,verified:true,evidenceId:"proof-1"},
  {id:"o2",category:"repair",location:"Baku",visible:true,verified:false,evidenceId:""},
  {id:"o3",category:"cleaning",location:"Baku",visible:true,verified:true,evidenceId:"proof-3"}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.matchIds,["o1"]);assert.equal(o.contactExecuted,false);
});
test("agent autonomy denies by default and requires approval for sensitive actions",async()=>{
 const result=await run(52,{agentId:"agent-1",action:{type:"external_publish",sensitive:true},policies:[]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.decision,"DENY");assert.equal(o.reason,"NO_MATCHING_ALLOW_POLICY");assert.equal(o.actionExecuted,false);
});
test("scenario simulator computes transparent differences without choosing or executing",async()=>{
 const result=await run(53,{scenarios:[{id:"base",value:100,weight:1},{id:"high",value:130,weight:0.5},{id:"low",value:80,weight:0.5}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.scenarios.length,3);assert.equal(o.range.minimum,80);assert.equal(o.range.maximum,130);assert.equal(o.decisionMade,false);
});
test("owner command center reports pending work and never executes queued actions",async()=>{
 const result=await run(54,{workItems:[{id:"w1",status:"pending",priority:"high"},{id:"w2",status:"approved",priority:"normal"}],approvals:[{id:"a1",status:"pending"}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.pendingWorkCount,1);assert.equal(o.pendingApprovalCount,1);assert.equal(o.actionsExecuted,false);
});

test("childcare organizer records verified caregiver options without making contact",async()=>{
 const result=await run(21,{careWindow:"2026-11-21 AM",children:[{id:"c1",careNotes:"school pickup"}],caregivers:[
 {id:"g1",verified:true,evidenceId:"ref-1",availability:["2026-11-21 AM"],consentToList:true},
 {id:"g2",verified:false,evidenceId:"",availability:["2026-11-21 AM"],consentToList:true}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.eligibleCaregiverIds,["g1"]);assert.equal(o.contactExecuted,false);assert.equal(o.careArrangementConfirmed,false);
});
test("general meal planner reports ingredient gaps without calorie or diet prescriptions",async()=>{
 const result=await run(22,{meals:[{id:"m1",name:"Lunch",ingredients:["rice","beans","tomato"]}],availableIngredients:["rice","tomato"],preferences:["vegetarian"]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.shoppingGaps,["beans"]);assert.equal(o.calorieTarget,null);assert.equal(o.medicalDietAdviceIssued,false);
});
test("movement habit planner uses user-set gentle goals and never schedules unsafe intensity",async()=>{
 const result=await run(23,{asOfDate:"2026-11-20",habits:[{id:"walk",label:"Walk",frequencyPerWeek:3,minutesPerSession:15},{id:"stretch",label:"Stretch",frequencyPerWeek:2,minutesPerSession:5}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.weeklyPlannedMinutes,55);assert.equal(o.intensityPrescriptionIssued,false);assert.equal(o.activitiesScheduled,false);
});
test("relaxation toolkit produces optional non-clinical grounding prompts",async()=>{
 const result=await run(24,{preferredDurationMinutes:3,preferences:["quiet","sitting"],avoid:["audio"]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.durationMinutes,3);assert.equal(o.clinicalTreatmentClaimed,false);assert.equal(o.optionalParticipation,true);
});
test("sleep habit journal summarizes only user-provided entries",async()=>{
 const result=await run(25,{entries:[{date:"2026-11-18",sleepHours:8,restedRating:3},{date:"2026-11-19",sleepHours:7.5,restedRating:2}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.entryCount,2);assert.equal(o.averageReportedHours,7.75);assert.equal(o.diagnosisMade,false);
});
test("family leisure planner filters activities by supplied age suitability and budget",async()=>{
 const result=await run(26,{budget:30,activities:[
 {id:"a",cost:10,ageSuitable:true,verified:true,evidenceId:"src-a"},
 {id:"b",cost:40,ageSuitable:true,verified:true,evidenceId:"src-b"},
 {id:"c",cost:5,ageSuitable:false,verified:true,evidenceId:"src-c"}
 ]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.candidateActivityIds,["a"]);assert.equal(o.bookingExecuted,false);
});
test("learning coach turns a skill into achievable milestones without claiming certification",async()=>{
 const result=await run(27,{skill:"basic coding",currentLevel:"beginner",milestones:[{id:"m1",title:"variables",estimatedMinutes:30},{id:"m2",title:"conditions",estimatedMinutes:45}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.milestoneCount,2);assert.equal(o.totalEstimatedMinutes,75);assert.equal(o.certificationIssued,false);
});
test("work life planner detects schedule conflicts and preserves user-selected priorities",async()=>{
 const result=await run(28,{priorities:["school","family","rest"],events:[{id:"e1",day:"Mon",startTime:"09:00",endTime:"10:00"},{id:"e2",day:"Mon",startTime:"09:30",endTime:"10:30"}]});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.conflictPairs,[["e1","e2"]]);assert.deepEqual(o.priorities,["school","family","rest"]);assert.equal(o.calendarChanged,false);
});
test("pet care organizer tracks owner-entered care tasks without veterinary diagnosis",async()=>{
 const result=await run(29,{tasks:[{id:"food",label:"Food",dueDate:"2026-11-20",completed:false},{id:"walk",label:"Walk",dueDate:"2026-11-21",completed:false}],asOfDate:"2026-11-20"});
 const o=result.artifact.domainResult.domainOutput;
 assert.deepEqual(o.dueTaskIds,["food"]);assert.equal(o.veterinaryAdviceIssued,false);assert.equal(o.externalReminderSent,false);
});
test("language practice planner generates reviewable sessions from supplied goals",async()=>{
 const result=await run(30,{language:"English",level:"beginner",topics:["greetings","directions"],minutesPerSession:15,sessionsPerWeek:3});
 const o=result.artifact.domainResult.domainOutput;
 assert.equal(o.plannedWeeklyMinutes,45);assert.equal(o.topicCount,2);assert.equal(o.externalLessonBooked,false);
});
test("idea dispatch uses its exact module identity rather than a colliding problem sequence",async()=>{
 const result=await executeAriaDomainModule("ARIA-IDEA-MODULE-049",{goal:"Check exact dispatch",context:{sensitiveData:true,retentionDays:365,purpose:"service",controls:["access-control"],recipients:["internal-team"]}},{actorId:"actor",tenantId:"tenant"});
 assert.equal(result.domainLogicExecuted,true);
 assert.ok(result.artifact.domainResult.domainOutput.riskFlags.includes("SENSITIVE_DATA"));
 assert.equal(result.artifact.domainResult.domainOutput.privacyApprovalIssued,false);
});
