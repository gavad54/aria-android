# ARIA 32 Android build input

Upload exactly this candidate archive into this directory before running the Android build workflow:

- Filename: ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip
- Expected SHA-256: 0c45fb175fa6d44456ce33af5c975a2d74576096fae37aa4993a213759a5dbe8

The workflow verifies this exact checksum, extracts the archive, provisions the Gradle Wrapper JAR, installs Android SDK packages, installs backend dependencies, runs the current ARIA 32.0.0 static/contract gates, then attempts the debug APK and release AAB build. Build outputs are uploaded as a GitHub Actions artifact.

Do not upload signing keys, passwords, API secrets or private production data here. No production deployment or external payment is triggered by this workflow.

The original Library archive has a different checksum and contains a versionCode mismatch; use only the repaired candidate linked in the current conversation.
