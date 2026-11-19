'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const args=process.argv.slice(2),i=args.indexOf('--root');
const root=path.resolve(args.find(x=>x.startsWith('--root='))?.slice(7)||(i>=0?args[i+1]:''));
if(!root||!fs.existsSync(root))throw new Error('CANDIDATE_ROOT_REQUIRED');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../backend/data/aria_web_catalog_bridge.json'),'utf8'));
const docs={
 backend:read('backend/data/aria_module_registry.json'),
 android:read('app/src/main/assets/aria_module_registry.json'),
 capabilities:read('backend/data/aria_module_capabilities.json')
};
const digest=ids=>crypto.createHash('sha256').update(ids.slice().sort((a,b)=>a-b).join('\\n')).digest('hex');
const EXPECTED_SHA='f3be35b08164d22dc7ca99c875be340efc03021d8296edf05b4eb47b6565cf0b';
assert.equal(manifest.records.length,72);
assert.equal(manifest.baselineContractCount,639);
assert.equal(manifest.addedContractCount,0);
assert.equal(manifest.totalContractCount,639);
assert.equal(manifest.catalogEntryCount,72);
assert.equal(manifest.uniqueAliasTargetCount,47);
const idsByName={};
for(const [name,doc] of Object.entries(docs)){
 assert.equal(doc.version,'32.0.0',name+' version');
 assert.equal(doc.module_count,639,name+' module_count');
 assert.equal(doc.modules.length,639,name+' module length');
 const ids=doc.modules.map(m=>Number(m.id));
 assert.equal(new Set(ids).size,639,name+' unique IDs');
 assert.equal(digest(ids),EXPECTED_SHA,name+' preserved ID digest');
 idsByName[name]=ids;
}
assert.deepEqual(idsByName.android,idsByName.backend);
assert.deepEqual(idsByName.capabilities,idsByName.backend);
const maps=Object.fromEntries(Object.entries(docs).map(([name,doc])=>[name,new Map(doc.modules.map(m=>[Number(m.id),m]))]));
const catalogIds=new Set(),targets=new Set();
for(const r of manifest.records){
 assert.ok(Number.isInteger(r.catalogEntryId)&&r.catalogEntryId>=651&&r.catalogEntryId<=722);
 assert.ok(!catalogIds.has(r.catalogEntryId),'duplicate catalog entry ID '+r.catalogEntryId);catalogIds.add(r.catalogEntryId);
 assert.ok(Number.isInteger(r.capabilityContractId));
 targets.add(r.capabilityContractId);
 for(const [name,map] of Object.entries(maps)){
  const target=map.get(r.capabilityContractId);
  assert.ok(target,name+' missing canonical target '+r.capabilityContractId);
  assert.ok(Array.isArray(target.catalog_aliases),name+' missing alias list on '+r.capabilityContractId);
  const aliases=target.catalog_aliases.filter(a=>a.catalogEntryId===r.catalogEntryId);
  assert.equal(aliases.length,1,name+' alias cardinality '+r.catalogEntryId);
  assert.equal(aliases[0].catalogId,r.id);
  assert.equal(aliases[0].domain,r.domain);
 }
}
assert.equal(catalogIds.size,72);
assert.equal(targets.size,47);
for(const [name,doc] of Object.entries(docs)){
 const attached=doc.modules.flatMap(m=>m.catalog_aliases||[]);
 assert.equal(attached.length,72,name+' attached alias total');
 assert.equal(new Set(attached.map(a=>a.catalogEntryId)).size,72,name+' attached alias uniqueness');
 assert.equal(doc.modules.filter(m=>Array.isArray(m.catalog_aliases)&&m.catalog_aliases.length).length,47,name+' alias target count');
 assert.ok(!doc.modules.some(m=>Number(m.id)>=651&&Number(m.id)<=722),name+' must not contain duplicate synthetic contract IDs');
 assert.equal(doc.catalog_alias_summary.catalogEntries,72);
 assert.equal(doc.catalog_alias_summary.canonicalContracts,639);
 assert.equal(doc.catalog_alias_summary.uniqueAliasTargets,47);
}
assert.deepEqual(docs.backend.modules,docs.android.modules,'Android/backend registry parity');
console.log('ARIA_ALIAS_CONSOLIDATION_GATE_PASS canonical_contracts=639 catalog_entries=72 alias_targets=47');
console.log('LEGACY_639_ID_DIGEST='+EXPECTED_SHA);
console.log('DUPLICATE_EXECUTABLE_CONTRACTS=0');
