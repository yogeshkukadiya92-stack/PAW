# Personal login verification — 9 October 2026

## Implemented

Real server authentication, separate linked accounts for every existing staff role and participants, first-owner setup, mandatory temporary-password replacement, self password changes, logout, account disabling and administrative password resets.

Workspace data has moved from browser-only state to a shared SQLite backend. Reads and mutations enforce role and record ownership. Concurrent edits to different records are accepted; stale edits to the same record are rejected with a visible recovery path.

## Validation

- TypeScript and production build passed.
- 16 server integration/security tests passed: initial setup, password length, login failure, session cookies, logout, CSRF, Calling/Welcome/participant scoping, privilege escalation denial, leader restrictions, mandatory first password change, resets/disabling, duplicate accounts, linked-record protection, conflict handling, malformed records, throttling, persistence, session expiry and protected hosted/local setup.
- Browser QA used a separate in-memory test server with synthetic identities. PAW Head login and account listing/assignment form, participant login and personal assessment, saved answers after reload, Calling login and registration handover, and Welcome login and persisted updates were exercised.
- Authenticated Welcome page checked at 320, 375, 768 and 1440px with no document overflow.
- Browser console had no errors/warnings in the exercised authenticated flows.
- Development server denies direct and /@fs access to the SQLite database and server source (403).
- The actual workspace is unseeded: first PAW Head setup remains for the user, with no default credentials.

## Operational notes

Hosting now requires the Node server, HTTPS and persistent storage. Docker and startup scripts have been updated. Full live hosting was not performed. The existing build tool dependencies report seven audit advisories; the deployed backend uses only Node built-ins and the Docker runtime does not install these build dependencies. No MFA or email-based password recovery was added; PAW Heads reset staff/participant passwords.

See LOGIN-SETUP.md for the account flow and permission matrix.
