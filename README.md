# ARIA — Global AI Super App

ARIA is a general-purpose AI super-app project. It is **not an accounting/ERP product**; that product is separate as ARIANA.

## Web prototype

- Web URL: https://aria-web-production-12ba.up.railway.app
- Health endpoint: https://aria-web-production-12ba.up.railway.app/health
- Repository: https://github.com/gavad54/aria-android

Current source includes a Persian RTL mobile-first web interface, a Node.js API, rule-based starter plans, an optional OpenAI-compatible chat-completions adapter, PostgreSQL-backed account and plan storage, password hashing, signed short-lived bearer tokens, and API smoke tests. GitHub Actions checks JavaScript syntax and runs Node tests.

### Implemented API routes

- `GET /health`, `GET /api/health`: service and integration configuration status.
- `GET /api/modules`: prototype module registry.
- `POST /api/plan`: creates a three-stage plan. If `OPENAI_API_KEY` is configured, the server attempts an OpenAI-compatible API call; on provider failure it returns a clearly labeled rule-based fallback. If no key is configured, the plan is rule-based.
- `POST /api/intent`: validates and acknowledges a request.
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`: email/password account flows. Passwords are hashed with bcrypt; bearer tokens are signed with `ARIA_JWT_SECRET` and expire after two hours.
- `GET /api/plans`: lists up to 50 plans belonging to the authenticated user.
- Authenticated `POST /api/plan` calls save the plan under that account; unauthenticated plans are not persisted.

### Required runtime configuration

- `DATABASE_URL`: PostgreSQL connection URL.
- `ARIA_JWT_SECRET`: strong random secret, supplied through Railway variables, never committed to Git.
- `OPENAI_API_KEY`: optional provider key to enable live AI; no key is included in source.
- `OPENAI_BASE_URL` and `OPENAI_MODEL`: optional provider/model overrides.
- `DATABASE_SSL=true`: enables TLS mode for a database that uses a self-signed certificate. Validate the provider's TLS configuration before production use.

The PostgreSQL service has been provisioned in the Railway project, and the web service has been configured to reference its `DATABASE_URL`. Confirm the latest deployment and `/api/health` before treating database connectivity as operational. Never enter a real provider key in source code or chat.

## Important limitations

This is an early web prototype, not a completed global super-app. Email verification, password reset, MFA, abuse monitoring beyond basic rate limiting, full privacy/legal review, durable audit trails, payments, notifications, voice, multilingual production UX, agent orchestration, external integrations, and the Android app/release package are not yet complete. The AI adapter cannot provide live AI until a valid provider key is configured in the hosting environment. Account and saved-plan endpoints require the database and JWT secret to be configured and verified.

## ARIA 32 source-package status

Source archive: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

Latest locally reported archive SHA-256:

```
4899f744d96a5258f1f17842775006557b97cdfa63686b6ea6b42938b7b57e64
```

The full archive has **not** been imported into this repository because the available GitHub connection does not expose a direct local-file/binary upload action. The archive is also not currently present in the active local execution workspace, so its contents cannot be imported or independently reverified in this turn.

## Prior static checks on the source archive (reported 2026-10-20)

- Backend JavaScript syntax checks passed.
- 12 selected unit/contract/runtime gate scripts passed.
- Android/backend module registries reportedly match at 639 modules for version 32.0.0.
- Static checks do not prove a production build, live integrations, or end-to-end behavior.

## Android release blockers

1. Import the full source archive into the repository.
2. Restore or generate the Gradle Wrapper JAR.
3. Run Android build with Java 17, Android SDK platform 36 and build-tools 35.0.0.
4. Fix compile/test failures found by the real build.
5. Configure release signing through protected CI secrets.
6. Verify database, AI provider, notifications, and external integrations in a controlled environment.

## Status

| Item | Status |
|---|---|
| Web UI and starter-plan API | Implemented in repository |
| PostgreSQL service | Provisioned; connectivity must be verified |
| Account and private plan API | Implemented in source; runtime configuration/testing pending |
| Live AI | Adapter implemented; provider key not configured/verified |
| Automated Node.js tests | Committed; latest run must pass before release |
| Full ARIA 32 source imported | No |
| Android APK/AAB built and tested | No |
| Signed Android release | No |
| Production-grade global super-app | Not complete |

Do not treat ARIA as release-ready until the full source is present, CI and live integration tests pass, and the Android release has been built, tested, signed, and reviewed.
