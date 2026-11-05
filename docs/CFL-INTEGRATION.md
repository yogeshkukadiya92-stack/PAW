# CFL registration integration (not enabled in production yet)

The PAW server pulls `/api/v1/paw` from CFL every 60 seconds and on startup.
The dashboard refreshes workspace data every 10 seconds when there are no unsaved edits.
The Main Admin can inspect status and retry under **CFL registration sync**.

## Release prerequisites

Deploy the matching CFL endpoint from the separate checkout
`/Users/yogeshaihub/Downloads/CFLdashboard-paw-integration` before enabling the PAW connection.
CFL exports only registration-linked workshops named PAW / Personality Awareness Workshop,
plus explicit workshop IDs in `PAW_WORKSHOP_IDS` (comma-separated). It never exports
assessment answers, payment information, or records belonging to other workshops.

Set a private, random key of at least 32 characters as `CFL_PAW_API_KEY` on both servers.
Set `CFL_API_BASE_URL=https://dashboard.coachforlife.in` on PAW only. These are server-only
runtime settings, never client/public variables. Restart both applications after setting them.
No key is included in this repository or returned in PAW connection status.

The first sync backfills existing registrations. Workshops without dates become unscheduled
Drafts. Waiting-list registrations are provisional. Accounts/passwords are not imported;
an administrator links participant accounts after verifying identity.

## Behaviour and recovery

- Stable CFL registration/workshop IDs make repeat delivery idempotent.
- Existing same-workshop phones match after normalizing Indian +91 numbers.
- Existing assignments, attendance, assessment answers and ownership are retained.
- Available Welcome team members receive new participants by smallest workload. Without
  available team members, the participant remains unassigned for the Main Admin to allocate.
- Invalid registration rows are skipped and counted; invalid feeds fail atomically.
- Failed connections preserve existing PAW data and last-success time, and retry next minute.
- Deleting a CFL row does not delete its PAW history.
- Workshop remapping is blocked after imported participants exist; map before first enrollment.
- Full feed is limited to 8 MB / 50,000 registrations. A cursor-based feed is required beyond this.

Validation: `node --test server/cfl-sync.test.mjs`; CFL `node --experimental-strip-types --test tests/paw-export.test.ts`.
