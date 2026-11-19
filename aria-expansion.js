"use strict";
(async function(){
 const summaryEl=document.getElementById("expansion-summary");
 const domainsEl=document.getElementById("expansion-domains");
 const problemsEl=document.getElementById("expansion-problems");
 const newIdeasEl=document.getElementById("expansion-new-ideas");
 const candidatesEl=document.getElementById("expansion-candidates");
 const revenueEl=document.getElementById("expansion-revenue");
 const enginesEl=document.getElementById("expansion-engines");
 const status=(el,msg)=>{if(el)el.textContent=msg;};
 const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
 const savePlanButton=(container,moduleId,title,plan)=>{const save=node("button","btn btn-quiet","ثبت برنامه در کارهای من");save.type="button";save.addEventListener("click",async()=>{if(!window.ariaToken){save.textContent="برای ذخیره ابتدا وارد حساب شوید";return;}save.disabled=true;save.textContent="در حال ثبت…";try{const headers={"content-type":"application/json",authorization:"Bearer "+window.ariaToken};const response=await fetch("/api/aria-expansion/work-items",{method:"POST",headers,body:JSON.stringify({moduleId,title,details:JSON.stringify(plan)})});const data=await response.json();if(!response.ok)throw new Error(data.error||"ثبت برنامه انجام نشد");save.textContent="برنامه ثبت شد · "+data.item.id;}catch(error){save.textContent=error.message;}finally{save.disabled=false;}});container.append(save);};
 try{
  const [s,m,c,r,e]=await Promise.all([
   fetch("/api/aria-expansion/summary").then(x=>x.json()),
   fetch("/api/aria-expansion/modules").then(x=>x.json()),
   fetch("/api/aria-expansion/candidates").then(x=>x.json()),
   fetch("/api/aria-expansion/revenue-models").then(x=>x.json()),
   fetch("/api/aria-expansion/engines").then(x=>x.json())
  ]);
  status(summaryEl,"۶۳۹ ماژول canonical حفظ‌شده · ۷۲ ورودی قابل مشاهده در ARIA · ۱۱۱ رکورد تاریخی در lineage · ۳۶ ماژول منتقل‌شده · ۲ سرویس مشترک باقی‌مانده · "+e.total+" موتور طراحی‌شده در ARIA · درآمد زنده فعال نیست.");
  for(const d of m.parents){
   const card=node("article","glass expansion-domain");
   card.append(node("h3","",d.name),node("p","","۱۰ ماژول در این حوزه"));
   domainsEl.append(card);
  }
  for(const d of (m.mergedDomainPacks||[])){
   const card=node("article","glass expansion-domain");
   card.append(node("div","expansion-kicker","ماژول اپ ادغام‌شده · "+d.moduleId),node("h3","",d.name),node("p","","ماژول‌های ایده مرتبط: "+d.moduleIds.length+" · زیرماژول‌های دامنه: "+d.submodules.length),node("p","expansion-muted",d.submodules.join("، ")));
   const domainPlan=node("button","btn btn-quiet","ساخت برنامه این ماژول");domainPlan.type="button";domainPlan.addEventListener("click",async()=>{domainPlan.disabled=true;try{const response=await fetch("/api/aria-expansion/modules/"+d.moduleId+"/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:d.name})});const result=await response.json();if(!response.ok)throw new Error(result.error||"ساخت برنامه انجام نشد");const out=node("div","expansion-plan");for(const step of result.plan.steps)out.append(node("p","","گام "+step.step+": "+step.title+" — "+step.checkpoint));out.append(node("small","expansion-muted",result.plan.disclaimer));card.append(out);savePlanButton(out,d.moduleId,d.name,result.plan);}catch(error){status(summaryEl,error.message);}finally{domainPlan.disabled=false;}});card.append(domainPlan);
   domainsEl.append(card);
  }
  for(const item of m.problems){
   const card=node("article","glass expansion-card");
   card.append(node("div","expansion-kicker","ماژول "+String(item.sourceProblemNumber).padStart(3,"0")+" · "+(item.moduleId||item.id)+" · "+item.parentModuleName));
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
     const response=await fetch("/api/aria-expansion/modules/"+(item.moduleId||item.id)+"/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:item.capability})});
     const data=await response.json();if(!response.ok)throw new Error(data.error||"ساخت برنامه ناموفق بود");
     let output=card.querySelector(".expansion-plan");if(!output){output=node("div","expansion-plan");card.append(output);}output.replaceChildren(node("strong","","برنامه محلی آماده شد"));
     for(const step of data.plan.steps){const row=node("p","","گام "+step.step+": "+step.title+" — "+step.checkpoint);output.append(row);}
     output.append(node("small","expansion-muted",data.plan.disclaimer));
     savePlanButton(output,item.moduleId||item.id,item.capability,data.plan);
    }catch(error){status(summaryEl,error.message);}finally{button.disabled=false;button.textContent="ساخت برنامه اقدام";}
   });
   card.append(button);problemsEl.append(card);
  }
  for(const item of (m.modules||[]).filter(x=>x.moduleType==="NEW_IDEA_PRODUCT_MODULE")){
   const card=node("article","glass expansion-card");
   card.append(node("div","expansion-kicker",item.moduleId+" · "+item.domainPackId),node("h3","",item.name),node("p","",item.purpose),node("p","expansion-muted","زیرقابلیت‌ها: "+item.submodules.join("، ")),node("p","expansion-muted","مدل درآمدی پیشنهادی: "+item.monetizationModel),node("p","expansion-alias","وضعیت: طراحی جدید؛ نگاشت به ۶۳۹ قرارداد canonical در انتظار ممیزی هم‌پوشانی."));
   const planButton=node("button","btn btn-quiet","ساخت برنامه این ماژول");planButton.type="button";
   planButton.addEventListener("click",async()=>{planButton.disabled=true;try{const response=await fetch("/api/aria-expansion/modules/"+item.moduleId+"/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:item.name})});const result=await response.json();if(!response.ok)throw new Error(result.error||"ساخت برنامه انجام نشد");const out=node("div","expansion-plan");for(const step of result.plan.steps)out.append(node("p","","گام "+step.step+": "+step.title+" — "+step.checkpoint));out.append(node("small","expansion-muted",result.plan.disclaimer));card.append(out);}catch(error){status(summaryEl,error.message);}finally{planButton.disabled=false;}});
   card.append(planButton);newIdeasEl.append(card);
  }
  for(let i=0;i<c.candidates.length;i++){
   const item=c.candidates[i], moduleId="ARIA-CONTROL-MODULE-"+String(i+1).padStart(3,"0");
   const card=node("article","glass expansion-card");
   card.append(node("div","expansion-kicker",moduleId+" · "+item.legacyKey),node("h3","",item.name),node("p","",item.executionBoundary),node("p","expansion-muted","موتور: "+item.engine.name),node("p","expansion-alias","وضعیت: طراحی ثبت‌شده؛ فعال‌سازی تولیدی تأیید نشده است."));
   const planButton=node("button","btn btn-quiet","ساخت برنامه ماژول");planButton.type="button";
   planButton.addEventListener("click",async()=>{planButton.disabled=true;try{const response=await fetch("/api/aria-expansion/modules/"+moduleId+"/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:item.name})});const result=await response.json();if(!response.ok)throw new Error(result.error||"ساخت برنامه انجام نشد");const out=node("div","expansion-plan");for(const step of result.plan.steps)out.append(node("p","","گام "+step.step+": "+step.title+" — "+step.checkpoint));out.append(node("small","expansion-muted",result.plan.disclaimer));card.append(out);}catch(error){status(summaryEl,error.message);}finally{planButton.disabled=false;}});
   card.append(planButton);candidatesEl.append(card);
  }
  for(const engine of e.engines){const card=node("article","glass expansion-card");card.append(node("div","expansion-kicker",engine.engineType==="PROBLEM_DOMAIN_ENGINE"?"موتور حوزه‌ای":"موتور کنترلی تاریخی"),node("h3","",engine.name),node("p","expansion-muted","شناسه: "+engine.id),node("p","","ورودی‌ها: "+engine.contract.input.join("، ")),node("p","","عملیات: "+engine.contract.operations.join("، ")),node("p","expansion-muted","حالت اجرا: "+engine.contract.runtimeMode+" · اتصال بیرونی: "+engine.contract.externalAdapterState));enginesEl.append(card);}
  const details=node("details","glass expansion-revenue");
  details.append(node("summary","","۲۰ مدل درآمدی طراحی‌شده — هیچ پرداختی فعال نیست"));
  const list=node("ol","");
  for(const item of r.models){list.append(node("li","",item.name+" — "+item.ariaApplication));}
  details.append(list);revenueEl.append(details);
  const calculator=node("div","glass expansion-revenue");
  calculator.append(node("h3","","شبیه‌ساز ۲۰ مدل درآمدی"));
  calculator.append(node("p","expansion-muted","فرض‌های خود را وارد کنید؛ خروجی تخمینی است و پرداخت یا درآمد واقعی ایجاد نمی‌کند."));
  const modelSelect=node("select","search");modelSelect.setAttribute("aria-label","انتخاب مدل درآمدی");
  for(const model of r.models){const option=node("option","",model.name);option.value=model.id;modelSelect.append(option);}
  const assumptions=node("textarea","search");assumptions.rows=5;assumptions.setAttribute("aria-label","فرض‌های عددی به قالب JSON");
  const resultBox=node("div","expansion-plan","نتیجه شبیه‌سازی اینجا نمایش داده می‌شود.");
  const exampleFor=model=>{const values={};for(const key of model.calculation.requiredInputs){if(key.toLowerCase().includes("rate"))values[key]=0.1;else if(key==="cpm")values[key]=8;else if(key==="months")values[key]=1;else if(key.toLowerCase().includes("price")||key.toLowerCase().includes("fee")||key.toLowerCase().includes("commission"))values[key]=10;else values[key]=100;}values.fixedCosts=100;values.variableCosts=50;return values;};
  const setExample=()=>{const model=r.models.find(x=>x.id===modelSelect.value);assumptions.value=JSON.stringify(exampleFor(model),null,2);};
  modelSelect.addEventListener("change",setExample);setExample();
  const simulate=node("button","btn btn-main","محاسبه سناریو");simulate.type="button";
  simulate.addEventListener("click",async()=>{simulate.disabled=true;simulate.textContent="در حال محاسبه…";try{const input=JSON.parse(assumptions.value);const response=await fetch("/api/aria-expansion/revenue-models/simulate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({modelId:modelSelect.value,assumptions:input})});const data=await response.json();if(!response.ok)throw new Error(data.error||"محاسبه ناموفق بود");const x=data.simulation;resultBox.replaceChildren(node("strong","","برآورد درآمد ناخالص: "+x.grossRevenueEstimate),node("p","","هزینه ثابت: "+x.fixedCosts+" · هزینه متغیر: "+x.variableCosts),node("p","","مشارکت خالص تخمینی: "+x.netContributionEstimate),node("small","expansion-muted",x.disclaimer));}catch(error){resultBox.textContent=error.message==="Unexpected end of JSON input"?"JSON فرض‌ها معتبر نیست.":error.message;}finally{simulate.disabled=false;simulate.textContent="محاسبه سناریو";}});
  calculator.append(modelSelect,assumptions,simulate,resultBox);revenueEl.append(calculator);
 }catch(error){status(summaryEl,"دریافت کاتالوگ توسعه‌ای ناموفق بود؛ وضعیت سرویس را بررسی کنید.");}
})();
