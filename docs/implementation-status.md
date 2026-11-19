# T-002 Implementation Status

## Completed in this slice

- Next.js and TypeScript project foundation.
- Zod quote validation schema.
- Question draft generation for five initial question types.
- Editable question options in the teacher prototype.
- Teacher-review gating before a quote can be marked ready.
- Confidence multiplier and points calculation.
- Power-up eligibility rules.
- Unit tests for quote validation, question generation, and scoring.

## Not yet connected

- Supabase persistence.
- Teacher authentication.
- Realtime game state.
- Actual quote-pack saving.
- Server-side authorization.
- CI workflow.
- Playwright browser tests.

## Known implementation note

The prototype currently keeps form state in the browser. The Save button confirms the review gate but does not persist data yet. Persistence is intentionally the next task after this local behavior is tested.
