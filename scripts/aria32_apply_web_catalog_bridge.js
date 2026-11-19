'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const args=process.argv.slice(2);
const i=args.indexOf('--root');
const root=path.resolve(args.find(x=>x.startsWith('--root='))?.slice(7)||(i>=0?args[i+1]:process.env.ARIA32_ROOT||''));
if(!root||!fs.existsSync(root))throw new Error('ARIA32_CANDIDATE_ROOT_REQUIRED');
const repoRoot=path.resolve(__dirname,'..');
const bridge=JSON.parse(fs.readFileSync(path.join(repoRoot,'backend/data/aria_web_catalog_bridge.json'),'utf8'));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\\n');
const digest=ids=>crypto.createHash('sha256').update(ids.slice().sort((a,b)=>a-b).join('\\n')).digest('hex');
const BASELINE=639,EXPECTED_SHA='f3be35b08164d22dc7ca99c875be340efc03021d8296edf05b4eb47b6565cf0b';
if(bridge.schemaVersion!=='1.1.0'||bridge.records.length!==72||bridge.baselineContractCount!==BASELINE||bridge.addedContractCount!==0||bridge.totalContractCount!==BASELINE||bridge.catalogEntryCount!==72||bridge.uniqueAliasTargetCount!==47)throw new Error('CANONICAL_ALIAS_MANIFEST_INVALID');
const files={backend:'backend/data/aria_module_registry.json',android:'app/src/main/assets/aria_module_registry.json',capabilities:'backend/data/aria_module_capabilities.json'};
const original={backend:read(files.backend),android:read(files.android),capabilities:read(files.capabilities)};
for(const [name,doc] of Object.entries(original)){
 if(doc.version!=='32.0.0'||doc.module_count!==BASELINE||doc.modules.length!==BASELINE)throw new Error(name.toUpperCase()+'_BASELINE_INVALID');
 const ids=doc.modules.map(x=>Number(x.id));
 if(new Set(ids).size!==BASELINE||digest(ids)!==EXPECTED_SHA)throw new Error(name.toUpperCase()+'_BASELINE_ID_SET_CHANGED');
}
if(JSON.stringify(original.backend.modules)!==JSON.stringify(original.android.modules))throw new Error('ANDROID_BACKEND_BASELINE_MISMATCH');
const baseIds=new Set(original.backend.modules.map(x=>Number(x.id)));
const entryIds=new Set(),aliasTargets=new Set();
for(const r of bridge.records){
 if(!r.id||!r.name||!r.description||!Number.isInteger(r.catalogEntryId)||r.catalogEntryId<651||r.catalogEntryId>722)throw new Error('CATALOG_ALIAS_RECORD_INVALID_'+r.id);
 if(entryIds.has(r.catalogEntryId))throw new Error('CATALOG_ENTRY_ID_DUPLICATE_'+r.catalogEntryId);
 entryIds.add(r.catalogEntryId);
 if(!Number.isInteger(r.capabilityContractId)||!baseIds.has(r.capabilityContractId))throw new Error('CANONICAL_CONTRACT_TARGET_MISSING_'+r.id);
 aliasTargets.add(r.capabilityContractId);
}
if(entryIds.size!==72||aliasTargets.size!==47)throw new Error('CATALOG_ALIAS_CARDINALITY_INVALID');
const next={};
for(const [name,doc] of Object.entries(original)){
 const copy=structuredClone(doc),byId=new Map(copy.modules.map(m=>[Number(m.id),m]));
 for(const r of bridge.records){
  const target=byId.get(r.capabilityContractId);
  if(!target)throw new Error('ALIAS_TARGET_NOT_FOUND_'+r.capabilityContractId);
  if(!Array.isArray(target.catalog_aliases))target.catalog_aliases=[];
  const alias={catalogEntryId:r.catalogEntryId,catalogId:r.id,name:r.name,domain:r.domain,description:r.description,revenueModel:r.revenueModel||null,externalExecutionRequired:r.externalExecutionRequired===true,catalogState:r.catalogState||r.status||'planned'};
  const existing=target.catalog_aliases.find(x=>x.catalogEntryId===r.catalogEntryId);
  if(existing&&JSON.stringify(existing)!==JSON.stringify(alias))throw new Error('CATALOG_ALIAS_CONFLICT_'+r.catalogEntryId);
  if(!existing)target.catalog_aliases.push(alias);
 }
 for(const m of copy.modules)if(Array.isArray(m.catalog_aliases))m.catalog_aliases.sort((x,y)=>x.catalogEntryId-y.catalogEntryId);
 copy.catalog_alias_summary={schemaVersion:bridge.schemaVersion,catalogEntries:72,canonicalContracts:639,uniqueAliasTargets:47,executionModel:'ONE_CANONICAL_CONTRACT_MANY_CATALOG_ALIASES'};
 if(copy.module_count!==BASELINE||copy.modules.length!==BASELINE)throw new Error(name.toUpperCase()+'_CONTRACT_COUNT_CHANGED');
 next[name]=copy;
}
if(JSON.stringify(next.backend.modules)!==JSON.stringify(next.android.modules))throw new Error('ANDROID_BACKEND_ALIAS_PARITY_FAILED');
for(const [name,doc] of Object.entries(next))write(files[name],doc);
fs.copyFileSync(path.join(repoRoot,'backend/data/aria_web_catalog_bridge.json'),path.join(root,'backend/data/aria_web_catalog_bridge.json'));
console.log('ARIA_CANONICAL_ALIAS_BRIDGE_APPLIED catalog_entries=72 canonical_contracts=639 alias_targets=47');
console.log('NO_NEW_EXECUTABLE_CONTRACTS=true');
console.log('EXTERNAL_ACTIONS=GATED_UNTIL_PROVIDER_ADAPTER_AND_AUTHORIZATION');
