# First Implementation Slice

## Goal

Build the smallest vertical slice that proves the most important product promise:

> A teacher can enter one quote once and receive useful, editable question variations.

## Proposed app structure

~~~text
app/
  page.tsx
  teacher/quotes/new/page.tsx
  teacher/quotes/[id]/page.tsx
components/
  quote-form.tsx
  question-draft-list.tsx
lib/
  domain/
    quote-schema.ts
    question-generation.ts
    scoring.ts
    powerups.ts
tests/
  domain/
    quote-schema.test.ts
    question-generation.test.ts
    scoring.test.ts
~~~

Names may change during implementation, but domain logic should remain separate from React components.

## Initial dependencies

- Next.js
- TypeScript
- Zod
- Vitest
- React Testing Library only if component behavior needs it

Do not add Supabase until the local domain and UI behavior pass tests.

## Domain functions

### validateQuote

Validates required fields and returns normalized data.

### generateQuestionDrafts

Creates drafts for category, speaker, authentic quote, year or decade, and source questions. It must return drafts marked unreviewed.

### calculateConfidenceMultiplier

Maps confidence 1 through 10 to 0.65 through 2.0.

### calculatePoints

Accepts base points, correctness, confidence, and enabled modifiers. It returns a deterministic score result.

### canUsePowerup

Checks inventory, question type, phase, and whether the power-up has already been spent.

## Exit criteria

- The form can be completed without database access.
- Generated drafts are visibly editable.
- Domain tests pass.
- No quote is silently published as verified.
