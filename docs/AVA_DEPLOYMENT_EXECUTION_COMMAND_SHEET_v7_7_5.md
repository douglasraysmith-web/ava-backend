# Ava v7.7.5 Deployment Execution Command Sheet

Truth status: this sheet prepares deployment. It does not prove live deployment until the commands are run in the owner accounts and the endpoints are verified.

## 1. Local final check

```bash
cd <ava-repo>
npm install
npm --prefix railway install
npm run predeploy
```

Expected: all checks pass. Do not continue if secret scan or tests fail.

## 2. GitHub commit

```bash
git status
git add .
git commit -m "Prepare Ava v7.7.5 deployment execution package"
git push origin main
```

## 3. Railway service

Preferred Railway setup:
- Deploy from the GitHub repo.
- Use the `railway/` directory as the backend service root.
- Add Railway Postgres to the project.
- Confirm `DATABASE_URL` is available to the backend service.

Railway CLI path if used:

```bash
cd railway
railway login
railway link
railway up
```

## 4. Railway variables

Start safe:

```text
AVA_MODE=owner_pilot
AVA_PUBLIC_BASE_URL=https://mtthorne.com/AV/AVA
AVA_ALLOWED_ORIGINS=https://mtthorne.com,https://www.mtthorne.com
AVA_OWNER_TOKEN=<create strong owner token>
AVA_ENABLE_PUBLIC_CHAT=false
AVA_ENABLE_CUSTOMER_DATA=false
AVA_ENABLE_FILE_RETRIEVAL=false
AVA_ENABLE_CODE_BANK=false
AVA_ENABLE_VOICE=false
AVA_ENABLE_FOLLOWUP_DRAFTS=false
AVA_ALLOW_PAYMENT=false
AVA_ALLOW_HARDWARE_CONTROL=false
```

Provider variables are optional until owner-approved public AI:

```text
OPENAI_API_KEY=<server-side only>
OPENAI_MODEL=<approved model>
```

## 5. Apply database migration

After Railway Postgres attaches `DATABASE_URL`:

```bash
cd railway
npm run migrate:apply
```

Then open:

```text
https://<railway-service>/api/ava-readiness
https://<railway-service>/api/ava-deploy-doctor
```

## 6. Netlify / mtthorne.com frontend

Set `public/ava-config.js` to the verified Railway backend URL only after the Railway health/readiness routes pass.

Canonical route remains:

```text
https://mtthorne.com/AV/AVA
```

## 7. Owner demo

Run the owner demo before activating public AI, data retention, private files, code bank, voice, payment/account workflows, hardware control, or automatic follow-up.
