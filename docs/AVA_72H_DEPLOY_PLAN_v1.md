# Ava 72-Hour Deployment Readiness Plan

**Date prepared:** 2026-06-03  
**Target:** as ready to deploy as possible by **2026-06-06**.  
**Deployment posture:** owner-controlled pilot first, public-safe assistant second, customer-data retention only after the database/security gate passes.

## Honest answer
Yes, we can make Ava meaningfully deploy-ready within three days for an owner pilot and limited public-safe AV assistant. The realistic three-day target is **deployable pilot**, not a fully certified, customer-data/payment/hardware-control production system.

## Day 1 — Owner Pilot Skeleton
1. Drop the scaffold into the mtthorne.com codebase or a branch.
2. Set environment variables in the hosting provider.
3. Deploy the static page and serverless functions.
4. Confirm `/api/ava-health` returns status without exposing secrets.
5. Confirm owner-token protection works.
6. Confirm public chat is OFF by default.
7. Confirm customer-data retention is OFF by default.

## Day 2 — Memory and Retrieval Pilot
1. Create the database project.
2. Run the SQL migration.
3. Configure server-side database credentials.
4. Seed 5–20 safe AV source/device/file records.
5. Test owner-only source/file lookup.
6. Test correction ledger writes.
7. Test device/code lookup in safe-reference mode only.

## Day 3 — Owner Presentation + Limited Public Candidate
1. Run the owner demo script.
2. Test public-safe AV assistant behavior.
3. Test package routing and lead intake language.
4. Test private-data refusal.
5. Test no dealer-only file exposure.
6. Produce deployment readiness status.
7. Decide whether to activate limited public route.

## Go / No-Go
Ava is owner-pilot ready when health, chat, owner authentication, database connection, source/file lookup, correction ledger, and boundary tests pass.

Ava is public-ready only when public/private boundary tests pass and the owner approves public activation.

Customer-data retention is ready only when database, RLS, audit logging, retention policy, and access controls are verified.
