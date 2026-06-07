# Ava v7.7.5 GitHub Push Checklist

- [ ] Package extracted cleanly.
- [ ] No duplicate stale package folder is being committed by mistake.
- [ ] `.env` files with real secrets are not committed.
- [ ] `.env.example` files contain placeholders only.
- [ ] `npm install` completed at root.
- [ ] `npm --prefix railway install` completed.
- [ ] `npm run predeploy` passed locally.
- [ ] GitHub Actions workflow present at `.github/workflows/ava-predeploy-check.yml`.
- [ ] Commit message identifies Ava v7.7.5 deployment execution package.
- [ ] Push to selected owner repo.

Recommended repo name: `ava-av-site` or `mtthorne-ava-av`.
