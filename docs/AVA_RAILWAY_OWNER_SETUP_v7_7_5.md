# Ava v7.7.5 Railway Owner Setup

## Service role
Railway hosts Ava's backend API and Postgres database. Netlify/mtthorne.com remains the public meeting point at `/AV/AVA`.

## Backend service
Create a Railway project from GitHub. Select the Ava repo and set the service root directory to `railway/` if Railway does not auto-detect the backend package.

Start command:

```bash
npm start
```

Health route:

```text
/api/ava-health
```

Readiness route:

```text
/api/ava-readiness
```

Deploy doctor route:

```text
/api/ava-deploy-doctor
```

## Database
Add Railway Postgres. Confirm `DATABASE_URL` appears for the Ava service. Then run migration from the Railway service shell or locally with Railway variables loaded:

```bash
cd railway
npm run migrate:apply
```

## Owner security
Set `AVA_OWNER_TOKEN` to a strong private value. Do not place it in browser JavaScript. Owner-only routes require this token in `x-ava-owner-token`.

## Safe feature defaults
Keep all sensitive flags false until owner demo approval. Payment and hardware control remain false in this pilot.
