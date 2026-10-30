"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Pool}=require("pg");
const root=__dirname;
const port=Number(process.env.PORT||3000);
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const modules=[
 {id:"command-center",name:"مرکز فرمان هوشمند",status:"available",description:"ورودی یکپارچه برای درخواست‌ها و مسیرهای اقدام",revenueModel:"هستهٔ پلتفرم؛ اشتراک حرفه‌ای"},
 {id:"idea-to-value",name:"ایده تا ارزش",status:"prototype",description:"تبدیل ایده به مراحل اجرایی قابل پیگیری",revenueModel:"اشتراک حرفه‌ای؛ بستهٔ اعتبار"},
 {id:"opportunities",name:"رشد و فرصت‌ها",status:"prototype",description:"ثبت و اولویت‌بندی فرصت‌ها",revenueModel:"اشتراک حرفه‌ای"},
 {id:"learning-creator",name:"یادگیری و تولید",status:"prototype",description:"ساختاردهی برنامه‌های یادگیری و تولید محتوا",revenueModel:"اشتراک؛ فروش قالب"},
 {id:"workflows",name:"گردش‌کارها",status:"prototype",description:"طراحی فرایندها و نقاط تأیید",revenueModel:"اشتراک تیمی"},
 {id:"trust-control",name:"اعتماد و کنترل",status:"available",description:"اعتبارسنجی ورودی‌ها و مرزبندی اجرای امن",revenueModel:"کنترل پایه در همهٔ طرح‌ها"},
 {id:"ai-instagram",name:"ساخت کاور اینستاگرام با AI",status:"planned",description:"طراحی کاور و قالب‌های برندمحور؛ خروجی نهایی نیازمند اتصال تولید تصویر",revenueModel:"اعتبار تصویر؛ اشتراک حرفه‌ای"},
 {id:"image-editing",name:"ادیت و روتوش عکس",status:"planned",description:"ویرایش تصویر با حفظ رضایت و حقوق صاحب تصویر",revenueModel:"اعتبار تصویر"},
 {id:"profile-photo",name:"عکس پروفایل حرفه‌ای",status:"planned",description:"ساخت و آماده‌سازی عکس پروفایل برای کاربردهای حرفه‌ای",revenueModel:"پرداخت به‌ازای خروجی"},
 {id:"product-photo",name:"عکس محصول",status:"planned",description:"تصویر محصول با پس‌زمینه و قاب‌بندی تجاری",revenueModel:"اعتبار تصویر؛ بستهٔ فروشگاهی"},
 {id:"image-to-image",name:"تبدیل سبک تصویر با AI",status:"planned",description:"تغییر سبک تصویر با رعایت حقوق و محدودیت‌های محتوا",revenueModel:"اعتبار تصویر"},
 {id:"ad-banner",name:"بنر تبلیغاتی",status:"planned",description:"طراحی بنر با اندازه‌های کانال‌های تبلیغاتی",revenueModel:"اعتبار؛ اشتراک"},
 {id:"social-post-story",name:"پست و استوری",status:"planned",description:"ساخت پست و استوری با قالب‌های قابل ویرایش",revenueModel:"اشتراک؛ قالب پولی"},
 {id:"youtube-thumbnail",name:"تامبنیل یوتیوب",status:"planned",description:"تصویر بندانگشتی و نسخه‌های آزمون‌پذیر",revenueModel:"اعتبار تصویر"},
 {id:"face-reel",name:"ریلز و چهرهٔ سخنگو",status:"planned",description:"تولید ویدئوی سخنگو با افشای مصنوعی‌بودن و رضایت فرد",revenueModel:"اعتبار ویدئو"},
 {id:"avatar",name:"آواتار هوش مصنوعی",status:"planned",description:"ساخت آواتار غیرگمراه‌کننده برای کاربردهای مجاز",revenueModel:"اعتبار تصویر"},
 {id:"voice-video",name:"ویدئو ویدیویی",status:"planned",description:"تولید ویدئو از متن یا رسانهٔ مجاز",revenueModel:"اعتبار ویدئو"},
 {id:"subtitles-captions",name:"زیرنویس و کپشن",status:"planned",description:"رونویسی، زیرنویس و کپشن چندزبانه",revenueModel:"دقیقهٔ پردازش؛ اشتراک"},
 {id:"text-to-video",name:"تبدیل متن به ویدئو",status:"planned",description:"تبدیل سناریو به کلیپ با کنترل حقوق محتوا",revenueModel:"اعتبار ویدئو"},
 {id:"podcast-clips",name:"کلیپ‌سازی از پادکست",status:"planned",description:"استخراج بخش‌های کوتاه از فایل صوتی مجاز",revenueModel:"دقیقهٔ پردازش"},
 {id:"product-video-ad",name:"ویدئوی تبلیغ محصول",status:"planned",description:"ساخت سناریو و ویدئوی معرفی محصول",revenueModel:"اعتبار ویدئو؛ بستهٔ فروشگاهی"},
 {id:"logo-design",name:"طراحی لوگو با AI",status:"planned",description:"تولید ایدهٔ لوگو و خروجی قابل بازبینی؛ بررسی علامت تجاری جداگانه",revenueModel:"بستهٔ طراحی؛ اشتراک"},
 {id:"product-packaging",name:"بسته‌بندی محصول",status:"planned",description:"مفهوم بصری بسته‌بندی و ماکاپ",revenueModel:"بستهٔ طراحی"},
 {id:"professional-catalog",name:"کاتالوگ حرفه‌ای",status:"planned",description:"ساخت کاتالوگ از داده‌های تأییدشدهٔ محصول",revenueModel:"اشتراک؛ خروجی پولی"},
 {id:"mockup-maker",name:"موکاپ تبلیغاتی",status:"planned",description:"قرار دادن طرح روی موکاپ‌های کاربردی",revenueModel:"اعتبار تصویر"},
 {id:"character-design",name:"طراحی کاراکتر",status:"planned",description:"ساخت شخصیت بصری برای برند یا داستان",revenueModel:"اعتبار تصویر؛ مجوز تجاری جداگانه"},
 {id:"business-prompts",name:"پرامپت‌نویسی کسب‌وکار",status:"planned",description:"ساخت و مدیریت پرامپت‌های قابل استفادهٔ مجدد",revenueModel:"اشتراک؛ فروش قالب"},
 {id:"prompt-pack",name:"ساخت و فروش پک پرامپت",status:"planned",description:"بسته‌بندی، نسخه‌بندی و فروش پرامپت‌های اصیل",revenueModel:"کارمزد بازارگاه"},
 {id:"instagram-caption",name:"کپشن اینستاگرام",status:"planned",description:"نوشتن کپشن با لحن و هدف مشخص",revenueModel:"اشتراک؛ اعتبار متنی"},
 {id:"content-ideas",name:"ایده‌پردازی محتوایی",status:"planned",description:"تقویم ایده و بریف محتوایی",revenueModel:"اشتراک"},
 {id:"content-calendar",name:"تقویم محتوایی",status:"planned",description:"زمان‌بندی و سازمان‌دهی محتوا",revenueModel:"اشتراک تیمی"},
 {id:"content-management",name:"مدیریت محتوا با AI",status:"planned",description:"گردش‌کار تأیید، نسخه‌بندی و بازاستفادهٔ محتوا",revenueModel:"اشتراک تیمی"},
 {id:"resume-portfolio",name:"رزومه و پورتفولیو",status:"planned",description:"تولید رزومه و نمونه‌کار از اطلاعات واقعی کاربر",revenueModel:"خروجی پولی؛ اشتراک"},
 {id:"translation-localization",name:"ترجمه و بومی‌سازی",status:"planned",description:"ترجمهٔ متن و بومی‌سازی متناسب با بازار مقصد",revenueModel:"اعتبار متنی؛ طرح سازمانی"},
 {id:"pdf-summary",name:"خلاصه‌سازی PDF و مقاله",status:"planned",description:"استخراج و خلاصه‌سازی فایل‌های مجاز همراه ارجاع به بخش‌ها",revenueModel:"اعتبار سند؛ اشتراک"},
 {id:"flashcards-quizzes",name:"فلش‌کارت و آزمون",status:"planned",description:"تولید پرسش، آزمون و فلش‌کارت از منابع کاربر",revenueModel:"اشتراک آموزشی"},
 {id:"ai-tool-tutorials",name:"آموزش ابزارهای هوش مصنوعی",status:"planned",description:"راهنمای گام‌به‌گام و به‌روز ابزارها",revenueModel:"اشتراک؛ دورهٔ پولی"},
 {id:"chatbot-builder",name:"ساخت چت‌بات پاسخ‌گو",status:"planned",description:"ساخت دستیار مبتنی بر دانش تأییدشدهٔ کسب‌وکار",revenueModel:"اشتراک SaaS؛ مصرف API"},
 {id:"customer-support",name:"اتوماسیون پشتیبانی مشتری",status:"planned",description:"دسته‌بندی درخواست و پیش‌نویس پاسخ با تأیید انسانی",revenueModel:"اشتراک تیمی"},
 {id:"faq-builder",name:"ساخت FAQ هوشمند",status:"planned",description:"تولید پرسش‌های متداول از اسناد تأییدشده",revenueModel:"اشتراک؛ راه‌اندازی سازمانی"},
 {id:"data-analysis",name:"تحلیل داده با AI",status:"planned",description:"تحلیل داده‌های بارگذاری‌شده با توضیح محدودیت و منبع",revenueModel:"اشتراک؛ مصرف پردازش"},
 {id:"reports-dashboards",name:"گزارش و داشبورد",status:"planned",description:"تبدیل دادهٔ معتبر به گزارش و نمودار",revenueModel:"اشتراک حرفه‌ای"},
 {id:"data-cleaning",name:"پاکسازی و مرتب‌سازی داده",status:"planned",description:"تشخیص دادهٔ تکراری، ناهماهنگی و خطا با پیش‌نمایش قبل از تغییر",revenueModel:"پردازش؛ اشتراک"},
 {id:"no-code-site",name:"ساخت سایت بدون کدنویسی",status:"planned",description:"تولید پیش‌نویس سایت و نشر پس از تأیید کاربر",revenueModel:"اشتراک؛ میزبانی"},
 {id:"landing-page",name:"ساخت لندینگ‌پیج",status:"planned",description:"صفحهٔ فرود با متن، CTA و معیارهای تبدیل",revenueModel:"اشتراک؛ قالب پولی"},
 {id:"no-code-app",name:"ساخت اپلیکیشن No-Code",status:"planned",description:"تولید نمونهٔ اولیهٔ اپ و گردش‌کار؛ انتشار نیازمند آزمون جداگانه",revenueModel:"اشتراک حرفه‌ای"},
 {id:"seo-content",name:"سئو و بهینه‌سازی محتوا",status:"planned",description:"ممیزی محتوا و پیشنهادهای قابل بررسی برای سئو",revenueModel:"اشتراک"},
 {id:"product-copy",name:"توضیحات محصول",status:"planned",description:"متن محصول با ویژگی‌های تأییدشده و بدون ادعاهای ساختگی",revenueModel:"اعتبار متنی؛ بستهٔ فروشگاهی"},
 {id:"digital-products",name:"کتاب الکترونیکی و فایل دیجیتال",status:"planned",description:"تولید و بسته‌بندی فایل دیجیتال با بررسی حقوق محتوا",revenueModel:"کارمزد بازارگاه؛ فروش قالب"},
 {id:"photo-restoration",name:"ترمیم عکس قدیمی",status:"planned",description:"ترمیم تصویر با مشخص‌کردن ماهیت بازسازی‌شده",revenueModel:"اعتبار تصویر"},
 {id:"workflow-automation",name:"طراحی گردش‌کار و اتوماسیون",status:"planned",description:"اتصال مراحل تکراری با ثبت مجوز، گزارش و تأیید انسانی",revenueModel:"اشتراک تیمی؛ راه‌اندازی سازمانی"},
 {id:"reels-script",name:"سناریونویسی ریلز","status":"planned","description":"سناریوی کوتاه با قلاب، روایت، دعوت به اقدام و کنترل ادعاها","revenueModel":"اعتبار متنی؛ اشتراک سازندگان"},
 {id:"ad-copywriting",name:"بازنویسی متن تبلیغاتی","status":"planned","description":"نسخه‌های تبلیغاتی برای کانال‌های مختلف با کنترل ادعا و مخاطب","revenueModel":"اعتبار متنی؛ اشتراک کسب‌وکار"},
 {id:"educational-content",name:"ساخت محتوای آموزشی","status":"planned","description":"طرح درس، اهداف یادگیری، مثال و ارزیابی بر پایه منابع مشخص","revenueModel":"اشتراک آموزشی؛ فروش قالب"},
 {id:"ai-sales-assistant",name:"دستیار فروش هوشمند","status":"planned","description":"پیش‌نویس پیگیری مشتری و پیشنهاد بعدی با تأیید انسان و ثبت سوابق","revenueModel":"اشتراک تیم فروش؛ هزینه راه‌اندازی"},
 {id:"ai-voiceover",name:"گویندگی و نریشن با AI","status":"planned","description":"تبدیل متن مجاز به نریشن با رضایت و مجوز صدای لازم","revenueModel":"دقیقهٔ تولید؛ اشتراک"}
 {id:"life-home-assistant",name:"دستیار خانه و زندگی",status:"planned",description:"زیرماژول‌های تعمیر و نگهداری خانه، مدیریت کارهای روزمره، نظافت، جابه‌جایی، باغبانی، نصب و تعمیرات و برنامه‌ریزی غذای سالم؛ متصل به گردش‌کارها و بازار خدمات",revenueModel:"اشتراک خانوادگی؛ کارمزد معرفی متخصص پس از احراز و رضایت؛ خدمات ممتاز"},
 {id:"smart-shopping-household",name:"خرید هوشمند و مدیریت هزینه",status:"planned",description:"مقایسه قیمت و ارزش خرید، بررسی اصالت و کیفیت، بودجه‌بندی، فهرست خرید، بازگشت کالا، هدیه و بازیافت؛ متصل به بازارگاه و موتور داده",revenueModel:"اشتراک خرید هوشمند؛ کمیسیون افشاشده همکاری در فروش؛ خدمات فروشندگان"},
 {id:"family-health-wellbeing",name:"سلامت و رفاه خانواده",status:"planned",description:"برنامه‌ریزی وعده غذایی، عادت‌های سالم، خواب، ورزش، استرس، مراقبت کودک و حیوان خانگی و یادگیری زبان؛ ابزارهای عمومی رفاهی نه تشخیص یا درمان پزشکی",revenueModel:"اشتراک خانوادگی؛ محتوای آموزشی پولی؛ ارجاع شفاف به خدمات مجاز"},
 {id:"career-learning-productivity",name:"رشد شغلی و بهره‌وری",status:"planned",description:"مسیر شغلی و مهارتی، مدیریت زمان و تمرکز، تولید محتوای حرفه‌ای، وب‌سایت، شبکه اجتماعی، گزارش و تحلیل عملکرد، دریافت وجه و پیگیری نتیجه",revenueModel:"اشتراک حرفه‌ای؛ اعتبار تولید محتوا؛ فروش قالب و خدمات تخصصی"},
 {id:"travel-leisure-planner",name:"برنامه‌ریز سفر و اوقات فراغت",status:"planned",description:"برنامه سفر، اقامت، بودجه، تجربه‌های محلی، حمل‌ونقل، مسیر، مدارک، حیوان خانگی و گروه همسفر؛ رزرو و پرداخت فقط با اتصال تأییدشده",revenueModel:"اشتراک سفر؛ کمیسیون رزرو افشاشده؛ بسته برنامه‌ریزی"},
 {id:"business-model-studio",name:"استودیو طراحی مدل کسب‌وکار",status:"planned",description:"انتخاب و ترکیب ۲۰ مدل درآمدی، تحلیل مشتری و کانال، قیمت‌گذاری، هزینه متغیر، حاشیه سود، سناریو و آزمایش بازار؛ بدون وعده درآمد قطعی",revenueModel:"اشتراک کارآفرینی؛ گزارش امکان‌سنجی پولی؛ خدمات مشاوره"},
 {id:"revenue-commerce-engine",name:"موتور درآمد، تجارت و تسویه",status:"planned",description:"پیکربندی اشتراک، فریمیوم، بازارگاه، تجارت الکترونیک، فروش مستقیم و عمده، تبلیغات، همکاری در فروش، مجوز، فرانچایز، خرده‌فروشی، توزیع، پرداخت مصرفی، اجاره و لیزینگ؛ نیازمند قرارداد، پرداخت و کنترل مالی",revenueModel:"کارمزد تراکنش شفاف؛ اشتراک فروشنده؛ هزینه راه‌اندازی؛ هزینه خدمات و تسویه"},
 {id:"creator-platform-community",name:"موتور پلتفرم، محتوا و جامعه",status:"planned",description:"خدمات حرفه‌ای، محصولات دیجیتال، جامعه مشتریان، پلتفرم چندطرفه، مدل داده‌محور، محتوای اشتراکی و ارجاع؛ همراه مدیریت سازنده، کیفیت و حقوق محتوا",revenueModel:"اشتراک سازنده؛ کارمزد بازارگاه؛ فروش محصول دیجیتال؛ خدمات حرفه‌ای"},
 {id:"on-demand-local-services",name:"بازار خدمات درخواستی و محلی",status:"planned",description:"ثبت درخواست، تطبیق متخصص، دریافت پیشنهاد، زمان‌بندی، امتیازدهی و پیگیری خدمات خانه و زندگی؛ احراز ارائه‌دهنده و رسیدگی به شکایت لازم است",revenueModel:"کارمزد سرنخ یا سفارش با افشای شفاف؛ اشتراک متخصص؛ جایگاه تبلیغاتی مشخص"}

];
const rateBuckets=new Map();
const pool=process.env.DATABASE_URL?new Pool({connectionString:process.env.DATABASE_URL,max:10,idleTimeoutMillis:30000,connectionTimeoutMillis:5000,ssl:process.env.DATABASE_SSL==="true"?{rejectUnauthorized:false}:undefined}):null;
let dbInitPromise=null,dbConnected=false;
async function initDb(){
 if(!pool)throw new Error("DATABASE_URL is not configured");
 if(dbConnected)return true;
 if(!dbInitPromise)dbInitPromise=(async()=>{
  await pool.query(`CREATE TABLE IF NOT EXISTS aria_users(
   id BIGSERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),disabled BOOLEAN NOT NULL DEFAULT FALSE
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS aria_plans(
   id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES aria_users(id) ON DELETE CASCADE,intent TEXT NOT NULL,plan JSONB NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query("CREATE INDEX IF NOT EXISTS aria_plans_user_created_idx ON aria_plans(user_id,created_at DESC)");
  dbConnected=true;return true;
 })().catch(err=>{dbInitPromise=null;dbConnected=false;throw err;});
 return dbInitPromise;
}
function json(res,status,data,extra={}){res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...extra});res.end(JSON.stringify(data));}
function securityHeaders(res){res.setHeader("x-content-type-options","nosniff");res.setHeader("referrer-policy","strict-origin-when-cross-origin");res.setHeader("x-frame-options","DENY");res.setHeader("permissions-policy","camera=(), microphone=(), geolocation=()");res.setHeader("content-security-policy","default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");}
function rateLimited(req){
 const now=Date.now(),key=(req.headers["x-forwarded-for"]||req.socket.remoteAddress||"unknown").toString().split(",")[0].trim();
 let bucket=rateBuckets.get(key);if(!bucket||now-bucket.start>60000)bucket={start:now,count:0};
 bucket.count++;rateBuckets.set(key,bucket);
 if(rateBuckets.size>5000)for(const[k,v]of rateBuckets)if(now-v.start>60000)rateBuckets.delete(k);
 return bucket.count>60;
}
function readJson(req,res){
 return new Promise(resolve=>{let body="",done=false;
  req.on("data",chunk=>{if(done)return;body+=chunk.toString("utf8");if(Buffer.byteLength(body)>12000){done=true;json(res,413,{error:"حجم درخواست بیش از حد مجاز است."});resolve(null);req.destroy();}});
  req.on("end",()=>{if(done)return;try{resolve(JSON.parse(body||"{}"));}catch{json(res,400,{error:"بدنهٔ درخواست باید JSON معتبر باشد."});resolve(null);}});
  req.on("error",()=>{if(!done){done=true;resolve(null);}});
 });
}
function makeLocalPlan(intent){
 const cleaned=intent.trim().slice(0,2000);
 const kind=/محتوا|اینستاگرام|ویدئو|پست|آموزش/.test(cleaned)?"content":/کسب.?و.?کار|درآمد|فروش|محصول|ایده/.test(cleaned)?"business":"general";
 const phases=kind==="content"?[
  {step:1,title:"تعریف مخاطب و هدف",tasks:["مخاطب اصلی را مشخص کن","هدف محتوا و اقدام مورد انتظار را بنویس"],checkpoint:"هدف و مخاطب روشن باشد"},
  {step:2,title:"طراحی محتوا",tasks:["موضوع و پیام اصلی را تعیین کن","قالب متن، تصویر یا ویدئو را انتخاب کن"],checkpoint:"پیش‌نویس محتوا آماده باشد"},
  {step:3,title:"بازبینی و انتشار",tasks:["دقت، حقوق محتوا و حریم خصوصی را بررسی کن","زمان انتشار و معیار سنجش را ثبت کن"],checkpoint:"تأیید نهایی پیش از انتشار"}
 ]:kind==="business"?[
  {step:1,title:"تعریف مسئله و مشتری",tasks:["نیاز مشخص مشتری را تعریف کن","گروه مشتری و جایگزین‌های موجود را بررسی کن"],checkpoint:"مسئله و مشتری هدف قابل سنجش باشد"},
  {step:2,title:"آزمون کم‌هزینه",tasks:["یک نمونهٔ ساده از راه‌حل بساز","با چند مشتری بالقوه بازخورد بگیر"],checkpoint:"شواهد اولیهٔ تقاضا ثبت شود"},
  {step:3,title:"مدل درآمد و اجرا",tasks:["هزینه، قیمت و منبع درآمد را برآورد کن","مسئول، زمان‌بندی و شاخص موفقیت تعیین کن"],checkpoint:"فرضیه‌های مالی و ریسک‌ها مستند باشند"}
 ]:[
  {step:1,title:"شفاف‌سازی نتیجه",tasks:["نتیجهٔ نهایی را در یک جمله تعریف کن","محدودیت‌ها و معیار موفقیت را بنویس"],checkpoint:"نتیجه قابل بررسی باشد"},
  {step:2,title:"تقسیم به گام‌ها",tasks:["کار را به سه تا پنج اقدام کوچک تقسیم کن","برای هر اقدام مسئول و موعد تعیین کن"],checkpoint:"هر اقدام خروجی مشخص داشته باشد"},
  {step:3,title:"اجرا و ارزیابی",tasks:["اولین گام کم‌ریسک را اجرا کن","نتیجه را با معیار موفقیت مقایسه کن"],checkpoint:"تصمیم بعدی بر اساس نتیجه گرفته شود"}
 ];
 return{planId:"local-"+Date.now().toString(36),intent:cleaned,category:kind,createdAt:new Date().toISOString(),phases,source:"rule-based",disclaimer:"این برنامه با قواعد محلی ساخته شده و خروجی مدل هوش مصنوعی نیست. پیش از اقدامات حساس، انسانی آن را بررسی کنید."};
}
async function makePlan(intent){
 const apiKey=process.env.OPENAI_API_KEY;if(!apiKey)return makeLocalPlan(intent);
 const base=(process.env.OPENAI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,""),model=process.env.OPENAI_MODEL||"gpt-4.1-mini";
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(base+"/chat/completions",{method:"POST",signal:controller.signal,headers:{"authorization":"Bearer "+apiKey,"content-type":"application/json"},body:JSON.stringify({model,temperature:0.2,response_format:{type:"json_object"},messages:[
   {role:"system",content:"You are ARIA, a careful planning assistant. Produce a practical plan in Persian. Return only valid JSON with keys category, phases, disclaimer. category must be one of general, business, content. phases must contain exactly three objects, each with title, tasks (array of 2-4 short strings), checkpoint. Do not claim actions were executed. For medical, legal, financial or safety-sensitive requests, recommend qualified review. Never request secrets."},
   {role:"user",content:intent.slice(0,2000)}
  ]})});
  if(!response.ok)throw new Error("AI provider HTTP "+response.status);
  const payload=await response.json(),raw=payload.choices?.[0]?.message?.content;if(typeof raw!=="string")throw new Error("AI provider returned no content");
  const parsed=JSON.parse(raw);if(!["general","business","content"].includes(parsed.category)||!Array.isArray(parsed.phases)||parsed.phases.length!==3)throw new Error("AI schema invalid");
  const phases=parsed.phases.map((p,i)=>{if(typeof p.title!=="string"||!Array.isArray(p.tasks)||typeof p.checkpoint!=="string")throw new Error("AI phase invalid");const tasks=p.tasks.filter(t=>typeof t==="string").slice(0,4).map(t=>t.slice(0,300));if(!tasks.length)throw new Error("AI tasks invalid");return{step:i+1,title:p.title.slice(0,180),tasks,checkpoint:p.checkpoint.slice(0,300)};});
  return{planId:"ai-"+Date.now().toString(36),intent:intent.slice(0,2000),category:parsed.category,createdAt:new Date().toISOString(),phases,source:"ai",model,disclaimer:typeof parsed.disclaimer==="string"?parsed.disclaimer.slice(0,500):"این برنامه پیشنهاد اولیه است؛ پیش از اقدامات حساس آن را بررسی کنید."};
 }catch(err){console.error("ARIA AI provider error:",err.name==="AbortError"?"timeout":err.message);return{...makeLocalPlan(intent),source:"rule-based-fallback",disclaimer:"سرویس هوش مصنوعی در دسترس نبود؛ این برنامه با قواعد محلی ساخته شد. خروجی هوش مصنوعی نیست."};}
 finally{clearTimeout(timeout);}
}
function authUser(req){
 const header=req.headers.authorization||"";if(!header.startsWith("Bearer "))return null;
 const secret=process.env.ARIA_JWT_SECRET;if(!secret)return null;
 try{return jwt.verify(header.slice(7),secret,{issuer:"aria-web",audience:"aria-user"});}catch{return null;}
}
function tokenFor(user){const secret=process.env.ARIA_JWT_SECRET;if(!secret)throw new Error("Authentication secret unavailable");return jwt.sign({sub:String(user.id),email:user.email},secret,{expiresIn:"2h",issuer:"aria-web",audience:"aria-user"});}
async function requireDb(res){try{await initDb();return true;}catch(err){console.error("ARIA database unavailable:",err.message);json(res,503,{error:"پایگاه داده هنوز آماده نیست. کمی بعد دوباره تلاش کنید."});return false;}}
async function handle(req,res,url){
 if(url.pathname==="/health"||url.pathname==="/api/health"){
  if(req.method!=="GET")return json(res,405,{error:"روش درخواست پشتیبانی نمی‌شود."});
  return json(res,200,{ok:true,service:"aria-web",version:"0.4.0",mode:process.env.OPENAI_API_KEY?"ai-enabled-prototype":"rule-based-prototype",aiConfigured:Boolean(process.env.OPENAI_API_KEY),databaseConfigured:Boolean(pool),databaseConnected:dbConnected,authenticationConfigured:Boolean(process.env.ARIA_JWT_SECRET),productionIntegrations:false});
 }
 if(url.pathname.startsWith("/api/")&&rateLimited(req))return json(res,429,{error:"تعداد درخواست‌ها زیاد است. یک دقیقه دیگر دوباره تلاش کنید."},{"retry-after":"60"});
 if(url.pathname==="/api/modules"&&req.method==="GET")return json(res,200,{modules});
 if(url.pathname==="/api/auth/register"&&req.method==="POST"){
  const data=await readJson(req,res);if(data===null)return;
  const email=typeof data.email==="string"?data.email.trim().toLowerCase():"",password=typeof data.password==="string"?data.password:"";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return json(res,400,{error:"ایمیل معتبر وارد کنید."});
  if(password.length<12||password.length>128)return json(res,400,{error:"رمز عبور باید بین ۱۲ تا ۱۲۸ نویسه باشد."});
  if(!process.env.ARIA_JWT_SECRET)return json(res,503,{error:"تنظیم امن احراز هویت کامل نشده است."});
  if(!await requireDb(res))return;
  try{const hash=await bcrypt.hash(password,12);const q=await pool.query("INSERT INTO aria_users(email,password_hash) VALUES($1,$2) RETURNING id,email,created_at",[email,hash]);const user=q.rows[0];return json(res,201,{user:{id:String(user.id),email:user.email,createdAt:user.created_at},token:tokenFor(user)});}
  catch(err){if(err.code==="23505")return json(res,409,{error:"برای این ایمیل قبلاً حساب ساخته شده است."});console.error("ARIA register failed:",err.message);return json(res,500,{error:"ساخت حساب انجام نشد."});}
 }
 if(url.pathname==="/api/auth/login"&&req.method==="POST"){
  const data=await readJson(req,res);if(data===null)return;
  const email=typeof data.email==="string"?data.email.trim().toLowerCase():"",password=typeof data.password==="string"?data.password:"";
  if(!email||!password)return json(res,400,{error:"ایمیل و رمز عبور الزامی است."});
  if(!process.env.ARIA_JWT_SECRET)return json(res,503,{error:"تنظیم امن احراز هویت کامل نشده است."});
  if(!await requireDb(res))return;
  try{const q=await pool.query("SELECT id,email,password_hash,disabled FROM aria_users WHERE email=$1",[email]);const user=q.rows[0];if(!user||user.disabled||!(await bcrypt.compare(password,user.password_hash)))return json(res,401,{error:"ایمیل یا رمز عبور صحیح نیست."});return json(res,200,{user:{id:String(user.id),email:user.email},token:tokenFor(user)});}
  catch(err){console.error("ARIA login failed:",err.message);return json(res,500,{error:"ورود انجام نشد."});}
 }
 if(url.pathname==="/api/auth/me"&&req.method==="GET"){
  const user=authUser(req);if(!user)return json(res,401,{error:"برای ادامه وارد حساب شوید."});
  if(!await requireDb(res))return;
  const q=await pool.query("SELECT id,email,created_at FROM aria_users WHERE id=$1 AND disabled=FALSE",[user.sub]);
  if(!q.rowCount)return json(res,401,{error:"حساب معتبر نیست."});
  return json(res,200,{user:{id:String(q.rows[0].id),email:q.rows[0].email,createdAt:q.rows[0].created_at}});
 }
 if(url.pathname==="/api/plans"&&req.method==="GET"){
  const user=authUser(req);if(!user)return json(res,401,{error:"برای مشاهدهٔ برنامه‌های ذخیره‌شده وارد حساب شوید."});
  if(!await requireDb(res))return;
  const q=await pool.query("SELECT id,plan,created_at FROM aria_plans WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",[user.sub]);
  return json(res,200,{plans:q.rows.map(r=>({id:String(r.id),...r.plan,savedAt:r.created_at}))});
 }
 if((url.pathname==="/api/plan"||url.pathname==="/api/intent")&&req.method==="POST"){
  const data=await readJson(req,res);if(data===null)return;
  const intent=typeof data.intent==="string"?data.intent.trim():"";
  if(!intent)return json(res,400,{error:"لطفاً درخواست خود را بنویسید."});
  if(intent.length>2000)return json(res,400,{error:"درخواست نباید بیشتر از ۲۰۰۰ نویسه باشد."});
  if(url.pathname==="/api/intent")return json(res,200,{accepted:true,intent,status:"received",message:"درخواست دریافت شد. برای ساخت برنامه از مسیر /api/plan استفاده کنید."});
  const plan=await makePlan(intent),user=authUser(req);
  if(req.headers.authorization&&!user)return json(res,401,{error:"نشست معتبر نیست؛ دوباره وارد شوید."});
  if(user){
   if(!await requireDb(res))return;
   try{const q=await pool.query("INSERT INTO aria_plans(user_id,intent,plan) VALUES($1,$2,$3::jsonb) RETURNING id,created_at",[user.sub,intent,JSON.stringify(plan)]);plan.saved=true;plan.savedId=String(q.rows[0].id);}
   catch(err){console.error("ARIA plan save failed:",err.message);return json(res,500,{error:"برنامه ساخته شد اما ذخیره‌سازی آن ناموفق بود."});}
  }else plan.saved=false;
  return json(res,200,{ok:true,plan});
 }
 if(url.pathname.startsWith("/api/"))return json(res,404,{error:"مسیر API پیدا نشد."});
 if(req.method!=="GET"&&req.method!=="HEAD")return json(res,405,{error:"روش درخواست پشتیبانی نمی‌شود."});
 let requested;try{requested=decodeURIComponent(url.pathname==="/"?"/index.html":url.pathname);}catch{return json(res,400,{error:"مسیر نامعتبر است."});}
 const file=path.resolve(root,"."+requested);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return json(res,404,{error:"صفحه پیدا نشد."});
 res.writeHead(200,{"content-type":types[path.extname(file)]||"application/octet-stream","cache-control":path.extname(file)===".html"?"no-cache":"public, max-age=300"});
 if(req.method==="HEAD")return res.end();fs.createReadStream(file).pipe(res);
}
const server=http.createServer((req,res)=>{securityHeaders(res);let url;try{url=new URL(req.url||"/","http://localhost");}catch{return json(res,400,{error:"نشانی نامعتبر است."});}handle(req,res,url).catch(err=>{console.error("ARIA request failed:",err.message);if(!res.headersSent)json(res,500,{error:"خطای داخلی رخ داد."});else res.destroy();});});
server.listen(port,"0.0.0.0",()=>{console.log("ARIA web listening on "+port);if(pool)initDb().catch(err=>console.error("ARIA database init pending:",err.message));});
process.on("SIGTERM",async()=>{server.close();if(pool)await pool.end().catch(()=>{});process.exit(0);});
