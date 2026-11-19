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
const ids = MODULES.map(module => module.manifest.moduleId);
if (new Set(ids).size !== ids.length) throw new Error("ARIA_MODULE_ID_COLLISION");
const MODULE_BY_ID = new Map(MODULES.map(module => [module.manifest.moduleId, module]));

async function executeModule(moduleId, input, context) {
  const module = MODULE_BY_ID.get(moduleId);
  if (!module) throw new Error("ARIA_MODULE_NOT_FOUND");
  return module.execute(input, context);
}

module.exports = { MODULES, MODULE_BY_ID, executeModule };
