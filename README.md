# Prophets or Princesses

A live classroom quote game inspired by Kahoot and Mario Kart.

Students answer questions such as:

- Was this said by a Latter-day Saint prophet or a fictional princess?
- Who actually said it?
- Which quote is authentic?
- What year was it said?
- Which talk, movie, or book was it from?

Students can reserve power-ups, use confidence ratings, and compete in a catch-up-aware game. Teachers enter each quote once, then review generated question variations instead of manually creating every question.

## Product principle

Easy for a teacher to author, fun for students to play, and accurate enough to teach from.

## Planned MVP

1. Teacher creates a quote pack.
2. Teacher enters a quote, speaker, source, year, explanation, and link.
3. The app generates editable question variations.
4. Teacher starts a live game and receives a join code.
5. Students join with temporary nicknames.
6. Students answer questions in realtime.
7. Students can use power-ups and confidence wagers before the answer reveal.
8. The game reveals the source, explanation, score, and learning feedback.

## Planned stack

- Next.js and TypeScript
- Supabase Postgres, Auth, and Realtime
- Vercel deployment
- Vitest for unit tests
- Playwright for end-to-end tests

The stack can change if a technical spike shows a simpler option.

## Current status

The GitHub repository began as an empty planning repository. The current work is product and architecture planning before implementation.

See:

- Architecture: docs/architecture.md
- Data model: docs/data-model.md
- UX plan: docs/ux.md
- Roadmap: docs/roadmap.md
- Task index: tasks/INDEX.md
