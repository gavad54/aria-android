# ARIA — Engineering Readiness Audit & Delivery Backlog

Audit date: 2026-11-07 UTC
Repository: https://github.com/gavad54/aria-android
Audit ref: `feature/aria-page-ai`
Scope: repository, web/API source, tests, workflows, documented Android source and Railway environment.
Evidence rule: a source file, green CI run, provisioned database, or historic deployment is not proof of a complete production capability.

## Executive decision

**Current release state: `WEB_PROTOTYPE / ANDROID_SOURCE_BLOCKED / COMMERCIAL_RELEASE_BLOCKED`.**

The repository currently contains a Node.js web prototype (`server.js`, `index.html`, `app.js`), a PostgreSQL-backed account/plan/page implementation, a catalogue of planned/prototype modules, and GitHub workflows. It does not contain the full Android application source. The current Railway ARIA project has a live PostgreSQL service but no live ARIA web service in the inspected production environment. A separate staged service points to the VAYRO repository and must not be accepted as an ARIA deployment.

The ARIA PAGE AI work is isolated in a draft PR. It must not be represented as released or merged.

## Evidence observed

- Repository default branch: `main`; PR #1 is open and draft.
- Feature branch at audit start: `a9c65cc2c24a219fea45e9ab7dc799d5b8d12185`; it is six commits ahead of `main` and not behind it.
- The web CI workflow runs Node syntax checking and a single API smoke-test file.
- The smoke test intentionally runs without a database or JWT secret; account registration is expected to return 503. It therefore does not test successful registration, login, database persistence, page CRUD, or cross-account isolation.
- The repository contains no `settings.gradle`, root `build.gradle`, `app/build.gradle`, Android manifest, Gradle wrapper, or imported Android source tree.
- `.github/workflows/android-build.yml` expects Android source files at repository root. `.github/workflows/aria-android-build.yml` expects `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` with a fixed SHA-256. The inspected `release-input` folder contains only its README, not the archive.
- `package.json` has no lockfile in the inspected tree. The web workflow uses `npm install`, not a lockfile-enforced `npm ci`.
- The source implements password hashing, short-lived signed bearer tokens, basic in-memory rate limiting, a PostgreSQL connection, AI-compatible text generation, and per-user SQL filters for saved plans/pages. These are foundations, not a complete identity, security, or commercial platform.
- The app's AI adapter falls back to rule-based content when no provider key is configured or the provider fails. The health route reports configuration flags, not successful model inference.
- The page builder stores drafts privately and offers editing/preview. Public publishing, custom domains, marketplace/advertising integrations, analytics, and payments are not implemented.
- Railway project `ARIA Web` (production) has a live PostgreSQL service and a 500 MB volume in region `iad`. The inspected environment has no live ARIA web service. It has a staged-create service whose source is `gavad54/zelmira-one-` on `brand/vayro-name-only` (VAYRO). Do not accept or deploy that staged patch as ARIA.
- Only the PostgreSQL deployment was observed as successful in the inspected Railway environment. The README's historic public URL and deployment status were not independently verified in this audit.

## Work performed in this audit branch

1. Added ARIA PAGE AI draft generation, authenticated private storage, owner-scoped edit/delete routes, and a Persian RTL mobile-first UI.
2. Added unauthenticated API regression checks for page listing/creation.
3. Moved the inline application JavaScript into same-origin `app.js`.
4. Tightened CSP from allowing inline scripts to `script-src 'self'`; inline styles remain allowed because the current UI still uses inline CSS/style attributes.
5. Added smoke assertions for CSP, external script delivery, and JavaScript MIME type.

The latest commit at the time of this document update must be re-read from GitHub before any merge or release. CI results must match that exact head SHA.

## Prioritized delivery backlog

Status values: **BLOCKED** = cannot proceed until prerequisite evidence/source is supplied; **NOT STARTED** = no implementation evidence; **PARTIAL** = some source exists, but acceptance criteria are not met.

| ID | Priority | Owner role | Work item | Status | Acceptance evidence |
|---|---|---|---|---|---|
| ARIA-001 | P0 | CTO / Product | Freeze one authoritative product scope and module status registry; keep ARIA separate from ARIANA accounting/ERP and from VAYRO/LEADORA | PARTIAL | Approved scope, canonical registry, no cross-product data or service reuse |
| ARIA-002 | P0 | Android lead | Recover/import the exact approved Android source archive and verify its SHA-256; reconcile source package with repository | BLOCKED | Archive checksum verified, source inventory and license review |
| ARIA-003 | P0 | Android / CI | Restore Gradle Wrapper, pin JDK/SDK/toolchain, compile debug and release artifacts | BLOCKED | Same-commit Gradle build, unit tests, APK/AAB artifacts |
| ARIA-004 | P0 | Android / QA | Install and run the built app on at least one real Android device; verify login, navigation, offline/error states and API compatibility | BLOCKED | Device/model/OS test record, screenshots/logs, no critical crash |
| ARIA-005 | P0 | Cloud / DevOps | Resolve ARIA Railway topology without touching staged VAYRO resources; provision/attach an ARIA web service only after config review | BLOCKED | Correct ARIA repo+branch service, healthcheck, deployment SHA, rollback path |
| ARIA-006 | P0 | Database | Establish versioned SQL migrations; remove runtime schema creation from app startup; reconcile current Postgres catalog before migration | PARTIAL | Schema diff, migration test on disposable DB, applied migration record |
| ARIA-007 | P0 | Database / SRE | Verify automated backup and independent restore from the production volume/database | NOT STARTED | Timestamped backup outside the same failure domain and successful isolated restore |
| ARIA-008 | P0 | Security | Replace spoofable/untrusted X-Forwarded-For handling with an explicit trusted-proxy model; move rate limits to shared storage and apply per-IP/per-account/per-route policies | PARTIAL | Proxy-chain tests, multi-instance tests, abuse and lockout tests |
| ARIA-009 | P0 | Security / Backend | Add account lifecycle controls: email verification, password reset, session revocation, account deletion, disabled-account enforcement, and MFA for privileged roles | NOT STARTED | End-to-end identity tests and recovery/audit evidence |
| ARIA-010 | P0 | Security / Backend | Harden session architecture; prefer Secure HttpOnly SameSite cookies or a documented token threat model; prevent stale tokens from accessing disabled accounts | PARTIAL | Cookie/token review, XSS/CSRF tests, revocation tests |
| ARIA-011 | P0 | Security / Frontend | Complete CSP without inline script allowance (done in branch); remove inline styles or adopt nonce/hash policy; add HSTS at the correct TLS edge | PARTIAL | CSP report-only rollout, browser tests, no blocked required assets |
| ARIA-012 | P0 | Backend / QA | Add DB-backed integration tests for registration/login, plans and page CRUD, disabled users, user A/B isolation, malformed JSON and concurrent requests | NOT STARTED | Disposable PostgreSQL CI service and deterministic passing test suite |
| ARIA-013 | P0 | Backend / AI | Add per-user quotas, provider timeouts, concurrency caps, spend limits, usage metering and safe fallback for all AI endpoints | PARTIAL | Cost-limit tests, quota exhaustion tests, provider outage tests |
| ARIA-014 | P1 | AI / Safety | Establish content policy, prompt-injection boundaries, output schema validation, abuse controls and human approval for external actions | PARTIAL | Adversarial tests, moderation policy, audit trail; no autonomous publishing |
| ARIA-015 | P1 | Product / UX | Complete ARIA PAGE AI: page templates, responsive preview, accessibility, SEO metadata, save/version history, draft preview links and explicit publish/unpublish | PARTIAL | Mobile/browser UAT and end-to-end lifecycle test |
| ARIA-016 | P1 | Backend / Product | Build publishing service with ownership, slug uniqueness, visibility, expiry, rate limiting and custom-domain verification | NOT STARTED | Public page access tests, tenant isolation and domain ownership proof |
| ARIA-017 | P1 | Product / Integrations | Connect page forms to a consent-aware lead inbox/CRM; add spam protection and data retention controls | NOT STARTED | Consent UX, anti-spam tests, export/delete workflow |
| ARIA-018 | P1 | Analytics | Add privacy-conscious page analytics: views, CTA clicks, conversion events, bot filtering and retention limits | NOT STARTED | Event integrity tests and privacy review |
| ARIA-019 | P1 | Finance / Backend | Implement subscriptions/credits only after cost model; payment sandbox, signed webhooks, idempotency, refunds and reconciliation | NOT STARTED | Full sandbox transaction lifecycle and financial reconciliation |
| ARIA-020 | P1 | Product / Legal | Publish terms, privacy notice, cookie/analytics disclosures, AI-generated content disclosure, acceptable-use and complaint/takedown process | NOT STARTED | Legal review for launch markets; GDPR review where applicable |
| ARIA-021 | P1 | DevSecOps | Add lockfile, `npm ci`, dependency audit, secret scanning, CodeQL/SAST, SBOM and pinned third-party actions | PARTIAL | Required CI checks on exact release SHA |
| ARIA-022 | P1 | SRE | Add structured logs, metrics, tracing, uptime/error alerts, database saturation alerts and documented rollback drill | NOT STARTED | Alert test and rollback exercise |
| ARIA-023 | P1 | QA / UAT | Build a release test matrix for web/mobile, RTL, keyboard/screen reader, slow network, browser compatibility and accessibility | NOT STARTED | Signed UAT checklist with zero open critical/high defects |
| ARIA-024 | P2 | Product / Revenue | Launch staged pricing only after measured AI/storage/payment costs; distinguish free, creator, business and team plans | NOT STARTED | Unit economics, price experiment and clear usage caps |
| ARIA-025 | P2 | Support / Operations | Admin/support console, abuse reports, account actions, audit search, incident playbooks and customer support workflow | NOT STARTED | Role-based admin tests and incident simulation |
| ARIA-026 | P2 | Product / Architecture | Reconcile the 639-module Android registry, older 369-module inventory, and web catalogue into one canonical versioned registry | BLOCKED | Full source imported, duplicate mapping, generated registry parity tests |

## Security findings requiring explicit remediation

1. **Rate-limit trust boundary:** current code reads the first `X-Forwarded-For` value without a trusted-proxy boundary. A caller may spoof it. The in-memory map also resets on restart and is not shared across replicas.
2. **Identity lifecycle:** no email verification, password reset, MFA, session revocation or deletion flow is present in the inspected source.
3. **Disabled-account enforcement:** JWT validation alone does not re-check account status on every protected route; a previously issued token can remain usable until expiry unless route-level checks revoke it.
4. **Authentication persistence:** the browser stores the bearer token only in page memory, so reload loses the session; this is a usability limitation, not a secure session lifecycle.
5. **Runtime schema mutation:** the server creates tables/indexes at application startup. Production schema changes should be controlled, reviewed migrations with backups and rollback plans.
6. **AI cost/abuse:** the shared per-IP limiter is not a substitute for account quotas, spend caps, concurrency control, or per-feature budgets.
7. **CSP:** branch now blocks inline scripts, but still permits inline styles; CSP must be validated in real browsers before tightening further.
8. **Error handling/observability:** logs are basic console messages; no structured audit events, trace correlation, alerting, or operational dashboards were evidenced.

## Release gates

A public commercial release is blocked until all P0 rows are complete and verified on the exact release commit. Android release additionally requires official signing configured through protected CI secrets, artifact checksum, device installation evidence, and store metadata review. A successful Node CI run is not a release gate for Android, payments, production database, or live AI.

## Safe operating boundaries

- Do not merge PR #1 or deploy this branch without a separate release approval.
- Do not accept the currently staged Railway patch: it creates a VAYRO service from a different repository and branch.
- Do not mutate the live PostgreSQL schema/data or apply migrations before independent backup and restore evidence.
- Do not put API keys, signing keys, passwords, or private customer data in source control or chat.
- Do not display planned modules as operational.
- Keep ARIA free of accounting/ERP features; those belong to the separate ARIANA product.
