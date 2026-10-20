# ARIA — Global AI Super App

> ARIA 32 source-package status and repository bootstrap.

## Current release candidate

Source archive: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

SHA-256:

```
9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f
```

The source archive exists in the ChatGPT working workspace, but the full archive has **not** been imported into this repository. The current GitHub connection does not expose a direct local-file/binary upload action.

## Verification performed on the local source archive (2026-10-20)

- 11 selected JavaScript unit/gate scripts executed successfully.
- JavaScript syntax checks passed for 82 files under `backend/src`.
- `app/src/main/assets/aria_module_registry.json` parsed successfully and declares 639 modules.
- These checks are useful static/unit evidence, but they do not prove a production build, live integrations, or end-to-end behavior.

## Release blockers

1. Import all source files from the archive into this repository.
2. Restore or generate the Gradle Wrapper JAR (the wrapper properties and script alone are insufficient for a standalone wrapper).
3. Run the Android build in CI with Java 17, Android SDK platform 36 and build-tools 35.0.0.
4. Fix any compile/test failures discovered by the actual Android build.
5. Configure release signing through protected CI secrets, never committed to source control.
6. Verify backend/database, notifications, and any external provider integrations in a controlled test environment before production.

## Current status

| Item | Status |
|---|---|
| Repository scaffold (`README`, workflow, `.gitignore`) | Committed |
| Full ARIA 32 source imported to GitHub | **No** |
| Selected local static/unit checks | **Pass** |
| Android APK/AAB built and tested | **Not yet** |
| Release-signed app | **Not yet** |
| Production deployment and live integrations | **Not verified** |

Do not treat this repository as a release-ready app until the full source is present and the Android build and required integration tests pass.