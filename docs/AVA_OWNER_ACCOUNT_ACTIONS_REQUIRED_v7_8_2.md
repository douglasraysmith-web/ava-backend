# AVA v7.8.2 Owner Account Actions Required

These actions cannot be completed inside this chat because they require your actual accounts, dashboards, secrets, and deployment approval.

## GitHub
- Create or choose the Ava repository.
- Upload/commit the v7.8.2 package files.
- Confirm the GitHub Actions check runs.
- Copy the commit SHA into the live proof ledger.

## Railway
- Create a Railway project/service from the GitHub repo.
- Set the root directory to `railway/` if Railway asks for the service root.
- Add Railway Postgres.
- Add the environment variables from `AVA_ENV_RAILWAY_v7_8_2.env.example`.
- Deploy the backend.
- Run `npm run migrate:apply` after `DATABASE_URL` exists.
- Copy the Railway URL into `AVA_BACKEND_VERIFY_URL` for proof tests.

## Netlify / mtthorne.com
- Integrate the public Ava files into the mtthorne.com AV route.
- Preserve canonical path: `/AV/AVA`.
- Set `public/ava-config.js` to the Railway backend URL.
- Confirm `/AV/AVA` loads from the live site.
- Keep all sensitive routes gated until owner approval.

## Provider keys
- Add `OPENAI_API_KEY` server-side only in Railway variables if public model dispatch is approved.
- Do not place provider keys in GitHub, public JavaScript, Netlify static files, or chat.

## Visual being
- Owner uploads the desired Ava appearance later.
- Until approved, keep the owner-upload-pending visual status.
