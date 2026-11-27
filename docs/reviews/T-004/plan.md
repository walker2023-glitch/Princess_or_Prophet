# Review: T-004 teacher persistence and game setup

Status: PASS WITH ITEMS

## Dependency status

T-003 is not merged into main. Draft PR #1 preserves the student prototype. T-004 branches from the tested T-003 head so the persistence work can proceed without losing it.

## Scope

This slice adds:

- Supabase schema and row-level security policies.
- Browser Supabase client using public environment variables only.
- Teacher sign-in and sign-up UI.
- Quote-pack persistence with local fallback when Supabase is not configured.
- Teacher dashboard with saved quote packs.
- Basic game setup and join-code creation.
- Documentation for environment variables and local mode.

It does not add realtime multiplayer yet.

## Architecture review

PASS. Supabase access is isolated in repository modules. React pages call repository functions instead of writing database queries directly.

## Security review

PASS WITH ITEM.

- Browser code receives only the publishable key.
- Row-level security uses auth.uid() ownership checks.
- Student accounts are not introduced.
- The service-role key is intentionally not supported by client code.
- Client-side route protection is a UX guard; database RLS is the actual data boundary.

Required item: production deployment should add server-side auth protection before public launch.

## Data review

PASS. Quote packs own quotes, quotes own question variations, and games reference quote packs and teacher owners. Verification status is persisted and checked before game creation.

## Testing review

PASS WITH ITEM. Add repository validation tests and migration review. Full database integration tests require a separately configured Supabase project and must not run against production.

## Decision

Proceed with T-004 implementation on feat/t004-teacher-game-setup.
