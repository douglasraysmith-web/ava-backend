# Ava Security and Privacy Checklist v1

## Must pass before owner pilot
- [ ] Owner token created and stored only as server-side environment variable.
- [ ] API/model key stored only as server-side environment variable.
- [ ] Health route does not reveal secret values.
- [ ] Public chat disabled by default.
- [ ] Customer-data retention disabled by default.
- [ ] Hardware/control command execution disabled.
- [ ] Payment/account functions disabled.

## Must pass before customer data
- [ ] Database schema installed.
- [ ] RLS enabled.
- [ ] No direct browser write path to customer/project tables.
- [ ] Server-side service role key never exposed client-side.
- [ ] Audit logging works.
- [ ] Retention/consent wording approved.
- [ ] Test customer records can be created, searched, updated, and deleted.

## Must pass before file retrieval
- [ ] Every file has access_scope.
- [ ] Dealer-only/licensed files do not return raw file content.
- [ ] Public users only receive public records.
- [ ] Owner token required for owner-private file records.

## Must pass before public launch
- [ ] Public/private boundary tests pass.
- [ ] No raw prompts, internal source files, secrets, customer data, or owner records are exposed.
- [ ] Public copy avoids overclaiming live support, certification, payment, customer-data readiness, or driver completeness.
