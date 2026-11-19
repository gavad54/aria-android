"use strict";
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const MODULES = [];
for (const family of ["ideas", "controls", "catalog", "engines", "service-engines"]) {
  const directory = path.join(ROOT, family);
  for (const filename of fs.readdirSync(directory).filter(name => name.endsWith(".cjs")).sort()) {
    MODULES.push(require(path.join(directory, filename)));
  }
}
const declaredManifest = JSON.parse(fs.readFileSync(path.join(ROOT, "..", "data", "aria_201_backend_module_manifest.json"), "utf8"));
if (declaredManifest.independentBackendModuleCount !== 201 || declaredManifest.records.length !== 201 ||
    new Set(declaredManifest.records.map(record => record.moduleId)).size !== 201 ||
    declaredManifest.records.some(record => !fs.existsSync(path.join(ROOT, "..", "..", record.filePath)))) {
  throw new Error("ARIA_BACKEND_MODULE_MANIFEST_INVALID");
}
const ids = MODULES.map(module => module.manifest.moduleId);
if (new Set(ids).size !== ids.length) throw new Error("ARIA_MODULE_ID_COLLISION");
const MODULE_BY_ID = new Map(MODULES.map(module => [module.manifest.moduleId, module]));
const MODULE_COUNTS = {
  ideas: MODULES.filter(module => module.manifest.moduleType === "IDEA_BACKLOG_MODULE").length,
  governanceControls: MODULES.filter(module => module.manifest.moduleType === "GOVERNANCE_CONTROL_MODULE").length,
  commercialCatalog: MODULES.filter(module => module.manifest.moduleType === "COMMERCIAL_CATALOG_MODULE").length,
  childEngines: MODULES.filter(module => module.manifest.moduleType === "CHILD_ENGINE_MODULE").length,
  serviceDeliveryEngines: MODULES.filter(module => module.manifest.moduleType === "SERVICE_DELIVERY_ENGINE").length
};
if (MODULES.length !== 201 || JSON.stringify(MODULE_COUNTS) !== JSON.stringify(declaredManifest.counts) || MODULE_COUNTS.ideas !== 50 || MODULE_COUNTS.governanceControls !== 4 ||
    MODULE_COUNTS.commercialCatalog !== 72 || MODULE_COUNTS.childEngines !== 71 ||
    MODULE_COUNTS.serviceDeliveryEngines !== 4) {
  throw new Error("ARIA_MODULE_FAMILY_COUNTS_INVALID");
}

async function executeModule(moduleId, input, context) {
  const module = MODULE_BY_ID.get(moduleId);
  if (!module) throw new Error("ARIA_MODULE_NOT_FOUND");
  return module.execute(input, context);
}

module.exports = { MODULES, MODULE_BY_ID, MODULE_COUNTS, MANIFEST: declaredManifest, executeModule };
