# AVA Storage Plan — R2/Postgres Pattern

Ava uses Postgres for metadata, permissions, checksums, retention state, audit records, source cards, project records, customer records, correction ledger entries, and logical object keys. Ava may use R2/S3-compatible object storage for large files: manuals, photos, drawings, proposal packets, calibration reports, diagrams, and screenshots.

Public chat must not write customer identifying information. Owner-only storage writes require owner token, approved storage system, audit enabled, and a known bank/table.

Variables:
- DATABASE_URL
- AVA_STORAGE_ENABLED=false until approved
- AVA_STORAGE_APPROVED_SYSTEM=false until owner approves
- AVA_STORAGE_AUDIT_ENABLED=true
- AVA_OBJECT_STORAGE_PROVIDER=r2
- AVA_OBJECT_BUCKET=mtthorne-ava-vault or approved bucket/prefix

Speed advantage: Ava can answer faster because the database stores structured records and the file vault stores large artifacts without forcing every answer to re-parse documents or guess from memory.


## v7.8.1 addition
This version adds owner-uploaded visible-being status and verified live deployment proof channels.
