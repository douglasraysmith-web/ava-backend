# AVA v7.7.4 — 3-Day Deployment Command Center

Truth status: this package is deployment-prep and owner-demo ready. It is not a verified live deployment until GitHub, Railway, the database migration, environment variables, Netlify route, and owner-demo checks pass in the real accounts.

## Goal

Prepare Ava for a controlled owner demo at `mtthorne.com/AV/AVA`, with Railway as the preferred backend, GitHub as the source-of-truth repository, and all sensitive systems gated until the owner approves.

## Day 1 — Repository and backend

1. Create or choose the GitHub repository for Ava.
2. Commit this package exactly as a repo root.
3. Create a Railway project.
4. Add a Railway service from the GitHub repo and set the service root directory to `railway`.
5. Add Railway Postgres.
6. Set the Railway variables from `AVA_ENV_RAILWAY_v7_7_4.env.example`.
7. Keep these OFF: public chat, customer data, file retrieval, code bank, voice, payment, hardware control, automatic follow-up.
8. Run the Railway backend and confirm `/health` and `/api/ava-readiness` respond.

## Day 2 — Database and public route

1. Run `railway/migrations/001_ava_core_railway_postgres.sql` against Railway Postgres.
2. Confirm `/api/ava-readiness` shows database tables available.
3. Deploy or merge the public Ava frontend to the AV side of mtthorne.com.
4. Confirm the public path is `/AV/AVA`.
5. Set `public/ava-config.js` to the Railway backend URL only after Railway health passes.
6. Test long-answer continuation, copy, download, and voice-disabled behavior.

## Day 3 — Owner demo and activation decisions

1. Run the owner demo script.
2. Confirm the owner can see Ava answer AV questions, handle long answers, and refuse gated actions correctly.
3. Demonstrate owner-token protected routes.
4. Demonstrate device/code bank in lookup-plan mode first.
5. Do not enable customer data until privacy, consent, retention, and storage rules are approved.
6. Do not enable payment or hardware control.
7. Record owner decisions in an activation record.

## Activation order

1. Public showroom at `/AV/AVA`.
2. Owner-token verification.
3. Model provider for public chat.
4. Railway Postgres migration and source/device test records.
5. Device/code bank lookup.
6. Private/owner file metadata retrieval.
7. Customer records only after privacy approval.
8. Follow-up draft queue only after owner approves wording and timing.
9. Payment/account workflows later.
10. Hardware control last, and only through a separate audited gateway.
