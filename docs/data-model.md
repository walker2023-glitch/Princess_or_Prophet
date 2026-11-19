# Data Model

## Teacher-owned entities

### users

- id
- email
- role
- created_at

### quote_packs

- id
- owner_id
- title
- description
- status
- created_at
- updated_at

### quotes

- id
- quote_pack_id
- text
- speaker_name
- speaker_category
- year
- source_title
- source_type
- source_url
- explanation
- theme
- verification_status
- copyright_notes
- created_at
- updated_at

Allowed initial speaker categories:

- prophet
- princess
- other_real_person
- other_fictional_character

Allowed verification statuses:

- draft
- teacher_verified
- needs_review
- archived

### question_variations

- id
- quote_id
- question_type
- prompt
- answer_options
- correct_answer
- enabled
- created_at

Initial question types:

- category
- speaker
- authentic_quote
- year_or_decade
- source

## Live game entities

### games

- id
- host_id
- quote_pack_id
- join_code
- status
- current_question_index
- settings
- created_at
- started_at
- ended_at

### players

- id
- game_id
- nickname
- score
- streak
- powerup_inventory
- joined_at
- last_seen_at

### answers

- id
- game_id
- question_variation_id
- player_id
- selected_answer
- confidence
- reserved_powerup
- activated_powerup
- is_correct
- base_points
- confidence_multiplier
- points_awarded
- submitted_at

## Important invariants

- A quote cannot be published unless it has a teacher-approved verification status.
- A student can submit at most one answer per question.
- Confidence is an integer from 1 through 10.
- A power-up can only be used if the player owns it and the question phase permits it.
- The server, not the browser, calculates is_correct and points_awarded.
- A game cannot reveal a question before its answer deadline or teacher override.
