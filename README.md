# ARIA — Global AI Super App

ARIA is a general-purpose AI super-app project. It is **not an accounting/ERP product**; that product is separate as ARIANA.

## Live web prototype

- Web URL: https://aria-web-production-12ba.up.railway.app
- Health endpoint: https://aria-web-production-12ba.up.railway.app/health
- Repository: https://github.com/gavad54/aria-android

The web service is deployed from the `main` branch through Railway. The latest source adds:
- Responsive Persian RTL mobile-first interface.
- `GET /health` and `GET /api/health` service checks.
- `GET /api/modules` module registry for the web prototype.
- `POST /api/plan` deterministic three-stage starter plan based on the user's text.
- `POST /api/intent` request validation for compatibility.
- Request-size limits, basic per-IP rate limiting, security headers, safe static-path resolution, and API smoke tests.
- GitHub Actions Node.js CI workflow at `.github/workflows/web-ci.yml`.

**Important:** `/api/plan` currently uses local rule-based templates, not a live AI model. User accounts, durable database, personal memory, multilingual voice, billing, notifications, provider integrations, and the Android app are not yet production-ready. Do not enter confidential information into the prototype.

## ARIA 32 source-package status

Source archive: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

Latest locally verified archive SHA-256:

```
4899f744d96a5258f1f17842775006557b97cdfa63686b6ea6b42938b7b57e64
```

The full archive has **not** been imported into this repository because the available GitHub connection does not expose a direct local-file/binary upload action.

## Verification performed on the local source archive (2026-10-20)

- Backend JavaScript syntax checks passed.
- 12 selected unit/contract/runtime gate scripts passed, including ARIA 32 execution, global super-app, product completeness, transaction liability, marketplace, owner growth, future core, and registry gates.
- Android/backend module registries match and both declare 639 modules for version 32.0.0.
- The old `verify_project.sh` was updated locally from stale v24/329-module expectations to v32/639 modules; `RELEASE_GATE.sh` now invokes it through Bash.
- The new `scripts/aria32_static_gate.sh` completed successfully on the local source package.

These checks are static/unit evidence only. They do not prove a production build, live integrations, or end-to-end behavior.

## Android release blockers

1. Import all source files from the archive into this repository.
2. Restore or generate the Gradle Wrapper JAR (the wrapper properties and script alone are insufficient for a standalone wrapper).
3. Run the Android build in CI with Java 17, Android SDK platform 36 and build-tools 35.0.0.
4. Fix any compile/test failures discovered by the actual Android build.
5. Configure release signing through protected CI secrets, never committed to source control.
6. Verify backend/database, notifications, and external provider integrations in a controlled test environment before production.

## Current status

| Item | Status |
|---|---|
| Web prototype deployed | Railway deployment reported successful; verify live access in browser |
| Rule-based planning API | Committed; deployment/CI verification in progress |
| API smoke tests + Node CI | Committed |
| Live AI model | Not connected |
| Authentication and durable database | Not implemented |
| Full ARIA 32 source imported to GitHub | **No** |
| Android APK/AAB built and tested | **Not yet** |
| Release-signed Android app | **Not yet** |
| Production integrations | **Not verified** |

Do not treat ARIA as a fully complete or release-ready product until the full source is present, live AI and secure persistence are configured, and Android and end-to-end tests pass.
