# Ava v7.7.5 Rollback and Emergency Disable Plan

## Fast disable order
1. Set `AVA_ENABLE_PUBLIC_CHAT=false`.
2. Set `AVA_ENABLE_CUSTOMER_DATA=false`.
3. Set `AVA_ENABLE_FILE_RETRIEVAL=false`.
4. Set `AVA_ENABLE_CODE_BANK=false`.
5. Set `AVA_ENABLE_VOICE=false`.
6. Confirm `AVA_ALLOW_PAYMENT=false`.
7. Confirm `AVA_ALLOW_HARDWARE_CONTROL=false`.

## Frontend rollback
Revert `public/ava-config.js` to:

```js
window.AVA_API_BASE = "";
```

Or temporarily remove the `/AV/AVA` link from public navigation while leaving the route unpublished/unlinked.

## Railway rollback
Use Railway's latest known-good deployment or redeploy the previous GitHub commit.

## Netlify rollback
Use Netlify rollback to the previous production deploy if Ava's frontend breaks public navigation.

## Owner notification
Record the failure in Ava's correction ledger with visible failure, likely cause, repair, verification check, do-not-repeat rule, and carryforward rule.
