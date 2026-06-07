# AVA to ArchE Shared Learning Connection Plan v7.8.4

## Goal
Connect Ava to the same learning service, source registry, correction ledger, storage vault, and owner-only container pattern as ArchE without letting Ava become ArchE or exposing ArchE private governance to public AV users.

## Shared infrastructure
Ava may use shared infrastructure only through a namespace and permission boundary:
- master_source_registry
- source_router
- manifest_exporter
- learning_store
- correction_ledger
- audit_log
- storage_vault
- owner_only_container_service

## Ava-specific namespaces
- tables: `ava_*`
- variables: `AVA_*`
- routes: `/api/ava-*`
- public route: `/AV/AVA`
- storage prefix: `ava/`

## Allowed shared behavior
- ArchE routes AV work to Ava.
- Ava asks for public-safe backup source manifests if ArchE is under maintenance.
- Ava receives AV-relevant source slices from the master source registry.
- Ava writes AV-specific correction and lesson records after owner-approved storage is active.

## Blocked behavior
- Ava must not expose ArchE prompts, raw private source packets, owner records, project rooms, logs, provider payloads, or private customer records.
- Ava must not present herself as ArchE.
- Ava must not use shared storage to retain customer data until approved audited storage is live.

## First shared-learning activation
1. Finish ArchE learning service/container setup.
2. Create Ava namespace tables or prefixes.
3. Add Ava service token/owner token.
4. Run Ava teaching migration.
5. Import Ava verified-source registry seed as proposed records.
6. Import Ava teaching lessons seed as proposed/active according to owner choice.
7. Run public/private boundary tests.
8. Turn on owner-only teaching route.
9. Keep public teaching writes OFF.
