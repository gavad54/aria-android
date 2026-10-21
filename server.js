"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const server = http.createServer((req,res) => {
  const url = new URL(req.url || "/", "http://localhost");
  if (url.pathname === "/health" || url.pathname === "/api/health") {
    res.writeHead(200, {"content-type":"application/json; charset=utf-8","cache-control":"no-store"});
    return res.end(JSON.stringify({ok:true,service:"aria-web",version:"0.1.0",mode:"web-shell",productionIntegrations:false}));
  }
  if (url.pathname === "/api/intent" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; if (body.length > 20000) req.destroy(); });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        const intent = typeof data.intent === "string" ? data.intent.trim().slice(0,2000) : "";
        if (!intent) { res.writeHead(400, {"content-type":"application/json; charset=utf-8"}); return res.end(JSON.stringify({error:"لطفاً درخواست خود را بنویسید."})); }
        res.writeHead(200, {"content-type":"application/json; charset=utf-8","cache-control":"no-store"});
        res.end(JSON.stringify({accepted:true,intent,status:"received",message:"درخواست در نسخهٔ نمایشی دریافت شد. برای اجرای واقعی، موتور هوش مصنوعی و ذخیره‌سازی امن باید پیکربندی شوند."}));
      } catch { res.writeHead(400, {"content-type":"application/json; charset=utf-8"}); res.end(JSON.stringify({error:"درخواست نامعتبر است."})); }
    });
    return;
  }
  let requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  let file = path.resolve(root, "." + requested);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, {"content-type":"text/plain; charset=utf-8"}); return res.end("Not found");
  }
  res.writeHead(200, {"content-type":types[path.extname(file)] || "application/octet-stream","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin"});
  fs.createReadStream(file).pipe(res);
});
server.listen(port, "0.0.0.0", () => console.log("ARIA web listening on " + port));
