# AVA Public Route Cutover Plan v7.7.4

Canonical public route: `/AV/AVA`

## Route behavior

- `/AV/AVA` serves Ava's public interface.
- `/AV/AVA/` serves the same interface.
- `/ava` redirects to `/AV/AVA`.
- Backend calls go to same-origin `/api/ava-*` during Netlify fallback mode or to the Railway backend when `public/ava-config.js` is configured.

## Replacement rule

The AV side should present Ava, not ArchE. Internal governance names must not appear in public AV artifacts.

## Window cutoff prevention

Ava's answer area must stay scrollable and segment long answers. It must support continue, previous/next answer sections, copy full answer, and download answer.

## Public-private boundary

Public route must never expose private owner records, customer records, raw source files, internal prompts, API keys, logs, provider payloads, or dealer-only files.
