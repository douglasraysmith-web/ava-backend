# Ava v7.7.5 Netlify / mtthorne.com Route Integration

Canonical public path:

```text
/AV/AVA
```

Required Netlify behavior:
- `/AV/AVA` serves Ava's public page.
- `/AV/AVA/` serves the same page.
- `/ava` redirects to `/AV/AVA`.
- Public page must not include secrets.
- Public page must not expose owner-only records or raw sources.

Backend connection:
- During local/Netlify-only testing, `window.AVA_API_BASE = ""` allows same-origin Netlify functions.
- After Railway backend is verified, set `window.AVA_API_BASE` to the Railway service URL.
- Do not set Railway URL until `/api/ava-health`, `/api/ava-readiness`, and `/api/ava-deploy-doctor` pass.

Long-answer protection must remain enabled: scrollable answer viewer, answer segmentation, continue response, copy full answer, and download answer.
