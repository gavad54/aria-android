"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {handle}=require("../backend/aria_expansion_runtime.cjs");

function makeHarness(payload,user={sub:41}){
 const calls=[];
 const pool={query:async(sql,args=[])=>{
  calls.push({sql,args});
  if(sql.includes("INSERT INTO aria_expansion_work_items")) return {rowCount:1,rows:[{id:7,module_id:args[1],title:args[2],status:"planned",created_at:"2026-11-20T00:00:00.000Z"}]};
  return {rowCount:0,rows:[]};
 }};
 const res={statusCode:200,body:null};
 const deps={
  json:(target,status,body)=>{target.statusCode=status;target.body=body;return body;},
  readJson:async()=>payload,
  authUser:()=>user,
  requireDb:async()=>true,
  pool
 };
 const req={method:"POST",headers:{}};
 const url=new URL("http://localhost/api/aria-expansion/modules/ARIA-PROBLEM-MODULE-002/run");
 return {req,res,url,deps,calls};
}

test("overlay API persists dedicated repair-estimate domain output within authenticated personal scope",async()=>{
 const h=makeHarness({goal:"Estimate supplied repair costs",consent:true,context:{currency:"AZN",laborHours:2,laborRate:30,materials:[{name:"pipe",quantity:2,unitPrice:5}]}});
 const handled=await handle(h.req,h.res,h.url,h.deps);
 assert.ok(handled);
 assert.equal(h.res.statusCode,201);
 assert.equal(h.res.body.domainLogicExecuted,true);
 assert.equal(h.res.body.tenantBoundary,"PERSONAL_ACCOUNT_SCOPE");
 assert.equal(h.res.body.externalExecutionPerformed,false);
 const insert=h.calls.find(x=>x.sql.includes("INSERT INTO aria_expansion_work_items"));
 assert.ok(insert);
 assert.equal(insert.args[0],41);
 const saved=JSON.parse(insert.args[3]);
 assert.equal(saved.executionStatus,"LOCAL_UNIT_SPECIFIC_DOMAIN_LOGIC_EXECUTED");
 assert.equal(saved.domainExecution.domainLogicExecuted,true);
 assert.equal(saved.domainExecution.artifact.domainResult.domainOutput.totalEstimate,70);
 assert.equal(saved.domainExecution.tenantScope,"41");
});

test("overlay API requires explicit consent before saving consent-gated modules",async()=>{
 const h=makeHarness({goal:"Prepare a provider discovery",consent:false,context:{serviceType:"plumbing"}});
 h.url=new URL("http://localhost/api/aria-expansion/modules/ARIA-PROBLEM-MODULE-001/run");
 await handle(h.req,h.res,h.url,h.deps);
 assert.equal(h.res.statusCode,403);
 assert.equal(h.res.body.error,"MODULE_CONSENT_REQUIRED");
 assert.equal(h.calls.some(x=>x.sql.includes("INSERT INTO aria_expansion_work_items")),false);
});

test("overlay API rejects oversized and unsafe payloads before database writes",async()=>{
 const h=makeHarness({goal:"Prepare a repair estimate",consent:true,context:{note:"x".repeat(70000)}});
 await handle(h.req,h.res,h.url,h.deps);
 assert.equal(h.res.statusCode,400);
 assert.equal(h.res.body.error,"MODULE_INPUT_TOO_LARGE");
 assert.equal(h.calls.some(x=>x.sql.includes("INSERT INTO aria_expansion_work_items")),false);
});

test("commercial catalog API executes its exact catalog-entry handler and persists scoped output",async()=>{
 const h=makeHarness({goal:"Prepare a household workflow",consent:true,context:{tasks:[{id:"t1",title:"Inspect home maintenance"}],preferences:["local"]}});
 h.url=new URL("http://localhost/api/aria-expansion/commercial-modules/life-home-assistant/run");
 await handle(h.req,h.res,h.url,h.deps);
 assert.equal(h.res.statusCode,201);
 assert.equal(h.res.body.domainLogicExecuted,true);
 assert.equal(h.res.body.handlerKey,"aria.catalog.707");
 assert.equal(h.res.body.tenantBoundary,"PERSONAL_ACCOUNT_SCOPE");
 assert.equal(h.res.body.paymentExecuted,false);
 const insert=h.calls.find(x=>x.sql.includes("INSERT INTO aria_expansion_work_items"));
 assert.ok(insert);
 const saved=JSON.parse(insert.args[3]);
 assert.equal(saved.executionStatus,"LOCAL_UNIT_SPECIFIC_DOMAIN_LOGIC_EXECUTED");
 assert.equal(saved.domainExecution.domainLogicExecuted,true);
 assert.equal(saved.domainExecution.artifact.domainResult.moduleSpecificProfile.profileId,"PROFILE:ARIA-CATALOG-707");
});
