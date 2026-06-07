# AVA Deployment Prep Runbook v7.7.3

## Goal
Prepare Ava for owner-reviewed deployment at `mtthorne.com/AV/AVA` without falsely activating private files, customer retention, payments, or hardware control.

## Recommended stack

- GitHub: source control, version history, pull request checks.
- Netlify / mtthorne.com: public static frontend and canonical route `/AV/AVA`.
- Railway: Ava backend runtime, protected environment variables, optional Railway Postgres database.
- Railway Postgres: future customer/project/device/source/code/file/correction banks after owner approval.

## Deployment sequence

1. Create or choose the GitHub repository for Ava.
2. Commit this package exactly as the current deploy-prep candidate.
3. Run local checks: `npm run check`, `npm test`, `npm --prefix railway run check`, `npm --prefix railway test`.
4. Connect the GitHub repository to Railway and deploy the `railway/` backend service.
5. Add Railway environment variables from `AVA_ENV_RAILWAY_v7_7_3.env.example` in Railway Variables. Keep feature flags false at first.
6. Add Railway Postgres only after the owner approves data-bank testing. Run `railway/migrations/001_ava_core_railway_postgres.sql` against the Railway database.
7. Edit `public/ava-config.js` so `window.AVA_API_BASE` points to the Railway backend domain, or leave it blank if Netlify functions are used.
8. Deploy the public frontend to mtthorne.com with `/AV/AVA` as the canonical visitor route.
9. Test: health route, public showroom question, owner-gated question, long-answer continuation, voice-disabled behavior, file/device/customer-data blocking.
10. Only after the owner sees Ava, decide which feature flags to activate.

## First activation order

1. Public showroom / safe AV guidance.
2. Provider dispatch for public questions.
3. Owner-only device/source bank lookup.
4. Owner-only file metadata retrieval.
5. Customer record retention after privacy/consent approval.
6. Follow-up drafting.
7. Payment/account workflows.
8. Hardware control last, only through a separate tested gateway.

## Never claim active until verified

- live deployment
- customer-data retention
- payment/account system
- hardware control
- file retrieval
- device/code bank live access
- field-ready drivers/protocols
