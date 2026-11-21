# ARIA engineering recovery baseline
Date: 2026-11-21

## Preservation baseline
- Canonical module registry: 639 unique module IDs. This is a catalog/registry count, not proof that 639 modules are operational.
- Historical overlays and source lineage must remain preserved through explicit crosswalks; no module or identifier is removed solely to simplify counts.
- ARIA remains free of accounting and ERP capabilities; those belong to the independent ARIANA product.
- Product-boundary moves require source/target ownership, API contract, migration mapping, and regression evidence.

## Repository evidence
- Pull request: #3
- Branch: `engineering/aria-preserve-all-capabilities-2026-11-19`
- Verified head: `7324beccaa3128e7cbac42fbf3fd73c44fcaee70`
- PR state at verification: open, draft, unmerged.
- ARIA CI run 44888433229: completed successfully.
- ARIA web catalog CI run 44888433274: completed successfully.
- Both runs correspond to the verified head above.

## Recovered source artifacts
- Repaired v32.0.0 source candidate: `ARIA_32.0.0_SOURCE_CANDIDATE_REPAIRED_2026-11-19.zip`
- SHA-256: `9d1e40acdb197de22c69c64336f5e3e0f4951a227ab28de443d73fc111375284`
- ZIP integrity check passed; 505 archive entries.
- Isolated source verification passed: project verifier, R9 static gate, 639-module capability matrix, schema static validation, JavaScript and Java syntax checks, and no-loss gate.
- Static schema inventory: 201 tables. Live PostgreSQL validation was not run because a database runtime was unavailable.
- The recovered candidate is a reference baseline, not permission to overwrite the newer PR branch.

## Adapter truth and unresolved inventory
- Current recovered adapter requirement mapping: 191 rows (160 required, 31 conditional).
- These rows are requirements, not 191 completed integrations.
- 14 shared adapter families are candidates only; no external providers were selected in that mapping.
- The historical exact 183-adapter inventory was not located in the searched archive/library and GitHub material.
- Provider implementation, sandbox verification, end-to-end verification, and production approval remain unproven.
- The 81 engine-host mappings are proposed host candidates, not verified runtime hosts.

## Production blockers
- Live PostgreSQL migration and restore validation.
- External provider credentials and sandbox/E2E evidence.
- Payment provider integration and settlement/reconciliation tests.
- Signed Android artifact, device installation, and end-to-end acceptance.
- Production deployment, monitoring, backup encryption, restore drill, and rollback evidence.

## Next gates
1. Compare v32 candidate to the current PR tree with a no-loss file/module/contract diff before importing anything.
2. Preserve all current newer files and IDs; only additive, reviewable changes are permitted.
3. Turn each adapter requirement into a bounded domain contract, then implement a provider only when a real supported provider and credentials are available.
4. Add contract tests, failure-mode tests, idempotency tests, and sandbox evidence per provider.
5. Do not mark modules active or revenue-producing until external execution and end-to-end evidence exist.

This document is documentation-only and does not claim production activation.
