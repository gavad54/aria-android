'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'server.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'backend/data/aria_web_catalog_bridge.json'),'utf8'));
const start=source.indexOf('const modules=['),end=source.indexOf('\n];',start);
assert.ok(start>=0&&end>start,'server catalog source must exist');
const modules=vm.runInNewContext('('+source.slice(start+'const modules='.length,end+2)+')');
const ds=source.indexOf('const MODULE_DOMAIN_BY_ID = Object.freeze({'),de=source.indexOf('\n});',ds);
assert.ok(ds>=0&&de>ds,'domain map source must exist');
const domains=vm.runInNewContext('('+source.slice(ds+'const MODULE_DOMAIN_BY_ID = Object.freeze('.length,de+2)+')');
assert.equal(modules.length,72);
assert.equal(manifest.records.length,72);
assert.equal(new Set(modules.map(x=>x.id)).size,72);
assert.equal(new Set(manifest.records.map(x=>x.id)).size,72);
for(let i=0;i<72;i++){
 const m=modules[i],r=manifest.records[i];
 assert.equal(r.id,m.id,'catalog ID order must match source');
 assert.equal(r.name,m.name,'catalog name must match source');
 assert.equal(r.description,m.description,'catalog description must match source');
 assert.equal(r.domain,domains[m.id],'catalog domain must match source mapping');
 assert.equal(r.contractId,651+i,'contract ID range must be stable');
 assert.equal(r.activation,'LOCAL_WORKFLOW_ACTIVE');
 assert.ok(r.aliasOfModuleId===null||Number.isInteger(r.aliasOfModuleId));
}
console.log('ARIA_WEB_CATALOG_MANIFEST_PASS records=72 contract_ids=651-722');
