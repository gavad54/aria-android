# ARIA 32 Android build input

Upload the exact source archive here before running the Android build workflow:

`release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

Expected SHA-256:

`6c67901ddaff48381c2c6ef957ee29460b4553704260838994df898fa2440d86`

The workflow verifies this checksum, provisions the Gradle Wrapper JAR with its own checksum verification, installs the Android SDK, runs the static gate, then attempts a debug APK and release AAB build. It uploads build outputs as a GitHub Actions artifact.

Do not upload signing keys, passwords, API secrets, or private production data in this folder. Release signing is intentionally not configured until protected repository secrets are set.


Release-gate fix in this archive: `scripts/release_preflight.sh` now accepts the checksum-verified project Gradle Wrapper in CI instead of incorrectly requiring a system-wide `gradle` executable. Static checks were rerun locally; Android compilation and live integrations still require the GitHub Actions build and production credentials.
