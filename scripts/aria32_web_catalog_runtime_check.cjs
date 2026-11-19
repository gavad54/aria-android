'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const args=process.argv.slice(2),i=args.indexOf('--root');
const root=path.resolve(args.find(x=>x.startsWith('--root='))?.slice(7)||(i>=0?args[i+1]:''));
if(!root||!fs.existsSync(root))throw new Error('CANDIDATE_ROOT_REQUIRED');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../backend/data/aria_web_catalog_bridge.json'),'utf8'));
const {handle}=require(path.join(root,'backend/src/services/moduleDomainHandlers.js'));
const runtime=require(path.join(root,'backend/src/services/moduleRuntime.js'));
const loaded=runtime.loadCapabilities();
assert.equal(loaded.count,639,'canonical runtime contract count must remain 639');
assert.equal(manifest.records.length,72);
assert.equal(new Set(manifest.records.map(x=>x.catalogEntryId)).size,72);
assert.equal(new Set(manifest.records.map(x=>x.capabilityContractId)).size,47);
for(const r of manifest.records){
 const cap=runtime.getCapability(r.capabilityContractId);
 assert.ok(cap,'canonical capability must be loadable: '+r.capabilityContractId);
 assert.equal(Number(cap.id),r.capabilityContractId);
 assert.ok(Array.isArray(cap.catalog_aliases),'canonical contract must expose catalog aliases: '+r.capabilityContractId);
 const alias=cap.catalog_aliases.find(x=>x.catalogEntryId===r.catalogEntryId);
 assert.ok(alias,'catalog alias must resolve to canonical contract: '+r.catalogEntryId);
 assert.equal(alias.catalogId,r.id);
 assert.equal(alias.domain,r.domain);
 const result=handle(cap,{command:'Prepare a structured local workflow for this catalog capability',context:{},payload:{}});
 assert.ok(result&&typeof result.domainAction==='string','canonical domain handler must accept alias target '+r.catalogEntryId);
 assert.equal(result.executionStatus,'PLANNED','handler must return a plan, not claim external completion');
 assert.ok(Array.isArray(result.next)&&result.next.length>=3);
}
console.log('ARIA_CANONICAL_ALIAS_RUNTIME_PASS catalog_entries=72 canonical_contracts=639 alias_targets=47');
console.log('EXTERNAL_ACTIONS=NOT_EXECUTED_PROVIDER_ADAPTER_REQUIRED');
