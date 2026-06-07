# AVA One-Screen Go-Live Steps v7.8.4

1. Run local verification:
   ```bash
   npm run predeploy
   ```

2. Push Ava to GitHub.

3. In Railway, create a new service from the Ava GitHub repo.

4. Add Railway Postgres.

5. Add Railway variables from `AVA_ENV_RAILWAY_v7_8_3.env.example` or the current env template. Keep gated features OFF.

6. Run migration:
   ```bash
   npm --prefix railway run migrate:apply
   ```

7. Verify Railway:
   - `/api/ava-health`
   - `/api/ava-readiness`
   - `/api/ava-live-proof`
   - `/api/ava-visual-status`
   - `/api/ava-teaching-status`

8. Add `public/ava.html`, `public/ava-config.js`, and redirects to mtthorne.com.

9. Set Ava backend URL in `ava-config.js`.

10. Deploy mtthorne.com and open:
    ```text
    https://mtthorne.com/AV/AVA
    ```

11. Run live verification:
    ```bash
    AVA_PUBLIC_VERIFY_URL=https://mtthorne.com/AV/AVA \
    AVA_BACKEND_VERIFY_URL=https://YOUR-RAILWAY-URL \
    npm run verify:live
    ```

12. Collect proof:
    ```bash
    AVA_PUBLIC_VERIFY_URL=https://mtthorne.com/AV/AVA \
    AVA_BACKEND_VERIFY_URL=https://YOUR-RAILWAY-URL \
    npm run proof:collect
    ```

13. Owner reviews Ava.

14. Activate only approved feature flags.
