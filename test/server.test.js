"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
test("ARIA server exposes health and intent validation", async () => {
  const port = 32000 + Math.floor(Math.random() * 1000);
  const child = spawn(process.execPath, ["server.js"], { env: { ...process.env, PORT: String(port) }, stdio: "ignore" });
  try {
    let ready = false;
    for (let i=0;i<40;i++) {
      try { const r=await fetch(`http://127.0.0.1:${port}/health`); if(r.ok){ready=true;break;} } catch {}
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.equal(ready,true,"server should start");
    const h=await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal((await h.json()).ok,true);
    const bad=await fetch(`http://127.0.0.1:${port}/api/intent`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:" "})});
    assert.equal(bad.status,400);
    const good=await fetch(`http://127.0.0.1:${port}/api/intent`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برنامه‌ریزی"})});
    assert.equal(good.status,200);
    assert.equal((await good.json()).accepted,true);
  } finally { child.kill(); await once(child,"exit").catch(()=>{}); }
});
