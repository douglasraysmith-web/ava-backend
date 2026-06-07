# AVA Feature Flag Activation Order v7.7.4

## Always off until owner approves

- `AVA_ENABLE_CUSTOMER_DATA`
- `AVA_ENABLE_FILE_RETRIEVAL`
- `AVA_ENABLE_CODE_BANK`
- `AVA_ENABLE_VOICE`
- `AVA_ENABLE_FOLLOWUP_DRAFTS`
- `AVA_ALLOW_PAYMENT`
- `AVA_ALLOW_HARDWARE_CONTROL`

## Recommended order

1. `AVA_ENABLE_PUBLIC_CHAT=true` after model provider and public boundary tests pass.
2. `AVA_ENABLE_CODE_BANK=true` after Railway Postgres migration and sample source/device records exist.
3. `AVA_ENABLE_FILE_RETRIEVAL=true` only after storage/access rules are approved.
4. `AVA_ENABLE_CUSTOMER_DATA=true` only after privacy, consent, retention, and audit rules are approved.
5. `AVA_ENABLE_VOICE=true` only after owner hears and approves the original Ava voice direction.
6. `AVA_ENABLE_FOLLOWUP_DRAFTS=true` only in draft/queue mode, not automatic sending.
7. Payment/account workflows remain plan-only until payment processor, terms, refund language, and owner approval exist.
8. Hardware control remains blocked until a separate audited hardware gateway exists.
