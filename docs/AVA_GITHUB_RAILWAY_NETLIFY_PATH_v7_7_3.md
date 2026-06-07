# Ava GitHub + Railway + Netlify Path v7.7.3

## Public route
`mtthorne.com/AV/AVA` is the customer-facing route.

## GitHub role
GitHub stores source code, tests, migration files, docs, and version history. The included workflow runs checks before deploy decisions.

## Railway role
Railway runs the backend service from the `railway/` folder. It can also host Railway Postgres for Ava's future business memory/data banks.

## Netlify / mtthorne.com role
Netlify can serve the public HTML/CSS/JS. It may either use the existing Netlify functions or call the Railway backend through `public/ava-config.js`.

## Recommended owner-pilot setup
Frontend: Netlify route `/AV/AVA`.
Backend: Railway public domain with CORS allowed for `https://mtthorne.com`.
Database: Railway Postgres added only when data-bank testing is approved.
Secrets: Railway Variables, not GitHub and not browser files.

## Why this is speed-efficient
The frontend can be deployed quickly without waiting for database activation. The backend can be tested independently on Railway. Feature flags let the owner approve one capability at a time instead of risking all systems at once.
