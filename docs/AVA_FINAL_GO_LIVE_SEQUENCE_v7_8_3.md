# AVA v7.8.3 Final Go-Live Sequence

## Go-live sequence
1. Run local package checks: `npm run predeploy`.
2. Push to GitHub and confirm CI passes.
3. Deploy Railway backend from GitHub.
4. Add Railway Postgres and variables.
5. Apply migration.
6. Verify Railway:
   - `/api/ava-health`
   - `/api/ava-readiness`
   - `/api/ava-live-proof`
   - `/api/ava-owner-verify`
7. Integrate public Ava route into mtthorne.com:
   - `/AV/AVA`
   - `/ava` redirect
8. Set public frontend backend URL.
9. Run live proof:
   - `AVA_PUBLIC_VERIFY_URL=https://mtthorne.com/AV/AVA AVA_BACKEND_VERIFY_URL=https://<railway-url> npm run verify:live`
   - or `npm run proof:collect` to write a proof JSON file.
10. Owner demo.
11. Owner decision record.
12. Activate only the smallest approved feature set.

## First safe live state
- Public page: ON
- Public showroom mode: ON
- Public model dispatch: OFF unless owner approves provider key use
- Customer data: OFF
- File retrieval: OFF
- Device/code bank: OFF
- Voice: OFF
- Payment/account workflow: OFF
- Hardware control: OFF
- Automatic customer follow-up: OFF

## Earliest recommended first activation
After owner demo, public provider dispatch may be enabled first if the owner approves and the model/provider route is verified. Customer data and file/code-bank features should come later.
