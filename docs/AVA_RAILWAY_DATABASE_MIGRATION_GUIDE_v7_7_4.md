# AVA Railway Database Migration Guide v7.7.4

## What the migration does

The migration creates Ava's business memory structure inside Railway Postgres. It creates banks for customers, projects, rooms, devices, sources, drivers/protocols, command/code records, files, corrections, and audit events.

## Why this is done our way

Ava must be fast without guessing. The database lets Ava retrieve known customer/project/device/source records quickly, while the feature flags prevent her from using sensitive records before the owner has approved that capability.

## Before running

- Confirm the Railway Postgres service exists.
- Confirm `DATABASE_URL` is available to the Railway backend service.
- Keep `AVA_ENABLE_CUSTOMER_DATA=false` until privacy and consent rules are approved.
- Keep `AVA_ENABLE_FILE_RETRIEVAL=false` until storage and access rules are approved.
- Keep `AVA_ENABLE_CODE_BANK=false` until sample source/device records are verified.

## Run method

Use Railway's Postgres query console, psql, or another approved Postgres client. Run:

`railway/migrations/001_ava_core_railway_postgres.sql`

## Verify

Open:

`/api/ava-readiness`

Ava should report table counts instead of `migration_not_verified`.

## What not to do

Do not place real API keys in GitHub. Do not enter real customer information before customer-data activation is approved. Do not store dealer-only files or copyrighted manuals unless access and storage permission are clear.
