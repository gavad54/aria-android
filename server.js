"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const modules = [
 {id:"command-center",name:"مرکز فرمان هوشمند",status:"available",description:"ورودی یکپارچه برای درخواست‌ها و مسیرهای اقدام"},
 {id:"idea-to-value",name:"ایده تا ارزش",status:"prototype",description:"تبدیل ایده به مراحل اجرایی قابل پیگیری"},
 {id:"opportunities",name:"رشد و فرصت‌ها",status:"prototype",description:"ثبت و اولویت‌بندی فرصت‌ها"},
 {id:"learning-creator",name:"یادگیری و تولید",status:"prototype",description:"ساختاردهی برنامه‌های یادگیری و تولید محتوا"},
 {id:"workflows",name:"گردش‌کارها",status:"prototype",description:"طراحی فرایندها و نقاط تأیید"},
 {id:"trust-control",name:"اعتماد و کنترل",status:"available",description:"اعتبارسنجی ورودی‌ها و مرزبندی اجرای امن"}
];
const rateBuckets = new Map();
function json(res,status,data,extra={}) { res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...extra}); res.end(JSON.stringify(data)); }
function securityHeaders(res) { res.setHeader("x-content-type-options","nosniff"); res.setHeader("referrer-policy","strict-origin-when-cross-origin"); res.setHeader("x-frame-options","DENY"); res.setHeader("permissions-policy","camera=(), microphone=(), geolocation=()"); res.setHeader("content-security-policy","default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"); }
function rateLimited(req) {
 const now=Date.now(), key=req.socket.remoteAddress || "unknown";
 let bucket=rateBuckets.get(key);
 if(!bucket || now-bucket.start>60000) bucket={start:now,count:0};
 bucket.count++; rateBuckets.set(key,bucket);
 if(rateBuckets.size>5000) for(const [k,v] of rateBuckets) if(now-v.start>60000) rateBuckets.delete(k);
 return bucket.count>60;
}
function readJson(req,res) {
 return new Promise(resolve=>{
  let body="", done=false;
  req.on("data",chunk=>{
   if(done)return;
   body+=chunk.toString("utf8");
   if(Buffer.byteLength(body)>12000){done=true;json(res,413,{error:"حجم درخواست بیش از حد مجاز است."});resolve(null);req.destroy();}
  });
  req.on("end",()=>{
   if(done)return;
   try { resolve(JSON.parse(body || "{}")); }
   catch { json(res,400,{error:"بدنهٔ درخواست باید JSON معتبر باشد."}); resolve(null); }
  });
  req.on("error",()=>{if(!done){done=true;resolve(null);}});
 });
}
function makePlan(intent) {
 const cleaned=intent.trim().slice(0,2000);
 const kind=/محتوا|اینستاگرام|ویدئو|پست|آموزش/.test(cleaned)?"content":/کسب.?و.?کار|درآمد|فروش|محصول|ایده/.test(cleaned)?"business":"general";
 const phases = kind==="content" ? [
  {step:1,title:"تعریف مخاطب و هدف",tasks:["مخاطب اصلی را مشخص کن","هدف محتوا و اقدام مورد انتظار را بنویس"],checkpoint:"هدف و مخاطب روشن باشد"},
  {step:2,title:"طراحی محتوا",tasks:["موضوع و پیام اصلی را تعیین کن","قالب متن، تصویر یا ویدئو را انتخاب کن"],checkpoint:"پیش‌نویس محتوا آماده باشد"},
  {step:3,title:"بازبینی و انتشار",tasks:["دقت، حقوق محتوا و حریم خصوصی را بررسی کن","زمان انتشار و معیار سنجش را ثبت کن"],checkpoint:"تأیید نهایی پیش از انتشار"}
 ] : kind==="business" ? [
  {step:1,title:"تعریف مسئله و مشتری",tasks:["نیاز مشخص مشتری را تعریف کن","گروه مشتری و جایگزین‌های موجود را بررسی کن"],checkpoint:"مسئله و مشتری هدف قابل سنجش باشد"},
  {step:2,title:"آزمون کم‌هزینه",tasks:["یک نمونهٔ ساده از راه‌حل بساز","با چند مشتری بالقوه بازخورد بگیر"],checkpoint:"شواهد اولیهٔ تقاضا ثبت شود"},
  {step:3,title:"مدل درآمد و اجرا",tasks:["هزینه، قیمت و منبع درآمد را برآورد کن","مسئول، زمان‌بندی و شاخص موفقیت تعیین کن"],checkpoint:"فرضیه‌های مالی و ریسک‌ها مستند باشند"}
 ] : [
  {step:1,title:"شفاف‌سازی نتیجه",tasks:["نتیجهٔ نهایی را در یک جمله تعریف کن","محدودیت‌ها و معیار موفقیت را بنویس"],checkpoint:"نتیجه قابل بررسی باشد"},
  {step:2,title:"تقسیم به گام‌ها",tasks:["کار را به سه تا پنج اقدام کوچک تقسیم کن","برای هر اقدام مسئول و موعد تعیین کن"],checkpoint:"هر اقدام خروجی مشخص داشته باشد"},
  {step:3,title:"اجرا و ارزیابی",tasks:["اولین گام کم‌ریسک را اجرا کن","نتیجه را با معیار موفقیت مقایسه کن"],checkpoint:"تصمیم بعدی بر اساس نتیجه گرفته شود"}
 ];
 return {planId:"local-"+Date.now().toString(36),intent:cleaned,category:kind,createdAt:new Date().toISOString(),phases,disclaimer:"این برنامه با قواعد محلی ساخته شده و خروجی مدل هوش مصنوعی نیست. پیش از اقدامات حساس، انسانی آن را بررسی کنید."};
}
const server=http.createServer(async(req,res)=>{
 securityHeaders(res);
 let url;
 try { url=new URL(req.url || "/", "http://localhost"); }
 catch { return json(res,400,{error:"نشانی نامعتبر است."}); }
 if(req.method==="OPTIONS"){res.writeHead(204,{"access-control-allow-methods":"GET, POST, OPTIONS","access-control-allow-headers":"content-type"});return res.end();}
 if(url.pathname==="/health" || url.pathname==="/api/health"){
  if(req.method!=="GET")return json(res,405,{error:"روش درخواست پشتیبانی نمی‌شود."});
  return json(res,200,{ok:true,service:"aria-web",version:"0.2.0",mode:"prototype",productionIntegrations:false});
 }
 if(url.pathname.startsWith("/api/") && rateLimited(req)) return json(res,429,{error:"تعداد درخواست‌ها زیاد است. یک دقیقه دیگر دوباره تلاش کنید."},{"retry-after":"60"});
 if(url.pathname==="/api/modules" && req.method==="GET") return json(res,200,{modules});
 if(url.pathname==="/api/plan" && req.method==="POST"){
  const data=await readJson(req,res); if(data===null)return;
  const intent=typeof data.intent==="string"?data.intent.trim():"";
  if(!intent)return json(res,400,{error:"لطفاً درخواست خود را بنویسید."});
  if(intent.length>2000)return json(res,400,{error:"درخواست نباید بیشتر از ۲۰۰۰ نویسه باشد."});
  return json(res,200,{ok:true,plan:makePlan(intent)});
 }
 if(url.pathname==="/api/intent" && req.method==="POST"){
  const data=await readJson(req,res); if(data===null)return;
  const intent=typeof data.intent==="string"?data.intent.trim():"";
  if(!intent)return json(res,400,{error:"لطفاً درخواست خود را بنویسید."});
  if(intent.length>2000)return json(res,400,{error:"درخواست نباید بیشتر از ۲۰۰۰ نویسه باشد."});
  return json(res,200,{accepted:true,intent,status:"received",message:"درخواست دریافت شد. برای برنامهٔ اولیه از مسیر /api/plan استفاده کنید؛ اتصال مدل هوش مصنوعی زنده هنوز فعال نیست."});
 }
 if(url.pathname.startsWith("/api/")) return json(res,404,{error:"مسیر API پیدا نشد."});
 if(req.method!=="GET" && req.method!=="HEAD")return json(res,405,{error:"روش درخواست پشتیبانی نمی‌شود."});
 let requested;
 try { requested=decodeURIComponent(url.pathname==="/"?"/index.html":url.pathname); }
 catch { return json(res,400,{error:"مسیر نامعتبر است."}); }
 const file=path.resolve(root,"."+requested);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return json(res,404,{error:"صفحه پیدا نشد."});
 res.writeHead(200,{"content-type":types[path.extname(file)]||"application/octet-stream","cache-control":path.extname(file)===".html"?"no-cache":"public, max-age=300"});
 if(req.method==="HEAD")return res.end();
 fs.createReadStream(file).pipe(res);
});
server.listen(port,"0.0.0.0",()=>console.log("ARIA web listening on "+port));
