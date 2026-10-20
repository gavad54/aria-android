# ARIA — Global AI Super App

> Repository bootstrap for the ARIA Android application. This commit initializes the empty GitHub repository; it does **not** contain the full ARIA 32 source package yet.

## Current release candidate

The current source package is named `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`. Its SHA-256 checksum is:

```
9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f
```

The package is available in the ChatGPT file/library workspace, but this GitHub integration supports creating UTF-8 text files and Git objects; it does not provide a local-file-to-repository binary upload operation. Therefore the ZIP has not been committed here.

## Required before a genuine Android build

1. Import the complete contents of the release ZIP into this repository (including `app/`, root Gradle files, backend, tests, and documentation).
2. Restore or generate a valid Gradle Wrapper and verify the configured Gradle/Android Gradle Plugin compatibility.
3. Configure Android SDK/build tools in CI.
4. Run unit tests and `assembleDebug`; then configure protected signing secrets for a release build.
5. Connect and validate real backend/payment/provider credentials separately; never commit secrets.

## Status

- Repository initialized: pending verification after first commit.
- Full source imported: **No**.
- Android APK/AAB built: **No**.
- Production deployment: **Not verified**.

Do not treat this repository as a release-ready app until the full source and successful build artifacts are present.
