# Role access verification — 2026-10-22

Environment: local PAW at http://localhost:5173/. All six existing demo accounts were signed in through the UI and independently through the API. Existing personal credentials were not changed.

| Role | Verified access |
| --- | --- |
| Main Admin | Dashboard, all local workspace records, question bank tab, hierarchy assignment controls, Manage logins |
| ICL Head | Own descendant team, demo lead and participant; no login management or question editor |
| ICL Leader | Own descendant team and records; calling and welcome operations; no admin controls |
| Calling Member | Own demo lead and linked participant; calling operations, log call and register actions |
| Welcome Member | Own assigned participant; checklist, assessment and attendance controls; no calling lead list |
| Participant | Own read-only identity and assessment; no staff dashboard or other members/leads |

API checks for every non-admin account: account listing/creation denied, question bank edits denied, team role changes denied. Calling, Welcome and Participant reassignment attempts denied. Logout invalidated each API session. Exact observed counts are retained in ROLE-ACCESS-CHECK.json.

Fix: first-time staff dashboard selection now prefers a workshop containing their visible assigned leads/participants, while preserving an explicitly saved workshop choice. The former fallback always selected the first global workshop, making assigned records appear missing. Verified in the browser for ICL Leader, Calling Member and Welcome Member.

Validation: production build passed; all 23 automated tests passed. The tests include permitted role-specific writes, rejection of another member's records, hierarchy isolation, participant attendance restrictions, immutable report history, session revocation and stale edits. Destructive account changes and role-specific write tests run in isolated test databases, not against personal workspace records. Local live checks did not modify business records.

Workshop metadata remains shared with staff for starting work in new workshops; individual leads, participants and reports remain scoped by assignment/hierarchy. Main Admin has workspace-wide visibility by design.
