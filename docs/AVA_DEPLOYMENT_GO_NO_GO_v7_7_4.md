# AVA Deployment Go / No-Go v7.7.4

## Go for owner demo

- Package passes local checks.
- `/AV/AVA` route is present.
- Long-answer continuation is present.
- Railway backend passes smoke test.
- Secrets are not committed.
- Sensitive feature flags are off.
- Owner understands the difference between showroom, provider-enabled chat, database access, and live customer-data activation.

## No-go for public activation

- Missing model provider key.
- Missing owner token.
- Missing Railway backend URL.
- Database migration not verified.
- Public page exposes internal/private/source records.
- Long answers still cut off.
- Voice suggests a celebrity clone or strong country twang.
- Any route implies payment, hardware control, customer retention, or field-ready driver claims without verification.
