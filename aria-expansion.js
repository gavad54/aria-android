"use strict";
(async function(){
 const summaryEl=document.getElementById("expansion-summary");
 const domainsEl=document.getElementById("expansion-domains");
 const problemsEl=document.getElementById("expansion-problems");
 const candidatesEl=document.getElementById("expansion-candidates");
 const revenueEl=document.getElementById("expansion-revenue");
 const status=(el,msg)=>{if(el)el.textContent=msg;};
 const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
 try{
  const [s,m,c,r]=await Promise.all([
   fetch("/api/aria-expansion/summary").then(x=>x.json()),
   fetch("/api/aria-expansion/modules").then(x=>x.json()),
   fetch("/api/aria-expansion/candidates").then(x=>x.json()),
   fetch("/api/aria-expansion/revenue-models").then(x=>x.json())
  ]);
  status(summaryEl,"۶۳۹ ماژول مرجع حفظ‌شده · "+s.problemRecords+" مسئله تاریخی · "+s.historicalCandidates+" نامزد · "+s.revenueModels+" مدل درآمدی · درآمد زنده فعال نیست.");
  for(const d of m.parents){
   const card=node("article","glass expansion-domain");
   card.append(node("h3","",d.name),node("p","","۱۰ مسئله در این حوزه"));
   domainsEl.append(card);
  }
  for(const item of m.problems){
   const card=node("article","glass expansion-card");
   card.append(node("div","expansion-kicker","مسئله "+item.sourceProblemNumber+" · "+item.parentModuleName));
   card.append(node("h3","",item.capability));
   card.append(node("p","",item.problem));
   card.append(node("p","expansion-muted","خروجی: "+item.deliverable));
   card.append(node("p","expansion-muted","موتور: "+item.engine.name));
   if(item.aliasOf)card.append(node("p","expansion-alias","این مورد به قابلیت شماره ۲۹ متصل است و موتور جداگانه ندارد."));
   const button=node("button","btn btn-quiet","ساخت برنامه اقدام");
   button.type="button";
   button.addEventListener("click",async()=>{
    button.disabled=true;button.textContent="در حال ساخت…";
    try{
     const response=await fetch("/api/aria-expansion/modules/"+item.id+"/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:item.capability})});
     const data=await response.json();if(!response.ok)throw new Error(data.error||"ساخت برنامه ناموفق بود");
     let output=card.querySelector(".expansion-plan");if(!output){output=node("div","expansion-plan");card.append(output);}output.replaceChildren(node("strong","","برنامه محلی آماده شد"));
     for(const step of data.plan.steps){const row=node("p","","گام "+step.step+": "+step.title+" — "+step.checkpoint);output.append(row);}
     output.append(node("small","expansion-muted",data.plan.disclaimer));
    }catch(error){status(summaryEl,error.message);}finally{button.disabled=false;button.textContent="ساخت برنامه اقدام";}
   });
   card.append(button);problemsEl.append(card);
  }
  for(const item of c.candidates){
   const card=node("article","glass expansion-card");
   card.append(node("div","expansion-kicker",item.legacyKey),node("h3","",item.name),node("p","",item.executionBoundary),node("p","expansion-muted","موتور: "+item.engine.name),node("p","expansion-alias","وضعیت: طراحی ثبت‌شده؛ فعال‌سازی تولیدی تأیید نشده است."));
   candidatesEl.append(card);
  }
  const details=node("details","glass expansion-revenue");
  details.append(node("summary","","۲۰ مدل درآمدی طراحی‌شده — هیچ پرداختی فعال نیست"));
  const list=node("ol","");
  for(const item of r.models){list.append(node("li","",item.name+" — "+item.ariaApplication));}
  details.append(list);revenueEl.append(details);
 }catch(error){status(summaryEl,"دریافت کاتالوگ توسعه‌ای ناموفق بود؛ وضعیت سرویس را بررسی کنید.");}
})();
