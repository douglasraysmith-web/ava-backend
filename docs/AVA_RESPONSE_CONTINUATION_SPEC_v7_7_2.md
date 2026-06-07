# Ava Response Continuation Spec v7.7.2

Purpose: prevent the AVA public/owner chat window from cutting off, hiding, or effectively killing long answers.

## Failure observed
The prior AV-side assistant could begin answering but the visible window ran out of room before the answer was complete. That is unacceptable for Ava.

## Rule
Ava must never depend on a fixed-height answer box to complete a response. Long answers must be scrollable, segmented, continuable, copyable, and downloadable.

## Required behavior
1. The answer panel uses a scrollable long-form viewer.
2. Ava splits long responses into readable sections.
3. The user can move Previous/Next through sections.
4. The user can switch between section view and full answer view.
5. The user can request "Continue response" without restarting the answer.
6. The user can copy or download the full answer.
7. Voice playback uses the visible section by default so long answers do not overflow the voice route.
8. The prompt layer tells Ava to continue from the next useful point when asked to continue.
9. Public/private boundaries still apply during continuation.

## Why this is faster for the owner
The owner does not lose leads or trust because Ava stops mid-answer. Customers can read, copy, export, or continue without waiting for a human to repeat the answer. Long technical explanations become usable instead of cramped.

## Current limits
This is a front-end plus prompt-level continuation system. True server-side streaming and persistent conversation memory remain future improvements.
