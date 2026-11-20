"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {executeAriaDomainModule}=require("../backend/aria-144-domain-runtime.cjs");

async function run(sequence,context) {
  return executeAriaDomainModule("ARIA-PROBLEM-MODULE-"+String(sequence).padStart(3,"0"),{
    goal:"Prepare a reviewable domain result",
    context,
    consent:true
  },{actorId:"overlay-wave-1-test",tenantId:"tenant-overlay-wave-1"});
}

test("repairer discovery ranks only verified providers with matching service and evidence",async()=>{
  const result=await run(1,{serviceType:"plumbing",serviceArea:"Baku",providers:[
    {id:"p1",name:"Verified plumber",serviceTypes:["plumbing"],serviceAreas:["Baku"],verified:true,evidenceId:"doc-1",rating:4.8},
    {id:"p2",name:"Unverified plumber",serviceTypes:["plumbing"],serviceAreas:["Baku"],verified:false,evidenceId:""},
    {id:"p3",name:"Wrong trade",serviceTypes:["electrical"],serviceAreas:["Baku"],verified:true,evidenceId:"doc-3"}
  ]});
  const output=result.artifact.domainResult;
  assert.deepEqual(output.eligibleProviders.map(x=>x.id),["p1"]);
  assert.equal(output.contactOrBookingExecuted,false);
  assert.equal(output.tenantScope,"tenant-overlay-wave-1");
});

test("repair estimate calculates supplied line items and labels estimate as non-binding",async()=>{
  const result=await run(2,{currency:"AZN",laborHours:2,laborRate:30,materials:[{name:"pipe",quantity:2,unitPrice:5},{name:"seal",quantity:1,unitPrice:3}]});
  const estimate=result.artifact.domainResult;
  assert.equal(estimate.materialSubtotal,13);
  assert.equal(estimate.laborSubtotal,60);
  assert.equal(estimate.totalEstimate,73);
  assert.equal(estimate.bindingQuote,false);
});

test("task delegation keeps unassigned tasks visible and sorts explicit priorities",async()=>{
  const result=await run(3,{tasks:[
    {id:"later",title:"Later",priority:"low",assigneeId:""},
    {id:"urgent",title:"Urgent",priority:"urgent",assigneeId:"worker-1"},
    {id:"normal",title:"Normal",priority:"normal"}
  ]});
  const output=result.artifact.domainResult;
  assert.equal(output.tasks[0].id,"urgent");
  assert.deepEqual(output.unassignedTaskIds,["later","normal"]);
  assert.equal(output.tasksScheduled,false);
});

test("pantry inventory flags expiry from an explicit as-of date",async()=>{
  const result=await run(4,{asOfDate:"2026-11-20",items:[
    {id:"expired",name:"Milk",quantity:1,expiryDate:"2026-11-19"},
    {id:"soon",name:"Yogurt",quantity:2,expiryDate:"2026-11-22"},
    {id:"safe",name:"Rice",quantity:3,expiryDate:"2027-01-01"}
  ]});
  const output=result.artifact.domainResult;
  assert.deepEqual(output.expiredItemIds,["expired"]);
  assert.deepEqual(output.expiringSoonItemIds,["soon"]);
});

test("space planning identifies objects that exceed supplied room dimensions",async()=>{
  const result=await run(5,{room:{width:3,length:4},items:[
    {id:"desk",width:1,length:1.2},
    {id:"wardrobe",width:4,length:2}
  ]});
  const output=result.artifact.domainResult;
  assert.deepEqual(output.fitCheck.map(x=>x.fitsRoomFootprint),[true,false]);
  assert.equal(output.layoutApproved,false);
});

test("cleaning marketplace excludes unverified and unavailable providers",async()=>{
  const result=await run(6,{serviceArea:"Baku",providers:[
    {id:"a",verified:true,evidenceId:"proof-a",available:true,serviceAreas:["Baku"]},
    {id:"b",verified:false,evidenceId:"",available:true,serviceAreas:["Baku"]},
    {id:"c",verified:true,evidenceId:"proof-c",available:false,serviceAreas:["Baku"]}
  ]});
  assert.deepEqual(result.artifact.domainResult.eligibleProviderIds,["a"]);
  assert.equal(result.artifact.domainResult.bookingExecuted,false);
});

test("moving estimate uses supplied volume and distance rates without booking",async()=>{
  const result=await run(7,{volumeCubicMeters:8,distanceKm:12,ratePerCubicMeter:4,ratePerKm:2,currency:"AZN"});
  const output=result.artifact.domainResult;
  assert.equal(output.estimatedCost,56);
  assert.equal(output.bookingExecuted,false);
});

test("plant care calculates due review dates only from user-supplied intervals",async()=>{
  const result=await run(8,{asOfDate:"2026-11-20",plants:[
    {id:"p1",name:"Plant A",lastWatered:"2026-11-16",wateringIntervalDays:4},
    {id:"p2",name:"Plant B",lastWatered:"2026-11-18",wateringIntervalDays:7}
  ]});
  const output=result.artifact.domainResult;
  assert.deepEqual(output.duePlantIds,["p1"]);
  assert.equal(output.remindersScheduled,false);
});

test("installer matching requires skill, availability, verification and evidence",async()=>{
  const result=await run(9,{jobs:[{id:"j1",skill:"solar"}],providers:[
    {id:"a",skills:["solar"],available:true,verified:true,evidenceId:"proof-a"},
    {id:"b",skills:["solar"],available:true,verified:false,evidenceId:""},
    {id:"c",skills:["plumbing"],available:true,verified:true,evidenceId:"proof-c"}
  ]});
  assert.deepEqual(result.artifact.domainResult.matches[0].providerIds,["a"]);
  assert.equal(result.artifact.domainResult.appointmentBooked,false);
});

test("meal planning creates a shopping gap list from pantry inventory",async()=>{
  const result=await run(10,{pantry:["rice","tomato"],meals:[
    {id:"m1",name:"Meal 1",ingredients:["rice","tomato","beans"],prepMinutes:20},
    {id:"m2",name:"Meal 2",ingredients:["tomato","oil"],prepMinutes:10}
  ]});
  const output=result.artifact.domainResult;
  assert.deepEqual(output.shoppingList,["beans","oil"]);
  assert.equal(output.totalPrepMinutes,30);
  assert.equal(output.shoppingExecuted,false);
});

test("overlay domain execution never crosses tenant or performs external side effects",async()=>{
  const result=await run(1,{serviceType:"plumbing",providers:[]});
  assert.equal(result.domainLogicExecuted,true);
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
});
