# Review: T-001 foundation plan

Status: PASS WITH ITEMS

## Scope

This slice establishes the first implementation boundary:

1. Teacher quote-entry domain model and validation.
2. Generated question-variation drafts.
3. Pure confidence-scoring and power-up rules.
4. A minimal Next.js application shell.
5. Unit tests for validation and scoring.

Realtime multiplayer is intentionally deferred until the single-player rules are proven.

## Round 1 — Analysis

### Analyst

PASS. The product has a clear initial user: a teacher creating a playable quote pack. The first slice tests the authoring bottleneck and the scoring rules.

### Architect

PASS WITH ITEM. Keep score calculation as a pure server-shared module with no UI dependencies. Do not couple the first scoring implementation directly to Supabase Realtime.

### Data Engineer

PASS. The documented entities are sufficient for the first local slice. Database migrations should wait until validation rules are represented in code.

### Required item

The first implementation must define a single canonical validation schema for quotes and question variations before adding persistence.

## Round 2 — Implementation

### Backend

PASS. Implement domain functions first:

- validateQuote
- generateQuestionDrafts
- calculateConfidenceMultiplier
- calculatePoints
- canUsePowerup

### Frontend

PASS. Use a simple teacher form and preview screen. Avoid a full visual theme until the workflow works.

### UX

PASS WITH ITEM. The quote form must show the minimum required fields clearly and should not force a teacher to fill optional explanation or theme fields.

### Required item

The interface must distinguish generated drafts from teacher-approved playable questions.

## Round 3 — Verification

### Test Engineer

PASS. Unit tests should cover valid/invalid quote data, confidence values 1 through 10, duplicate submissions, and power-up eligibility. A later Playwright test will cover the full host/player flow.

### DevOps

PASS. Add local development instructions and a basic CI workflow once the package manager and app shell exist.

## Contracts touched

- Quote validation schema: new.
- Question variation schema: new.
- Scoring rules: new.
- No public API or realtime event contract yet.

## Redlines checked

- No unverified quote becomes playable automatically.
- No student account data is required.
- No secrets are committed.
- No answer key is exposed to an untrusted client.
- No realtime implementation is added before local scoring works.

## Decision

Proceed with the foundation slice on branch feat/t001-foundation.

The next implementation task is T-002, teacher quote authoring and domain rules.
