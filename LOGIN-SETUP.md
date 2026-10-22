# PAW personal logins

The application now has a real Node backend. Accounts, sessions and workshop records are stored in SQLite on that server. There are no default accounts or fixed passwords.

## First use

Use Node.js 24 or newer, install dependencies with `npm ci`, and run `npm run dev`. The frontend is at http://localhost:5173 and the backend is on port 3001.

On the local computer, choose **Sign in** and create the first Main Admin (PAW Head) account using your name, a unique login ID and a password of at least 12 characters. Keep this password private. Account setup is available only once.

Add a workshop and team members. In **Manage logins → Create login**, select a person's role and existing record, choose a unique login ID, and enter a temporary password. Each person must choose their own password before accessing the workspace. Add a participant record before creating a participant login. Login IDs are case-insensitive; each person can have one linked account.

The role displayed on a team member determines which role can be used for their login. Navigation tabs do not change the authenticated role. Staff and participant records cannot be detached from linked accounts.

## Permissions

| Account | Access |
| --- | --- |
| PAW Head | All workshop records, batch/team management, create/reset/enable/disable personal logins |
| ICL Head / ICL Leader | Oversight and record updates within their assigned descendant hierarchy; cannot manage personal logins, batches or the team roster |
| Calling Member | Assigned leads, their registration handovers and assigned contact context; can create/import their own leads |
| Welcome Member | Assigned participants, welcome checklists, assessment support and attendance |
| Participant | Own enrolled workshop and participant profile; can save own assessment answers and generate a complete report |

These restrictions are enforced on the server for reads and writes. Requests without a valid session cannot fetch workspace data. Participants have a direct personal dashboard rather than a public directory lookup.

## Passwords and sessions

- Passwords are salted and hashed with Node's scrypt; plaintext passwords are not stored or returned.
- Session cookies are HttpOnly, SameSite=Strict, and Secure in production. Only a hash of the session token is stored in SQLite.
- Sessions expire after eight hours, or after 30 minutes without authenticated requests. Background refresh is paused for hidden tabs.
- Sign out revokes the current session. Changing your own password revokes other sessions and creates a fresh current session.
- PAW Heads can reset another person's temporary password or disable their login. Both revoke that person's existing sessions immediately.
- Forgotten staff/participant passwords are recovered through a PAW Head. There is no email reset service or public signup.
- Login attempts are rate-limited. Mutations require a same-origin JSON request.

## Shared records

Records save to the server, with a visible saving/error indicator. Clients refresh shared data every ten seconds while visible. Separate records can be edited concurrently. A stale edit to a record changed by someone else is rejected; the unsaved draft remains visible until the person chooses to reload or resolve it.

Existing browser records can be imported by the PAW Head from **Import saved browser records** when available. This does not silently import data under a staff or participant account. Legacy records claiming a finished report without 40 answers are imported as in-progress. Old browser copies remain available; new records use the shared server database.

The old storage functions are retained only for legacy import compatibility. Authentication credentials and session tokens are never written to browser localStorage.

## Hosting

The original static-only hosting configuration has been replaced: the Node server must run for login and data access.

- Build with `npm run build`, then use `npm start` behind an HTTPS reverse proxy.
- Set `PAW_APP_ORIGIN` to the exact public HTTPS origin, without a trailing slash.
- Set `PAW_SETUP_TOKEN` to a long, private random value before creating the first hosted PAW Head account. Enter it in the setup form. Remote clients cannot claim the first account without this key.
- Set `PAW_DATABASE_PATH` to a persistent SQLite path. The default is `data/paw.sqlite`.
- The Docker image uses Node 24, serves on port 3001 and expects a persistent volume at `/app/data`.
- Keep a persistent-volume backup. Losing the database loses accounts and workshop records.
- This SQLite implementation is intended for one server instance with a shared persistent disk. Separate replicas must not use independent databases.

`npm run preview` serves the built app locally on port 3001 without production-only HTTPS cookies. Use `npm start` for hosted deployments.

## Verification

Run `npm test` for the authentication and permissions regression suite, and `npm run build` for TypeScript and production build validation.

Implementation references: [Node crypto](https://nodejs.org/api/crypto.html), [Node SQLite](https://nodejs.org/api/sqlite.html), [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

## Reference-style assessment structure

The public entry now follows Basic details → 40 questions → Your report. English, Hindi, Gujarati and Marathi are available for all question options. Guest assessments and their history stay in this browser. Logging in as a participant opens the linked profile and saves reports on the server. A basic-details login ID is report metadata and never authenticates a guest or grants access to an existing account.

The Main Admin dashboard adds reports, participants, ICL hierarchy tracking and question-bank editing. Existing calling, welcome and batch tools remain in **Workshop operations**. Parent links use PAW Head → ICL Head → ICL Leader → Calling/Welcome Member. Unassigned legacy staff remain visible to the Main Admin until linked.

Completed reports are immutable snapshots, including language, answers, completion time and scores. The server calculates scores from valid canonical answer IDs. Retakes append to history. Question-bank editing changes words/descriptions only and does not change scoring identities or past report scores.
