# ARIA 32 Android build input

Upload the repaired, independently verified candidate archive to this directory before running the Android build workflow:

- Filename: ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip
- Expected SHA-256: 270c7abbee1e96ec466d7a2a906aab98943ebe3c015b4abb4e0b6b3ab8e5b8bf
- Original Library archive SHA-256 (do not upload as candidate): 9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f

The candidate preserves all 639 source registry IDs and adds a no-loss regression gate with a pinned ID-set digest. It also applies isolated readiness repairs: registry versionCode parity, 32.0.0/639 source verification, migration ordering through 041, and a bounded API executor gate. Static readiness, project, R9, no-loss, registry parity, and schema-source checks passed in the isolated workspace.

The workflow verifies the exact candidate checksum, provisions the Gradle Wrapper JAR, installs Android SDK packages, installs backend dependencies, runs static/contract gates, and attempts debug APK and release AAB builds. The candidate is not a signed release and is not proof of live integrations or Production readiness.

Do not upload signing keys, passwords, API secrets or private production data here. No production deployment or external payment is triggered by this workflow.
