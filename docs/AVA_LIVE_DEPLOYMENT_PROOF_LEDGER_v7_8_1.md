# Ava Live Deployment Proof Ledger v7.8.1

Use this ledger during real deployment. Do not mark a row PASSED until it is tested against the actual live route/service.

| Proof Item | Expected Result | Status | Evidence |
|---|---|---:|---|
| GitHub repo selected | Ava source committed to correct repo | UNPROVEN |  |
| GitHub Actions | Predeploy workflow passes | UNPROVEN |  |
| Railway service | Backend deploys from GitHub `railway/` root | UNPROVEN |  |
| Railway Postgres | Database provisioned and `DATABASE_URL` available | UNPROVEN |  |
| Migration | `npm --prefix railway run migrate:apply` succeeds | UNPROVEN |  |
| Railway health | `/api/ava-health` returns 200 | UNPROVEN |  |
| Railway readiness | `/api/ava-readiness` returns 200 | UNPROVEN |  |
| Live proof | `/api/ava-live-proof` returns 200 | UNPROVEN |  |
| Visual status | `/api/ava-visual-status` returns owner-upload pending or approved state | UNPROVEN |  |
| Public route | `https://mtthorne.com/AV/AVA` returns 200 | UNPROVEN |  |
| Long answer protection | Continue/copy/download controls visible | UNPROVEN |  |
| Owner gate | Owner route rejects missing token | UNPROVEN |  |
| Secrets | No secret appears in public files, logs, or repo | UNPROVEN |  |
| Customer data | Disabled unless approved secure storage is active | UNPROVEN |  |
| Hardware control | False / blocked | UNPROVEN |  |
| Payment | False / blocked | UNPROVEN |  |
| Owner acceptance | Owner sees Ava and decides activation | UNPROVEN |  |
