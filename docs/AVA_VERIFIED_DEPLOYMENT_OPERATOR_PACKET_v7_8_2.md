# AVA v7.8.2 Verified Deployment Operator Packet

## Purpose
This packet turns Ava from **package-ready** into **live-verification ready**. It does not claim deployment. It tells the owner/operator exactly what must happen in GitHub, Railway, and mtthorne.com / Netlify, and what proof must be collected before Ava can be called verified live.

## Current live target
- Public route: `https://mtthorne.com/AV/AVA`
- Backend: Railway service URL, configured after Railway deployment
- Source control: GitHub repo chosen by owner
- Database: Railway Postgres, with Ava migration applied before customer/file/code-bank activation
- Visual being: owner-uploaded appearance pending; placeholder/status presence only

## Deployment phases

### Phase 1 — GitHub source control
1. Create or select the Ava repo.
2. Commit the full v7.8.2 package contents.
3. Push to `main` or approved branch.
4. Confirm GitHub Actions predeploy check passes.

Required proof:
- Repo URL
- Branch
- Commit SHA
- CI status

### Phase 2 — Railway backend
1. Create Railway project or service from the GitHub repo.
2. Set service root directory to `railway/` if using monorepo mode.
3. Add Railway Postgres.
4. Set environment variables from `AVA_ENV_RAILWAY_v7_8_2.env.example`.
5. Deploy backend.
6. Run migration: `npm run migrate:apply` from Railway shell or one-off command.
7. Visit `/api/ava-health`, `/api/ava-readiness`, `/api/ava-live-proof`.

Required proof:
- Railway service URL
- Health JSON
- Readiness JSON
- Live proof JSON
- DB/migration status

### Phase 3 — mtthorne.com / Netlify route
1. Place `public/ava.html`, `public/ava-config.js`, and route rules into the mtthorne.com Netlify site.
2. Set `window.AVA_API_BASE` in `public/ava-config.js` to the Railway backend URL after backend proof.
3. Confirm `/AV/AVA` loads Ava.
4. Confirm `/ava` redirects to `/AV/AVA`.
5. Confirm long-answer viewer, continue, copy, and download controls are visible.

Required proof:
- Public page URL
- Screenshot or page status
- Long-answer controls found
- Backend API base configured correctly

### Phase 4 — Owner demo gate
1. Owner sees Ava in public-safe mode first.
2. Owner tests simple questions, troubleshooting, planning, and driver/source lookup planning.
3. Owner confirms visible-being placeholder is acceptable until final upload.
4. Owner decides whether to activate public provider dispatch.
5. Owner does not activate customer data, file retrieval, code bank, voice, payment, hardware control, or follow-up until separate proof.

## Hard rule
Ava is **verified live** only after `npm run verify:live` or `npm run proof:collect` passes against actual deployed URLs and the owner-demo decision record is complete.
