"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const {once}=require("node:events");
test("ARIA API health, modules, validation, planning and auth boundaries",async()=>{
 const port=32000+Math.floor(Math.random()*1000);
 const env={...process.env,PORT:String(port)};
 delete env.DATABASE_URL;delete env.ARIA_JWT_SECRET;delete env.OPENAI_API_KEY;
 const child=spawn(process.execPath,["server.js"],{env,stdio:"ignore"});
 try{
  let ready=false;
  for(let i=0;i<50;i++){try{const r=await fetch("http://127.0.0.1:"+port+"/health");if(r.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
  assert.equal(ready,true,"server should start");
  const base="http://127.0.0.1:"+port;
  const h=await fetch(base+"/api/health");const hd=await h.json();assert.equal(h.status,200);assert.equal(hd.ok,true);assert.equal(hd.databaseConfigured,false);
  const m=await fetch(base+"/api/modules");const md=await m.json();assert.equal(m.status,200);assert.ok(md.modules.length>=5);
  const bad=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:" "})});assert.equal(bad.status,400);
  const long=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"x".repeat(2001)})});assert.equal(long.status,400);
  const plan=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برای ایده کسب و کار من برنامه بده"})});
  const pd=await plan.json();assert.equal(plan.status,200);assert.equal(pd.ok,true);assert.equal(pd.plan.phases.length,3);assert.equal(pd.plan.category,"business");assert.equal(pd.plan.source,"rule-based");
  const legacy=await fetch(base+"/api/intent",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برنامه‌ریزی"})});assert.equal(legacy.status,200);assert.equal((await legacy.json()).accepted,true);
  const unauth=await fetch(base+"/api/plans");assert.equal(unauth.status,401);
  const invalidEmail=await fetch(base+"/api/auth/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"not-an-email",password:"123456789012"})});assert.equal(invalidEmail.status,400);
  const register=await fetch(base+"/api/auth/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"test@example.com",password:"123456789012"})});assert.equal(register.status,503);
  const malformed=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:"{bad json"});assert.equal(malformed.status,400);
  const notFound=await fetch(base+"/api/nope");assert.equal(notFound.status,404);
 }finally{await new Promise(resolve=>{if(child.exitCode!==null||child.signalCode!==null)return resolve();child.once("exit",resolve);child.kill();});}
});
