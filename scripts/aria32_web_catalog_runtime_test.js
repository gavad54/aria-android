'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const args=process.argv.slice(2),i=args.indexOf('--root'),root=path.resolve(args.find(x=>x.startsWith('--root='))?.slice(7)||(i>=0?args[i+1]:''));
if(!root||!fs.existsSync(root))throw new Error('CANDIDATE_ROOT_REQUIRED');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../backend/data/aria_web_catalog_bridge.json'),'utf8'));
const {handle}=require(path.join(root,'backend/src/services/moduleDomainHandlers.js'));
const runtime=require(path.join(root,'backend/src/services/moduleRuntime.js'));
const loaded=runtime.loadCapabilities();
assert.equal(loaded.count,711);
assert.equal(manifest.records.length,72);
for(const r of manifest.records){
 const cap=runtime.getCapability(r.contractId);
 assert.ok(cap,'capability contract must be loadable: '+r.contractId);
 assert.equal(cap.web_catalog_id,r.id);
 assert.equal(cap.alias_of_module_id,r.aliasOfModuleId);
 assert.equal(cap.design_family,'WEB_CATALOG');
 assert.equal(cap.maturity,'PRIORITY_SPECIALIZATION');
 const result=handle(cap,{command:'Create a safe structured workflow for this capability',context:{},payload:{}});
 assert.equal(result.executionStatus,'COMPLETED','local workflow should complete for '+r.id);
 assert.equal(result.catalogCapabilityId,r.id);
 assert.equal(result.externalExecution.required,r.externalExecutionRequired);
 assert.ok(result.workflow.steps.length>=4);
 assert.ok(result.limitations.some(x=>x.includes('External')));
}
console.log('ARIA_WEB_CATALOG_RUNTIME_PASS active_local_workflows=72 contracts=711');
console.log('EXTERNAL_ACTIONS=GATED_UNTIL_PROVIDER_ADAPTER_AND_AUTHORIZATION');
