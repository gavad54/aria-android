"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const {once}=require("node:events");
test("ARIA API health, modules, validation and planning",async()=>{
 const port=32000+Math.floor(Math.random()*1000);
 const child=spawn(process.execPath,["server.js"],{env:{...process.env,PORT:String(port)},stdio:"ignore"});
 try {
  let ready=false;
  for(let i=0;i<50;i++){try{const r=await fetch("http://127.0.0.1:"+port+"/health");if(r.ok){ready=true;break;}}catch{} await new Promise(resolve=>setTimeout(resolve,100));}
  assert.equal(ready,true,"server should start");
  const base="http://127.0.0.1:"+port;
  const h=await fetch(base+"/api/health");assert.equal(h.status,200);assert.equal((await h.json()).ok,true);
  const m=await fetch(base+"/api/modules");const md=await m.json();assert.equal(m.status,200);assert.ok(md.modules.length>=5);
  const bad=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:" "})});assert.equal(bad.status,400);
  const plan=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برای ایده کسب و کار من برنامه بده"})});
  const pd=await plan.json();assert.equal(plan.status,200);assert.equal(pd.ok,true);assert.equal(pd.plan.phases.length,3);assert.equal(pd.plan.category,"business");
  const legacy=await fetch(base+"/api/intent",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برنامه‌ریزی"})});assert.equal(legacy.status,200);assert.equal((await legacy.json()).accepted,true);
  const notFound=await fetch(base+"/api/nope");assert.equal(notFound.status,404);
 } finally {child.kill();await once(child,"exit").catch(()=>{});}
});
