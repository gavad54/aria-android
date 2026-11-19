'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const args=process.argv.slice(2),ri=args.indexOf('--root');
const root=path.resolve(args.find(x=>x.startsWith('--root='))?.slice(7)||(ri>=0?args[ri+1]:process.env.ARIA32_ROOT||''));
if(!root||!fs.existsSync(root))throw new Error('ARIA32_CANDIDATE_ROOT_REQUIRED');
const repoRoot=path.resolve(__dirname,'..');
const bridge=JSON.parse(fs.readFileSync(path.join(repoRoot,'backend/data/aria_web_catalog_bridge.json'),'utf8'));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
const digest=ids=>crypto.createHash('sha256').update(ids.slice().sort((a,b)=>a-b).join('\n')).digest('hex');
const baseline=639,total=711,baselineSha='f3be35b08164d22dc7ca99c875be340efc03021d8296edf05b4eb47b6565cf0b';
if(bridge.records.length!==72||bridge.baselineContractCount!==baseline||bridge.totalContractCount!==total)throw new Error('WEB_CATALOG_BRIDGE_MANIFEST_INVALID');
const files={backend:'backend/data/aria_module_registry.json',android:'app/src/main/assets/aria_module_registry.json',caps:'backend/data/aria_module_capabilities.json'};
const b=read(files.backend),a=read(files.android),c=read(files.caps);
for(const [n,d] of [['backend',b],['android',a],['capabilities',c]])if(d.module_count!==baseline||d.modules.length!==baseline||d.version!=='32.0.0')throw new Error(n.toUpperCase()+'_BASELINE_INVALID');
if(JSON.stringify(b.modules)!==JSON.stringify(a.modules))throw new Error('ANDROID_BACKEND_BASELINE_MISMATCH');
const oldIds=b.modules.map(x=>Number(x.id));
if(digest(oldIds)!==baselineSha||digest(c.modules.map(x=>Number(x.id)))!==baselineSha)throw new Error('ORIGINAL_639_ID_BASELINE_CHANGED');
const steps={
workspace:['VALIDATE_INTENT','BUILD_ACTION_PLAN','CHECK_WORKSPACE_PERMISSIONS','RETURN_NEXT_STEPS','AUDIT'],
learning:['VALIDATE_LEARNING_GOAL','STRUCTURE_LEARNING_CONTENT','DEFINE_PRACTICE','RETURN_LEARNING_PLAN','AUDIT'],
trust:['CLASSIFY_RISK','APPLY_SAFETY_POLICY','DEFINE_APPROVAL_BOUNDARY','RETURN_SAFE_RESULT','AUDIT'],
creative:['VALIDATE_BRIEF_AND_RIGHTS','BUILD_CREATIVE_DIRECTION','DEFINE_ASSET_SPECIFICATIONS','PREPARE_REVIEW_CHECKLIST','AUDIT'],
media:['VALIDATE_MEDIA_INPUTS_AND_RIGHTS','BUILD_STORYBOARD_OR_MEDIA_PLAN','DEFINE_FORMAT_AND_CAPTIONS','REQUIRE_PROVIDER_FOR_RENDERING','AUDIT'],
content:['VALIDATE_AUDIENCE_AND_CLAIMS','BUILD_CONTENT_BRIEF','DRAFT_CONTENT_WORKFLOW','DEFINE_REVIEW_AND_METRICS','AUDIT'],
knowledge:['VALIDATE_SOURCE_ACCESS','STRUCTURE_KNOWLEDGE_TASK','DEFINE_GROUNDED_OUTPUT','REQUIRE_SOURCE_REFERENCES','AUDIT'],
data:['VALIDATE_DATA_SCOPE','DEFINE_ANALYSIS_METHOD','CHECK_DATA_QUALITY','PREPARE_REPORT_SPECIFICATION','AUDIT'],
'web-builder':['VALIDATE_SITE_BRIEF','BUILD_INFORMATION_ARCHITECTURE','DEFINE_RESPONSIVE_PAGE_SPEC','PREPARE_PREVIEW_AND_PUBLISH_GATE','AUDIT'],
automation:['VALIDATE_TRIGGER_AND_ACTIONS','MAP_WORKFLOW_STATES','CHECK_SCOPES_AND_APPROVALS','PREPARE_EXECUTION_PLAN','AUDIT'],
personal:['VALIDATE_USER_GOAL_AND_CONSENT','BUILD_PERSONAL_WORKFLOW','IDENTIFY_PROVIDER_DEPENDENCIES','RETURN_ACTION_PLAN','AUDIT'],
business:['VALIDATE_BUSINESS_CONTEXT','BUILD_COMMERCIAL_WORKFLOW','CHECK_COST_AND_ENTITLEMENT_GUARDS','REQUIRE_HUMAN_APPROVAL_FOR_TRANSACTIONS','AUDIT'],
community:['VALIDATE_PARTICIPANTS_AND_CONSENT','DEFINE_SERVICE_OR_COMMUNITY_FLOW','CHECK_PROVIDER_ELIGIBILITY','PREPARE_MATCH_OR_CONTENT_PLAN','AUDIT']
};
const deliverables={
workspace:['ساختار اقدام','گام‌های اجرایی','معیار تکمیل'],learning:['هدف یادگیری','مسیر و تمرین','معیار پیشرفت'],
trust:['ارزیابی ریسک','مرزهای مجاز','نیازمندی تأیید انسانی'],creative:['بریف خلاق','مشخصات دارایی','چک‌لیست حقوق و کیفیت'],
media:['طرح رسانه','مشخصات فنی خروجی','وابستگی تولید یا رندر بیرونی'],content:['بریف محتوا','پیش‌نویس و ساختار','معیار سنجش و بازبینی'],
knowledge:['طرح مبتنی بر منبع','ارجاعات موردنیاز','ساختار خروجی'],data:['طرح تحلیل','کنترل کیفیت داده','مشخصات گزارش'],
'web-builder':['نقشه سایت','ساختار صفحه','معیار پیش‌نمایش و انتشار'],automation:['نقشه گردش‌کار','نقاط کنترل','طرح اجرا و بازگشت'],
personal:['هدف کاربر','برنامه اقدام','وابستگی و رضایت موردنیاز'],business:['مدل یا فرایند تجاری','کنترل هزینه و ریسک','نقاط تأیید انسانی'],
community:['تعریف درخواست','شرایط تطبیق','کنترل ارائه‌دهنده و رضایت']
};
const newReg=[],newCaps=[],seen=new Set();
for(const x of bridge.records){
 if(!x.id||!x.name||!x.description||!steps[x.domain])throw new Error('WEB_CATALOG_RECORD_INVALID_'+x.id);
 if(seen.has(x.id))throw new Error('WEB_CATALOG_DUPLICATE_'+x.id);seen.add(x.id);
 const id=Number(x.contractId);
 if(id<651||id>722||oldIds.includes(id))throw new Error('WEB_CATALOG_ID_COLLISION_'+id);
 if(x.aliasOfModuleId!==null&&!oldIds.includes(Number(x.aliasOfModuleId)))throw new Error('WEB_CATALOG_ALIAS_TARGET_MISSING_'+x.id);
 const baseEntry={id,name:x.name,layer:'WEB_CATALOG_BRIDGE',status:'ACTIVE',enabled:true,execution:'LOCAL_WORKFLOW',engine_enabled:true,
 control_key:'MODULE_'+String(id).padStart(3,'0')+'_ENABLE',workflow_entry:'CATALOG_INTENT_TO_STRUCTURED_WORKFLOW',version:'32.0.0',
 workflow_engine:'ARIA_WEB_CATALOG_RUNTIME_V1',operational_contract:'VALIDATE->AUTHORIZE->PLAN->EXECUTE_LOCAL_WORKFLOW->VERIFY->METER->AUDIT',
 human_approval:'RISK_BASED',current_status:'LOCAL_WORKFLOW_ACTIVE_EXTERNAL_ACTIONS_GATED',web_catalog_id:x.id,alias_of_module_id:x.aliasOfModuleId};
 newReg.push(baseEntry);
 newCaps.push({...baseEntry,design_family:'WEB_CATALOG',maturity:'PRIORITY_SPECIALIZATION',
 specialized_contract:'CATALOG_INTENT->DOMAIN_WORKFLOW->STRUCTURED_PLAN->POLICY_GATE->AUDIT',
 core_input:'User intent + catalog capability + scoped context + payload',
 core_output:'Typed local workflow plan + external dependency declaration + audit reference',
 data_boundary:'User/workspace scoped; least privilege; no cross-product direct writes',
 external_adapter:'OPTIONAL',external_execution_required:x.externalExecutionRequired===true,human_gate:'POLICY_BASED',
 risk_level:x.externalExecutionRequired?'MEDIUM':'LOW',
 security:'Validate input + consent + least privilege + fail-closed + audit + idempotency',
 revenue_guardrails:'Entitlement + metering + cost guard + no charge for unperformed external action',
 monetization:x.revenueModel||'FREE;PLUS;PRO as applicable',
 metering:'LOCAL_WORKFLOW_ACTION; external execution separately metered only after verified provider result',
 future_ready:'VERSIONED_CONTRACT + ADAPTER + FEATURE_FLAG + OBSERVABILITY',
 implementation_wave:'ARIA_WEB_CATALOG_72_2026_11',implementation_state:'LOCAL_WORKFLOW_ACTIVE_EXTERNAL_EXECUTION_GATED',
 engine_verification:'BRIDGE_CONTRACT_AND_RUNTIME_TEST',web_catalog_id:x.id,alias_of_module_id:x.aliasOfModuleId,
 catalog_domain:x.domain,catalog_description:x.description,revenue_model:x.revenueModel,
 workflow_template:x.domain,workflow_steps:steps[x.domain],workflow_deliverables:deliverables[x.domain]});
}
if(seen.size!==72||JSON.stringify(newReg.map(x=>x.id))!==JSON.stringify(Array.from({length:72},(_,i)=>651+i)))throw new Error('WEB_CATALOG_EXPECTED_72_IDS_651_722');
for(const d of [b,a]){d.modules.push(...newReg);d.module_count=d.modules.length;d.web_catalog_bridge={version:bridge.schemaVersion,records:72,contract_ids:[651,722],activation:'LOCAL_WORKFLOW_ACTIVE_EXTERNAL_ACTIONS_GATED'};}
c.modules.push(...newCaps);c.module_count=c.modules.length;c.web_catalog_bridge={version:bridge.schemaVersion,records:72,contract_ids:[651,722],activation:'LOCAL_WORKFLOW_ACTIVE_EXTERNAL_ACTIONS_GATED'};
if(b.module_count!==total||a.module_count!==total||c.module_count!==total||JSON.stringify(b.modules)!==JSON.stringify(a.modules))throw new Error('WEB_CATALOG_REGISTRY_PARITY_FAILED');
write(files.backend,b);write(files.android,a);write(files.caps,c);
fs.copyFileSync(path.join(repoRoot,'backend/data/aria_web_catalog_bridge.json'),path.join(root,'backend/data/aria_web_catalog_bridge.json'));
function patch(file,repls){const full=path.join(root,file);let s=fs.readFileSync(full,'utf8');for(const [from,to,code] of repls){if(!s.includes(from))throw new Error(code+'_ANCHOR_NOT_FOUND');s=s.replace(from,to);}fs.writeFileSync(full,s);}
patch('backend/src/services/moduleRuntime.js',[
["const FAMILY_HANDLERS={","const FAMILY_HANDLERS={WEB_CATALOG:'CATALOG_WORKFLOW',","RUNTIME_WEB_CATALOG_FAMILY"]
]);
patch('backend/src/services/moduleDomainHandlers.js',[
["function handle(capability, input){\n  const family=String(capability.design_family||'CORE');","function handleWebCatalog(capability,input){\n  const command=String(input.command||'').trim();\n  if(command.length<4)return {contract:capability.specialized_contract,executionStatus:'REJECTED',reason:'INTENT_REQUIRED'};\n  const externalRequired=capability.external_execution_required===true;\n  return {contract:capability.specialized_contract,executionStatus:'COMPLETED',domainAction:'BUILD_STRUCTURED_LOCAL_WORKFLOW',catalogCapabilityId:capability.web_catalog_id,requestedOutcome:command.slice(0,1000),workflow:{template:capability.workflow_template,steps:capability.workflow_steps,deliverables:capability.workflow_deliverables},externalExecution:{required:externalRequired,status:externalRequired?'ADAPTER_REQUIRED':'NOT_REQUIRED_FOR_LOCAL_WORKFLOW'},limitations:['This result completes a local planning workflow only.','External publishing, rendering, booking, payment, cloud changes or third-party transactions are not executed by this handler.'],next:capability.workflow_steps||[]};\n}\nfunction handle(capability, input){\n  const family=String(capability.design_family||'CORE');\n  if(family==='WEB_CATALOG')return handleWebCatalog(capability,input);","RUNTIME_WEB_CATALOG_DISPATCH"]
]);
patch('backend/src/services/moduleRuntime.js',[
["function validateInput(capability,input){if(!capability)throw new Error('MODULE_CONTRACT_UNAVAILABLE');if(inputBytes(input)>MAX_INPUT_BYTES)throw new Error('MODULE_INPUT_TOO_LARGE');const body=safeObject(input);const command=body.command==null?'':String(body.command);if(command.length>8000)throw new Error('MODULE_COMMAND_TOO_LARGE');return {command:command.trim(),context:safeObject(body.context),payload:safeObject(body.payload)};}","function validateInput(capability,input){if(!capability)throw new Error('MODULE_CONTRACT_UNAVAILABLE');if(inputBytes(input)>MAX_INPUT_BYTES)throw new Error('MODULE_INPUT_TOO_LARGE');const body=safeObject(input);const command=body.command==null?'':String(body.command);if(command.length>8000)throw new Error('MODULE_COMMAND_TOO_LARGE');if(capability.design_family==='WEB_CATALOG'&&command.trim().length<4)throw new Error('WEB_CATALOG_INTENT_REQUIRED');return {command:command.trim(),context:safeObject(body.context),payload:safeObject(body.payload)};}","RUNTIME_WEB_CATALOG_INPUT"]
]);
patch('scripts/aria32_no_loss_gate.js',[
["const expectedCount = 639;","const expectedBaselineCount = 639;\nconst expectedTotalCount = 711;","NO_LOSS_COUNTS"],
["doc.module_count === expectedCount && doc.modules.length === expectedCount","doc.module_count === expectedTotalCount && doc.modules.length === expectedTotalCount","NO_LOSS_TOTAL_COUNT"],
["new Set(a).size === expectedCount","new Set(a).size === expectedTotalCount","NO_LOSS_ANDROID_UNIQUENESS"],
["new Set(b).size === expectedCount","new Set(b).size === expectedTotalCount","NO_LOSS_BACKEND_UNIQUENESS"],
["new Set(c).size === expectedCount","new Set(c).size === expectedTotalCount","NO_LOSS_CAPABILITY_UNIQUENESS"],
["const idDigest = crypto.createHash('sha256').update(a.slice().sort((x, y) => x - y).join('\\n')).digest('hex');\nfail(idDigest === expectedIdsSha256, 'LEGACY_MODULE_ID_SET_CHANGED');","const legacyIds = a.slice(0, expectedBaselineCount);\nconst idDigest = crypto.createHash('sha256').update(legacyIds.slice().sort((x, y) => x - y).join('\\n')).digest('hex');\nfail(idDigest === expectedIdsSha256, 'LEGACY_MODULE_ID_SET_CHANGED');\nfail(JSON.stringify(a.slice(expectedBaselineCount)) === JSON.stringify(Array.from({length:72},(_,i)=>651+i)), 'WEB_CATALOG_ID_RANGE_CHANGED');","NO_LOSS_BASELINE_DIGEST"],
["console.log("+String.fromCharCode(96)+"ARIA32_NO_LOSS_PASS modules="+String.fromCharCode(36)+"{expectedCount} ids_sha256="+String.fromCharCode(36)+"{idDigest}"+String.fromCharCode(96)+");","console.log('ARIA32_NO_LOSS_PASS legacy=639 web_catalog=72 total=711 legacy_ids_sha256='+idDigest);","NO_LOSS_OUTPUT"]
]);
patch('scripts/aria32_release_readiness.js',[
["backendRegistry.module_count === 639 && backendRegistry.modules.length === 639 && capabilities.modules.length === 639","backendRegistry.module_count === 711 && backendRegistry.modules.length === 711 && capabilities.modules.length === 711","READINESS_TOTAL_COUNT"],
["new Set(backendRegistry.modules.map(m => String(m.id))).size === 639","new Set(backendRegistry.modules.map(m => String(m.id))).size === 711","READINESS_UNIQUE_COUNT"],
["console.log('MODULES=639');","console.log('MODULES=711 (639 preserved + 72 web catalog contracts)');","READINESS_COUNT_OUTPUT"]
]);
patch('scripts/verify_module_capability_matrix.sh',[
["==639","==711","MATRIX_TOTAL_COUNT"],
["MODULES=639","MODULES=711 (639+72 web catalog)","MATRIX_COUNT_OUTPUT"]
]);
console.log('ARIA_WEB_CATALOG_BRIDGE_APPLIED records=72 legacy=639 total=711');
console.log('NOTE=local workflow plans are active; external provider actions remain gated');
