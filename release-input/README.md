# ARIA 32 Android build input

Upload the exact source archive here before running the Android build workflow:

`release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

Expected SHA-256:

`75c9826bd5de01f84d0429addeb49639a432006624b30a378581c349c3186f03`

The workflow verifies this checksum, provisions the Gradle Wrapper JAR with its own checksum verification, installs the Android SDK, runs the static gate, then attempts a debug APK and release AAB build. It uploads build outputs as a GitHub Actions artifact.

Do not upload signing keys, passwords, API secrets, or private production data in this folder. Release signing is intentionally not configured until protected repository secrets are set.


Release-gate fixes in this archive: the current release gate no longer invokes the obsolete ARIA 23.1 checks; it uses the ARIA 32 static gate. The source preflight no longer incorrectly requires system-wide Gradle, and the backend now has a standard `npm test` command that runs the quality/static gates. The workflow uses Node.js 22.14.0 and runs `npm test`. Static tests passed locally; Android compilation, release signing, deployment, and live integrations remain unverified until the GitHub Actions build runs.
