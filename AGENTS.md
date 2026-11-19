# AGENTS.md

## Project

Prophets or Princesses is an independent classroom game for religious education. Students identify quotation speakers and sources through live multiplayer questions, confidence wagers, and catch-up power-ups. Teachers enter a quote once and can generate several question variations from it.

This is an educational project. It is not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints, Disney, or any other rights holder.

## Session-start procedure

Before changing code:

1. Read this file.
2. Read every file in /docs/.
3. Read /tasks/INDEX.md.
4. Identify the active task or create a new task from the current roadmap.
5. State the scope, affected contracts, and verification plan before implementation.

## Project-specific operating rules

- Keep the first release focused on a usable classroom MVP.
- Treat quote accuracy, source attribution, and copyright status as product requirements.
- Never allow an AI-generated or unverified quotation to become playable without teacher review.
- Students do not need accounts for the MVP; teachers own quote packs and games.
- Do not collect unnecessary student personal information. Use temporary nicknames.
- Server-authoritative logic must determine answer correctness, scores, power-up effects, and question timing.
- A student may choose or reserve a power-up before a question, but answer-help power-ups must be locked before the answer is revealed.
- Confidence must be locked before the answer reveal.
- Keep game score separate from learning feedback.
- Any schema, realtime event, scoring rule, or route change must update the relevant files under /docs/ in the same change.
- Prefer reversible decisions and small vertical slices.

## Scaled review process

This project uses a lightweight version of the agentic playbook:

- Plan review: analyze scope, architecture/data impact, UX, testing, and deployment before nontrivial implementation.
- Implementation review: inspect the diff, run automated tests, and verify the live game flow.
- Human review: Dallas reviews or approves changes before they are considered complete.

For major decisions, record an ADR under /docs/decisions/.

## Definition of done

A feature is complete when:

- Its task file is updated.
- Relevant documentation and contracts are current.
- Automated tests cover important behavior.
- The feature has been manually checked in the intended classroom flow.
- No secrets or unverified copyrighted content were committed.
