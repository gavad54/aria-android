# ARIA 32 Android build input

Upload the exact source archive here before running the Android build workflow:

`release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

Expected SHA-256:

`4899f744d96a5258f1f17842775006557b97cdfa63686b6ea6b42938b7b57e64`

The workflow verifies this checksum, provisions the Gradle Wrapper JAR with its own checksum verification, installs the Android SDK, runs the static gate, then attempts a debug APK and release AAB build. It uploads build outputs as a GitHub Actions artifact.

Do not upload signing keys, passwords, API secrets, or private production data in this folder. Release signing is intentionally not configured until protected repository secrets are set.
