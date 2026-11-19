# Architecture

## System boundary

The product has three actors:

- Teacher: creates quote packs, reviews questions, hosts games, and sees class results.
- Student: joins a game with a code and nickname, answers questions, uses power-ups, and sees personal/game results.
- Server: owns the authoritative game state, scoring, timing, and validation.

## Main flow

~~~text
Teacher creates quote
  -> App generates question drafts
  -> Teacher reviews and publishes quote pack
  -> Teacher starts game
  -> Students join with code
  -> Server broadcasts question phase
  -> Students reserve/use power-ups and submit answer/confidence
  -> Server locks submissions and calculates scores
  -> Server broadcasts reveal and explanation
  -> Next question
~~~

## Game state

A game moves through explicit phases:

- lobby
- power_up_selection
- question_open
- answer_lock
- reveal
- finished

The server is the source of truth for the current phase and deadlines. Clients may display optimistic UI, but they cannot decide whether an action is valid.

## Realtime events

Initial event vocabulary:

- game:joined
- game:player_updated
- question:opened
- powerup:reserved
- powerup:activated
- answer:submitted
- question:revealed
- scoreboard:updated
- game:finished

Each event should include a game identifier, question identifier when relevant, server timestamp, and enough data for clients to recover after reconnecting.

## Scoring

The server calculates:

1. Base points from correctness and optionally response time.
2. Confidence multiplier after the student locks a 1-10 confidence value.
3. Valid power-up effects.
4. Catch-up adjustments, if enabled by the game settings.

Recommended initial confidence behavior:

- Correct answer: confidence 1-10 maps from 0.65x to 2.0x.
- Incorrect answer: 0 points in the classroom MVP.
- Competitive risk mode can be added later; it must be an explicit game setting.

## Security and privacy

- Students use temporary nicknames for the MVP.
- Teacher-only actions require authentication.
- Game codes must be difficult to guess and expire after the game.
- The server validates all submitted answer IDs against the active question.
- Do not expose answer keys before reveal.
- Do not store unnecessary student identifiers.
- Never put service-role Supabase credentials in browser code.
