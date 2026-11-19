"use strict";
(async function(){
 const summaryEl=document.getElementById("expansion-summary");
 const maturityEl=document.getElementById("expansion-maturity");
 const domainsEl=document.getElementById("expansion-domains");
 const problemsEl=document.getElementById("expansion-problems");
 const newIdeasEl=document.getElementById("expansion-new-ideas");
 const candidatesEl=document.getElementById("expansion-candidates");
 const controlsEl=document.getElementById("expansion-control-centers");
 const revenueEl=document.getElementById("expansion-revenue");
 const enginesEl=document.getElementById("expansion-engines");
 const status=(el,msg)=>{if(el)el.textContent=msg;};
 const node=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
 const savePlanButton=(container,moduleId,title,plan)=>{const save=node("button","btn btn-quiet","ثبت برنامه در کارهای من");save.type="button";save.addEventListener("click",async()=>{if(!window.ariaToken){save.textContent="برای ذخیره ابتدا وارد حساب شوید";return;}save.disabled=true;save.textContent="در حال ثبت…";try{const headers={"content-type":"application/json",authorization:"Bearer "+window.ariaToken};const response=await fetch("/api/aria-expansion/work-items",{method:"POST",headers,body:JSON.stringify({moduleId,title,details:JSON.stringify(plan)})});const data=await response.json();if(!response.ok)throw new Error(data.error||"ثبت برنامه انجام نشد");save.textContent="برنامه ثبت شد · "+data.item.id;}catch(error){save.textContent=error.message;}finally{save.disabled=false;}});container.append(save);};
 try{
  const [s,m,c,r,e,matrix,canonicalCatalog,commercialCatalog]=await Promise.all([
   fetch("/api/aria-expansion/summary").then(x=>x.json()),
   fetch("/api/aria-expansion/modules").then(x=>x.json()),
   fetch("/api/aria-expansion/candidates").then(x=>x.json()),
   fetch("/api/aria-expansion/revenue-models").then(x=>x.json()),
   fetch("/api/aria-expansion/engines").then(x=>x.json()),
   fetch("/api/aria-expansion/capability-matrix").then(x=>x.json()),
   fetch("/api/aria-expansion/canonical-modules").then(x=>x.json()),
   fetch("/api/aria-expansion/commercial-modules").then(x=>x.json())
  ]);
  status(summaryEl,"موجودی ساختاری ۸۹۳ واحدی ARIA: ۶۳۹ ماژول پایه + ۱۱۱ رکورد ماژولی تاریخی + ۷۲ ماژول کاتالوگ تجاری + ۷۱ زیرماژول موتور · ۳۶ رکورد تاریخی منتقل‌شده به محصولات خواهر · ۸۵۴ مسیر ثبت گردش‌کار محلی · درآمد زنده فعال نیست.");
  if(maturityEl){
   const summary=node("div","expansion-summary");
   summary.append(node("strong","","ماتریس بلوغ واقعی قابلیت‌های ARIA"));
   summary.append(node("p","expansion-muted","موجودی کل ماژول/زیرماژول: "+matrix.moduleInventory.totalModuleAndSubmoduleRecords+" · پایه canonical: "+matrix.moduleInventory.canonicalModules+" · lineage تاریخی: "+matrix.moduleInventory.preservedHistoricalOverlayModules+" · کاتالوگ تجاری: "+matrix.moduleInventory.commercialCatalogModules+" · زیرماژول موتور: "+matrix.moduleInventory.engineSubmodules));
   summary.append(node("p","expansion-muted","کاتالوگ عمومی فعال برای نمایش: "+matrix.publicCatalog.total+" · موتورهای متصل به رکوردهای دامنه‌ای: "+matrix.engines.total+"؛ زیرماژول‌ها بخشی از ساختار والدند و ۸۹۳ قرارداد اجرایی مستقل یا Production محسوب نمی‌شوند."));
   summary.append(node("p","expansion-muted","برنامه‌ریزی محلی: "+matrix.publicCatalog.localPlanAvailable+" · تأیید اجرایی مستقل: "+matrix.publicCatalog.runtimeVerified+" · تأیید Production: "+matrix.publicCatalog.productionVerified+" · فاقد تأیید Production: "+matrix.publicCatalog.notProductionVerified));
   summary.append(node("p","expansion-alias","وضعیت اتصال بیرونی: غیرفعال · درآمد زنده: غیرفعال. ساخت برنامه محلی به معنی انجام عملیات بیرونی نیست."));
   const details=node("details","expansion-maturity-details");
   details.append(node("summary","","نمایش جزئیات ۷۲ ورودی و وضعیت هر ماژول"));
   const controls=node("div","expansion-maturity-controls");
   const search=node("input","search");search.type="search";search.placeholder="جست‌وجوی نام یا شناسه ماژول";search.setAttribute("aria-label","جست‌وجوی ماژول‌ها");
   const filter=node("select","search");filter.setAttribute("aria-label","فیلتر نوع ماژول");
   [["","همه انواع"],["HISTORICAL_PROBLEM_MODULE","۳۹ مسئله تاریخی"],["NEW_IDEA_PRODUCT_MODULE","۲۵ ایده"],["CONTROL_AND_GOVERNANCE_MODULE","۴ مرکز کنترل"],["MERGED_LEGACY_APP_DOMAIN_MODULE","۴ دامنه داخلی"]].forEach(([value,label])=>{const option=node("option","",label);option.value=value;filter.append(option);});
   controls.append(search,filter);
   const scroll=node("div","expansion-maturity-scroll");scroll.style.overflowX="auto";
   const table=node("table","expansion-maturity-table");table.style.width="100%";table.style.borderCollapse="collapse";
   const thead=node("thead",""),head=node("tr","");
   ["شناسه","ماژول","نوع","دامنه مالک","نگاشت canonical","وضعیت پیاده‌سازی","وضعیت تولید"].forEach(label=>{const th=node("th","",label);th.scope="col";th.style.textAlign="right";th.style.padding="8px";head.append(th);});
   thead.append(head);const tbody=node("tbody","");table.append(thead,tbody);scroll.append(table);
   const typeLabels={HISTORICAL_PROBLEM_MODULE:"مسئله تاریخی",NEW_IDEA_PRODUCT_MODULE:"ایده جدید",CONTROL_AND_GOVERNANCE_MODULE:"کنترل و حاکمیت",MERGED_LEGACY_APP_DOMAIN_MODULE:"دامنه داخلی"};
   const renderRows=()=>{tbody.replaceChildren();const q=search.value.trim().toLocaleLowerCase();const rows=matrix.modules.filter(x=>(!filter.value||x.moduleType===filter.value)&&(!q||(x.moduleId+" "+x.name).toLocaleLowerCase().includes(q)));for(const item of rows){const tr=node("tr","");[item.moduleId,item.name,typeLabels[item.moduleType]||item.moduleType,item.ownerDomain,item.canonicalMappingStatus,item.implementationStatus,item.productionStatus].forEach(value=>{const td=node("td","",String(value??"—"));td.style.padding="8px";td.style.borderTop="1px solid var(--line, rgba(255,255,255,.12))";td.style.verticalAlign="top";tr.append(td);});tbody.append(tr);}if(!rows.length){const tr=node("tr",""),td=node("td","","موردی مطابق جست‌وجو پیدا نشد.");td.colSpan=7;tr.append(td);tbody.append(tr);}};
   search.addEventListener("input",renderRows);filter.addEventListener("change",renderRows);renderRows();
   details.append(controls,scroll);summary.append(details);
   const executionDetails=node("details","expansion-maturity-details");
   executionDetails.append(node("summary","","اجرای محلی و ثبت کار برای ماژول‌ها و موتورهای ARIA"));
   executionDetails.append(node("p","expansion-muted","این بخش گردش‌کار محلی را در حساب کاربر ثبت می‌کند؛ تولید تصویر/ویدئو، انتشار، پرداخت یا اتصال بیرونی بدون ارائه‌دهنده و تأیید جداگانه انجام نمی‌شود."));
   const executionGoal=node("input","search");executionGoal.type="text";executionGoal.placeholder="هدف اجرای ماژول را وارد کنید (حداقل ۴ نویسه)";executionGoal.setAttribute("aria-label","هدف اجرای ماژول");
   const executionSearch=node("input","search");executionSearch.type="search";executionSearch.placeholder="جست‌وجوی ۸۵۴ مسیر اجرایی بر اساس نام یا شناسه";
   const executionFilter=node("select","search");executionFilter.setAttribute("aria-label","نوع مسیر اجرایی");
   [["","همه مسیرها"],["canonical","۶۳۹ ماژول پایه"],["overlay","۷۲ ماژول ARIA"],["commercial","۷۲ ماژول تجاری"],["engine","۷۱ زیرماژول موتور"]].forEach(([value,label])=>{const option=node("option","",label);option.value=value;executionFilter.append(option);});
   const executionStatus=node("p","expansion-muted","برای ثبت کار باید وارد حساب ARIA شده باشید.");
   const executionTable=node("table","expansion-maturity-table");executionTable.style.width="100%";executionTable.style.borderCollapse="collapse";
   const executionHead=node("thead",""),executionHeadRow=node("tr","");
   ["نوع","شناسه","نام","وضعیت","اقدام"].forEach(label=>{const th=node("th","",label);th.style.textAlign="right";th.style.padding="8px";executionHeadRow.append(th);});
   executionHead.append(executionHeadRow);const executionBody=node("tbody","");executionTable.append(executionHead,executionBody);
   const executionScroll=node("div","expansion-maturity-scroll");executionScroll.style.overflowX="auto";executionScroll.append(executionTable);
   const entries=[
    ...canonicalCatalog.modules.map(x=>({type:"canonical",id:String(x.canonicalId),name:x.name,status:x.implementationState})),
    ...m.modules.map(x=>({type:"overlay",id:x.moduleId,name:x.name,status:x.implementationStatus})),
    ...commercialCatalog.modules.map(x=>({type:"commercial",id:x.commercialModuleId,name:x.name,status:x.executionContract.status})),
    ...e.engineSubmodules.map(x=>({type:"engine",id:x.engineId,name:x.name,status:x.implementationStatus}))
   ];
   const typeNames={canonical:"ماژول پایه",overlay:"ماژول ARIA",commercial:"ماژول تجاری",engine:"زیرماژول موتور"};
   const renderExecutionEntries=()=>{
    executionBody.replaceChildren();
    const q=executionSearch.value.trim().toLocaleLowerCase();
    const matched=entries.filter(x=>(!executionFilter.value||x.type===executionFilter.value)&&(!q||(x.id+" "+x.name).toLocaleLowerCase().includes(q)));
    for(const item of matched.slice(0,100)){
     const tr=node("tr","");[typeNames[item.type],item.id,item.name,item.status].forEach(value=>{const td=node("td","",String(value??"—"));td.style.padding="8px";td.style.borderTop="1px solid var(--line, rgba(255,255,255,.12))";tr.append(td);});
     const actionCell=node("td","");actionCell.style.padding="8px";actionCell.style.borderTop="1px solid var(--line, rgba(255,255,255,.12))";
     const run=node("button","btn btn-quiet","ثبت اجرای محلی");run.type="button";
     run.addEventListener("click",async()=>{
      const goal=executionGoal.value.trim();if(goal.length<4){executionStatus.textContent="ابتدا هدفی با حداقل ۴ نویسه وارد کنید.";return;}
      if(!window.ariaToken){executionStatus.textContent="برای ثبت گردش‌کار ابتدا وارد حساب ARIA شوید.";return;}
      let endpoint="";
      if(item.type==="canonical")endpoint="/api/aria-expansion/canonical-modules/"+encodeURIComponent(item.id)+"/run";
      if(item.type==="overlay")endpoint="/api/aria-expansion/modules/"+encodeURIComponent(item.id)+"/run";
      if(item.type==="commercial")endpoint="/api/aria-expansion/commercial-modules/"+encodeURIComponent(item.id)+"/run";
      if(item.type==="engine")endpoint="/api/aria-expansion/engines/"+encodeURIComponent(item.id)+"/run";
      run.disabled=true;run.textContent="در حال ثبت…";
      try{
       const response=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+window.ariaToken},body:JSON.stringify({goal})});
       const data=await response.json();if(!response.ok)throw new Error(data.error||"ثبت گردش‌کار انجام نشد.");
       run.textContent="ثبت شد · "+data.item.id;executionStatus.textContent="کار محلی "+data.item.id+" ثبت شد. اجرای بیرونی انجام نشده است.";
      }catch(error){run.textContent="تلاش دوباره";executionStatus.textContent=error.message;}finally{run.disabled=false;}
     });
     actionCell.append(run);tr.append(actionCell);executionBody.append(tr);
    }
    executionStatus.textContent="تعداد مسیرهای قابل مشاهده: "+matched.length+" · نمایش حداکثر ۱۰۰ نتیجه؛ برای بقیه جست‌وجو را محدود کنید.";
   };
   executionSearch.addEventListener("input",renderExecutionEntries);executionFilter.addEventListener("change",renderExecutionEntries);renderExecutionEntries();
   executionDetails.append(executionGoal,executionSearch,executionFilter,executionStatus,executionScroll);summary.append(executionDetails);
   maturityEl.replaceChildren(summary);
  }
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
  if(controlsEl){
   const authHeaders=()=>window.ariaToken?{authorization:"Bearer "+window.ariaToken,"content-type":"application/json"}:null;
   const makeCard=(title,description)=>{const card=node("article","glass expansion-card");card.append(node("h3","",title),node("p","expansion-muted",description));controlsEl.append(card);return card;};
   const addField=(card,labelText,tag,placeholder,value)=>{const wrap=node("label","");wrap.append(node("span","",labelText));const input=node(tag,"search");if(tag==="textarea")input.rows=3;input.placeholder=placeholder||"";if(value!==undefined)input.value=value;input.style.width="100%";wrap.append(input);card.append(wrap);return input;};
   const addSelect=(card,labelText,options)=>{const wrap=node("label","");wrap.append(node("span","",labelText));const select=node("select","search");select.style.width="100%";options.forEach(([value,label])=>{const option=node("option","",label);option.value=value;select.append(option);});wrap.append(select);card.append(wrap);return select;};
   const addStatus=card=>{const el=node("p","expansion-plan","نتیجه اینجا نمایش داده می‌شود.");card.append(el);return el;};
   const intentCard=makeCard("۱. بازار هوشمند نیازها","ثبت نیاز، دسته‌بندی و تطبیق فقط با ارائه‌دهنده تأییدشده و رضایت صریح.");
   const intentTitle=addField(intentCard,"عنوان نیاز","input","مثلاً تعمیر وسیله یا طراحی سایت");
   const intentDescription=addField(intentCard,"شرح نیاز","textarea","جزئیات لازم، بدون اطلاعات حساس");
   const intentCategory=addField(intentCard,"دسته‌بندی","input","مثلاً تعمیرات");
   const consentWrap=node("label","");const consent=node("input","");consent.type="checkbox";const consentText=node("span","","اجازه می‌دهم درخواست برای تطبیق با ارائه‌دهنده تأییدشده استفاده شود.");consentWrap.append(consent,consentText);intentCard.append(consentWrap);
   const intentStatus=addStatus(intentCard);let createdIntentId=null;
   const createIntent=node("button","btn btn-quiet","ثبت نیاز");createIntent.type="button";
   createIntent.addEventListener("click",async()=>{const headers=authHeaders();if(!headers){intentStatus.textContent="برای ثبت نیاز ابتدا وارد حساب شوید.";return;}createIntent.disabled=true;try{const response=await fetch("/api/aria-expansion/intents",{method:"POST",headers,body:JSON.stringify({title:intentTitle.value,description:intentDescription.value,category:intentCategory.value,contactConsent:consent.checked})});const data=await response.json();if(!response.ok)throw new Error(data.error||"ثبت نیاز انجام نشد");createdIntentId=data.intent.id;intentStatus.textContent="درخواست "+createdIntentId+" ثبت شد؛ تطبیق ارائه‌دهنده هنوز اجرا نشده است.";}catch(error){intentStatus.textContent=error.message;}finally{createIntent.disabled=false;}});
   const matchIntent=node("button","btn btn-quiet","بررسی تطبیق‌های مجاز");matchIntent.type="button";matchIntent.disabled=true;
   createIntent.addEventListener("click",()=>{matchIntent.disabled=false;});
   matchIntent.addEventListener("click",async()=>{const headers=authHeaders();if(!headers||!createdIntentId){intentStatus.textContent="ابتدا وارد شوید و یک درخواست ثبت کنید.";return;}matchIntent.disabled=true;try{const response=await fetch("/api/aria-expansion/intents/"+encodeURIComponent(createdIntentId)+"/matches",{headers});const data=await response.json();if(!response.ok)throw new Error(data.error||"تطبیق دریافت نشد");intentStatus.textContent=data.matches?.length?"تطبیق‌های تأییدشده: "+data.matches.map(x=>x.display_name+" ("+x.service_area+")").join("، "):"وضعیت تطبیق: "+data.matchState;}catch(error){intentStatus.textContent=error.message;}finally{matchIntent.disabled=false;}});
   intentCard.append(createIntent,matchIntent);
   const autonomyCard=makeCard("۲. مرکز کنترل خودمختاری","سیاست عامل‌ها با پیش‌فرض DENY؛ اجازه مستقیم فقط برای اقدام‌های بی‌خطر و محلی.");
   const agentId=addField(autonomyCard,"شناسه عامل","input","مثلاً aria-planner","aria-planner");
   const action=addSelect(autonomyCard,"نوع اقدام",[["draft","تهیه پیش‌نویس"],["summarize","خلاصه‌سازی"],["classify","دسته‌بندی"],["plan","برنامه‌ریزی"],["analyze_readonly","تحلیل فقط‌خواندنی"],["publish","انتشار بیرونی"],["delete","حذف"]]);
   const decision=addSelect(autonomyCard,"سیاست",[["DENY","ممنوع"],["REQUIRE_APPROVAL","نیازمند تأیید انسانی"],["ALLOW","مجاز در محدوده امن"]]);
   const autonomyStatus=addStatus(autonomyCard);const savePolicy=node("button","btn btn-quiet","ثبت سیاست مالک");savePolicy.type="button";
   savePolicy.addEventListener("click",async()=>{const headers=authHeaders();if(!headers){autonomyStatus.textContent="برای تغییر سیاست باید وارد حساب مالک شوید.";return;}savePolicy.disabled=true;try{const response=await fetch("/api/aria-expansion/autonomy/policies",{method:"POST",headers,body:JSON.stringify({agentId:agentId.value,action:action.value,decision:decision.value})});const data=await response.json();if(!response.ok)throw new Error(data.error||"ثبت سیاست انجام نشد");autonomyStatus.textContent="سیاست "+data.policy.agent_id+" / "+data.policy.action+" ثبت شد: "+data.policy.decision;}catch(error){autonomyStatus.textContent=error.message;}finally{savePolicy.disabled=false;}});
   autonomyCard.append(savePolicy);
   const scenarioCard=makeCard("۳. شبیه‌ساز سناریو","مقایسه فرض‌های عددی؛ خروجی پیش‌بینی قطعی یا اقدام اجرایی نیست.");
   const scenarioInput=addField(scenarioCard,"سناریوها به قالب JSON","textarea","حداقل دو سناریو با name و value",'[{"name":"محتاطانه","value":80},{"name":"پایه","value":100},{"name":"خوش‌بینانه","value":120}]');
   const scenarioStatus=addStatus(scenarioCard);const simulate=node("button","btn btn-quiet","محاسبه و مقایسه");simulate.type="button";
   simulate.addEventListener("click",async()=>{simulate.disabled=true;try{const scenarios=JSON.parse(scenarioInput.value);const response=await fetch("/api/aria-expansion/scenarios/simulate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({scenarios,assumptions:"فرض‌های واردشده توسط کاربر"})});const data=await response.json();if(!response.ok)throw new Error(data.error||"شبیه‌سازی انجام نشد");scenarioStatus.textContent="حداقل: "+data.comparison.min+" · میانگین: "+data.comparison.mean+" · حداکثر: "+data.comparison.max+" — "+data.disclaimer;}catch(error){scenarioStatus.textContent=error instanceof SyntaxError?"ساختار JSON معتبر نیست.":error.message;}finally{simulate.disabled=false;}});
   scenarioCard.append(simulate);
   const ownerCard=makeCard("۴. مرکز فرمان مالک","نمای مدیریتی فقط برای حساب مالک و با اتصال پایگاه داده.");
   const ownerStatus=addStatus(ownerCard);const loadOwner=node("button","btn btn-quiet","دریافت گزارش مالک");loadOwner.type="button";
   loadOwner.addEventListener("click",async()=>{const headers=authHeaders();if(!headers){ownerStatus.textContent="برای مشاهده گزارش وارد حساب مالک شوید.";return;}loadOwner.disabled=true;try{const response=await fetch("/api/aria-expansion/owner/overview",{headers});const data=await response.json();if(!response.ok)throw new Error(data.error||"گزارش مالک دریافت نشد");ownerStatus.textContent="کاتالوگ: "+data.expansion.problemRecords+" مسئله · "+data.expansion.historicalCandidates+" کنترل تاریخی · "+data.expansion.revenueModels+" مدل درآمدی · کارها: "+data.workItems.reduce((n,x)=>n+x.count,0)+" · ارائه‌دهندگان: "+data.providers.reduce((n,x)=>n+x.count,0)+" · درآمد زنده: "+(data.liveRevenueEnabled?"فعال":"غیرفعال");}catch(error){ownerStatus.textContent=error.message;}finally{loadOwner.disabled=false;}});
   ownerCard.append(loadOwner);
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
