# Ava GitHub + Railway + Netlify Execution Steps v7.8.1

## 1. GitHub
```bash
# inside the unzipped package root
git init
git add .
git commit -m "Prepare Ava verified live deployment channel v7.8.1"
git branch -M main
git remote add origin <YOUR_AVA_GITHUB_REPO_URL>
git push -u origin main
```

## 2. Railway
- New Railway project or service.
- Connect to the GitHub repo.
- Set root directory: `railway`.
- Add PostgreSQL.
- Add environment variables from `AVA_ENV_RAILWAY_v7_8_1.env.example`.
- Run migration after deploy: `npm run migrate:apply` in Railway shell or via one-off command.
- Verify `/api/ava-deploy-doctor`, `/api/ava-readiness`, `/api/ava-live-proof`.

## 3. Netlify / mtthorne.com
- Merge/copy `public/ava.html`, `public/ava-config.js`, `public/_redirects`, and `netlify.toml` route entries into the mtthorne.com site.
- Set public config to the verified Railway backend domain.
- Confirm `/AV/AVA` and `/ava` redirect behavior.

## 4. Owner demo
- Show public `/AV/AVA`.
- Test fast AV question.
- Test long-answer continuation.
- Test owner-gated route rejection without token.
- Confirm visible-being owner upload pending state.
- Owner decides activation flags.

## 5. Activation order
1. Public showroom route.
2. Fast supervisor runtime.
3. Provider-backed public chat.
4. Storage status and audit.
5. Customer retention only after consent/storage approval.
6. File retrieval.
7. Device/code bank.
8. Voice.
9. Follow-up draft queue.
10. Payment/account routing.
11. Hardware control last, if ever.
