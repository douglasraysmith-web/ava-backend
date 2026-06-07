# Ava Verified Live Deployment Runbook v7.8.1

## Truth status
This package is ready for verified deployment execution, but it is not a verified live deployment until the owner connects GitHub, Railway, Railway Postgres, Netlify/mtthorne.com routing, environment variables, and the live verification script passes against real URLs.

## Proper deployment channels
1. **GitHub** is the source-of-truth repository for Ava source, tests, migrations, docs, and predeploy checks.
2. **Railway** runs Ava's backend and Railway Postgres.
3. **Netlify / mtthorne.com** serves the public `/AV/AVA` route and points Ava's frontend to the verified backend.
4. **Owner approval** activates gated features only after demo review.

## Pre-deploy local proof
```bash
unzip AVAI_LIVE_DEPLOY_CHANNEL_v7_8_1.zip
cd AVAI_LIVE_DEPLOY_CHANNEL_v7_8_1
npm install --ignore-scripts
npm --prefix railway install --ignore-scripts
npm run predeploy
```

## GitHub channel
Commit the package contents to the selected Ava repository. The included `.github/workflows/ava-predeploy-check.yml` runs root checks, Railway checks, tests, smoke tests, secret scan, and package verification on push/pull request.

## Railway channel
- Create/connect a Railway service to the GitHub repo.
- Set the service root directory to `railway`.
- Add Railway Postgres.
- Add `DATABASE_URL` from Railway Postgres to the Ava backend service.
- Add `AVA_OWNER_TOKEN`, `AVA_ALLOWED_ORIGINS`, `OPENAI_API_KEY` only when public/provider use is approved.
- Keep customer/file/code/voice/payment/hardware/follow-up flags off first.
- Deploy and verify `/api/ava-health`, `/api/ava-readiness`, `/api/ava-live-proof`, and `/api/ava-visual-status`.

## Netlify / mtthorne.com channel
- Keep canonical public path `/AV/AVA`.
- Use `netlify.toml` and/or `public/_redirects` route rules.
- Set `public/ava-config.js` to point to the verified Railway backend when Railway is ready.
- Do not place secrets in public JavaScript.

## Live verification
After real URLs exist:
```bash
AVA_PUBLIC_VERIFY_URL=https://mtthorne.com/AV/AVA \
AVA_BACKEND_VERIFY_URL=https://your-railway-service.up.railway.app \
AVA_OWNER_TOKEN=your_owner_token_optional \
npm run verify:live
```

## Verified-live minimum proof
Ava may be called verified live only after all of these pass:
- Public `/AV/AVA` returns 200 and shows Ava.
- Long-answer controls exist.
- Railway `/api/ava-health` returns 200.
- Railway `/api/ava-readiness` returns 200.
- Railway `/api/ava-live-proof` returns 200.
- Owner routes reject missing token.
- Hardware control and payment remain false.
- Customer-data/file/code/voice/follow-up flags match owner approval state.
- No secret scan failures.
- Owner demo acceptance completed.
