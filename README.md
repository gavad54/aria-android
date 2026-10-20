# ARIA — Global AI Super App

> ARIA 32 source-package status and repository bootstrap.

## Current release candidate

Source archive: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

Latest locally verified archive SHA-256:

```
4899f744d96a5258f1f17842775006557b97cdfa63686b6ea6b42938b7b57e64
```

The archive includes a refreshed static verification script and a Persian execution audit. The full archive has **not** been imported into this repository because the available GitHub connection does not expose a direct local-file/binary upload action.

## Verification performed on the local source archive (2026-10-20)

- Backend JavaScript syntax checks passed.
- 12 selected unit/contract/runtime gate scripts passed, including ARIA 32 execution, global super-app, product completeness, transaction liability, marketplace, owner growth, future core, and registry gates.
- Android/backend module registries match and both declare 639 modules for version 32.0.0.
- The old `verify_project.sh` was updated locally from stale v24/329-module expectations to v32/639 modules; `RELEASE_GATE.sh` now invokes it through Bash.
- The new `scripts/aria32_static_gate.sh` completed successfully on the local source package.

These checks are static/unit evidence only. They do not prove a production build, live integrations, or end-to-end behavior.

## Release blockers

1. Import all source files from the archive into this repository.
2. Restore or generate the Gradle Wrapper JAR (the wrapper properties and script alone are insufficient for a standalone wrapper).
3. Run the Android build in CI with Java 17, Android SDK platform 36 and build-tools 35.0.0.
4. Fix any compile/test failures discovered by the actual Android build.
5. Configure release signing through protected CI secrets, never committed to source control.
6. Verify backend/database, notifications, and external provider integrations in a controlled test environment before production.

## Current status

| Item | Status |
|---|---|
| Repository scaffold (`README`, workflow, `.gitignore`) | Committed |
| Full ARIA 32 source imported to GitHub | **No** |
| Local static/unit gates | **Pass** |
| Android APK/AAB built and tested | **Not yet** |
| Release-signed app | **Not yet** |
| Production deployment and live integrations | **Not verified** |

Do not treat this repository as a release-ready app until the full source is present and the Android build and required integration tests pass.