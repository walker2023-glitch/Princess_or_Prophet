# ADR-001: Focus on teacher-authored live classroom games

Status: Accepted

## Context

The project could become a general quiz platform, a religious-content library, an AI quote generator, or a live classroom game. Building all of these at once would create unnecessary scope and content risk.

## Decision

The first release will focus on:

- Teacher-authored quote packs
- Automatic generation of editable question variations
- Live classroom games
- Confidence wagers
- Fair catch-up power-ups
- Source and explanation reveals

Students will join with temporary nicknames and will not need accounts.

## Consequences

Positive:

- The first release has a clear user and workflow.
- Teachers retain control over accuracy and content.
- Privacy and account complexity are reduced.
- Realtime gameplay demonstrates meaningful engineering depth.

Tradeoffs:

- The product will not initially have a public content marketplace.
- Teachers must provide or review content.
- AI cannot be treated as an authority.
- Legal and copyright review remains part of content preparation.

## Alternatives rejected

- Building a generic Kahoot clone first: insufficient differentiation.
- Allowing unrestricted AI-generated quotes: unacceptable accuracy risk.
- Requiring student accounts: unnecessary friction for a classroom pilot.
