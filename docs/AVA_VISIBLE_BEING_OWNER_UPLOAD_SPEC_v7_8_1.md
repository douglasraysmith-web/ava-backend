# Ava Visible Being Owner Upload Specification v7.8.1

## Governing rule
Ava's final visible appearance will be supplied or approved by the owner. The deployed system may include a restrained placeholder and status indicator, but it must not permanently lock, generate, or substitute Ava's final visual identity before owner review.

## Why this is done this way
Ava is intended to feel like a premium AV intelligence, not a generic chatbot. The owner’s visual idea is part of her identity, so the software must provide a clean visual slot rather than forcing an unapproved avatar.

## Approved deployment behavior before upload
- Show Ava as a premium cinematic system presence.
- Display owner-upload pending status in owner/demo review.
- Use no celebrity likeness, no cartoon substitute, no accidental ArchE visual, and no public claim that the final visual identity is approved.
- Keep animation states functional: idle, listening, thinking, answering, continuing, gated, owner-only.

## Owner upload requirements
Recommended source files:
- PNG/WebP/SVG for emblem or static visual.
- MP4/WebM/Lottie only after performance testing if animated.
- Transparent or dark-cinema compatible background preferred.
- Minimum 1024 px source for raster art.
- No protected celebrity/person likeness unless the owner owns the rights.

## Configuration flags
- `AVA_VISIBLE_BEING_ASSET_URL` = public-safe asset URL after upload/storage approval.
- `AVA_VISIBLE_BEING_OWNER_APPROVED=true` only after owner approval.

## Go-live rule
Ava can deploy with a placeholder. Final visible-being activation requires owner approval, asset upload, performance check, public/private scan, and verification that the image is not ArchE-branded or customer/private content.
