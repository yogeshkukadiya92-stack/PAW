# PAW (Personality Awareness Workshop) Operating System

A React and Node.js Operating System and CRM Dashboard designed for **Coach For Life's Personality Awareness Workshop (PAW)**, supporting both **Online** and **Offline** workshops.

Includes the official **40-Question Personality Profile Analysis** (Florence Littauer Model), strict **1:1 ICL member continuity**, Mission Calling Team CRM, and Graduation Certificates.

---

## Key Features

### 1. PAW Batch Management
- Create and manage Online and Offline workshop batches.
- Schedule dates: Start Date, End Date, and T-7 Welcome Call Kickoff.
- Target registrations counter and automated progress metrics.

### 2. Mission PAW Calling Team CRM
- Hierarchy support: `PAW Head → Leader Head → Leader → Calling Member`.
- Calling member capacities: **15**, **25**, or **35** calls.
- **Bulk Lead Import**: Upload CSV or paste contacts (`Name, Phone, City`) with even distribution across available calling members.
- **Call Dispositions & Logging**: `Pending`, `Interested`, `Callback`, `Registered`, `Not Reachable`.
- 1-click **Register & Handover** to the Welcome Team.

### 3. Welcome & Follow-up Team CRM (Strict 1:1 Continuity)
- **The Golden Rule**: The exact same ICL member who performs the Welcome Call stays with the participant throughout the workshop for attendance and assignments.
- **7-Point T-7 Welcome Call Checklist**:
  1. Participant Verification
  2. Dates & Schedule Confirmation
  3. WhatsApp Group Joining Check
  4. First Assignment Guidance
  5. Login & Tech Support
  6. Clarification of Doubts
  7. Final Attendance Commitment
- **Multi-Day Session Attendance**: Day 1, Day 2, Day 3 live toggles.
- **Leader Escalations Drawer**: Interventions for uncontactable or at-risk participants.

### 4. Official 40-Question Personality Profile Analysis
Exact match with [Coach For Life PAW Personality Profile](https://workshop.coachforlife.in/PAW-Personality-Profile-Analysis):
- **Part 1 (Questions 1–20)**: Strengths (e.g. *Adventurous*, *Adaptable*, *Animated*, *Analytical*).
- **Part 2 (Questions 21–40)**: Weaknesses (e.g. *Blank*, *Bashful*, *Brassy*, *Bossy*).
- **Dual Modes**: Step-by-Step Focus Card Mode or Full 40-Question Sheet Mode.
- **Quick Jump Palette (1–40)** with real-time answered/pending color indicators.
- **Florence Littauer 4-Temperament Scoring Engine**:
  - **Popular Sanguine** (The Enthusiastic Motivator)
  - **Powerful Choleric** (The Strategic Visionary)
  - **Perfect Melancholy** (The Precision Analyst)
  - **Peaceful Phlegmatic** (The Diplomatic Anchor)
- **Profile Report Output**:
  - Dominant and Secondary Archetypes
  - 4-Quadrant Score Matrix (Strengths /20, Weaknesses /20, Total /40, %)
  - Core Superpowers, Emotional Needs, and Growth Opportunities
  - Print / PDF Report Export
  - 1-Click **Copy WhatsApp Summary**

### 5. Participant Standalone Live Portal
- Accessible via the **40-Q Portal** tab.
- Participants can look up their registration using their **10-Digit Mobile Number** or **Login ID**.
- Complete their assessment and immediately access their personality report and certificate.

### 6. Formal Completion Certificate
- Printable graduation certificate with participant name, batch code, date, and signatures.

---

## Tech Stack
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend**: Node.js 24+ with a persistent SQLite database.
- **Authentication**: Individual accounts, hashed passwords, HttpOnly sessions, and server-side role permissions.
- **Persistence**: Shared server data, background refresh and conflict-safe saving. Browser storage is used only for preferences and optional legacy imports.

---

## Getting Started

### Installation

Use **Node.js 24 or newer**. `npm run dev` starts both the backend and frontend.

```bash
# Clone the repository
git clone https://github.com/yogeshkukadiya92-stack/PAW.git
cd PAW

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Personal logins

Open the local app, choose **Sign in**, and create your first **Main Admin (PAW Head)** account. No default username or password is installed.

1. Create a batch and add team members with their actual roles.
2. Open **Manage logins → Create login**, select a person, and give them a unique login ID and temporary password.
3. Each person must replace their temporary password at first sign-in.
4. Add participant records before creating their participant logins.

The homepage follows **Basic details → 40 questions → Your report**, with English, Hindi, Gujarati and Marathi. Guest reports remain on the current device; authenticated participants save to their assigned profile. Main Admin dashboards include Test reports, Participants, Question bank and the existing Workshop operations.

Calling members see their assigned leads; Welcome members see their assigned participants. Participants open their own assessment and report. Main Admins manage accounts and question wording. ICL Heads and Leaders oversee only records under their assigned hierarchy. Set the parent from **Reports to** when creating staff, or from the hierarchy cards.

The app starts without demo records. The PAW Head can import existing browser records into the shared database from the account toolbar when legacy records are detected. Unchanged demo records remain excluded.

See [LOGIN-SETUP.md](LOGIN-SETUP.md) for account setup, permissions, deployment and recovery details.

### Production Build
```bash
npm run build
npm run preview
# Local built-app preview is served by the backend at http://localhost:3001
```

---

For a hosted instance, use `npm start` behind HTTPS, set `PAW_APP_ORIGIN` and a private `PAW_SETUP_TOKEN`, and attach persistent storage for the database. The Docker image runs the Node server on port 3001.

## License
MIT

### Workshop completion and in-app reminders

The Completion tab shows each participant as In progress, Ready for review, Completed or Needs review. Leaders can record completion with a note, or reopen a completed participant with a reason. Decisions are attributed and timestamped by the server, retained in the activity timeline, and cannot be rewritten. Participants and welcome staff cannot make completion decisions.

Readiness requires a generated personality report, approval of every assigned workshop task, Present or Late attendance for every scheduled session, no future scheduled sessions, and no open follow-up or leader escalation. With no scheduled sessions, the existing Day 1–3 attendance is used. Excused attendance does not count as Present. Additional work after sign-off shows Needs review without discarding the earlier decision. Existing assessment-based certificate access remains separate from workshop completion.

Reminders are calculated inside the app for overdue assignments, corrections, due-soon work, upcoming sessions, staff attendance gaps, pending leader reviews and due follow-ups. They refresh while the app is open and disappear as the underlying work is resolved. No WhatsApp, email or push delivery is configured. Staff reminders and completion records follow the existing hierarchy permissions; participants see their own records.

Run `node qa/progress/check.mjs` for progress, report, reminder and readiness checks, and `npm test` for server authorization and workflow integration tests.

### 30 / 60 / 90-day post-workshop follow-ups

The post-workshop tab calculates three milestones from each workshop's end date using calendar days. Staff can record Completed, Unreachable, Support Required or Rescheduled, with a note and a next date for any unfinished outcome. The latest entry controls the current status; all earlier entries remain in the participant activity timeline. A retry date replaces the active due date while preserving the original milestone date.

Only administrators, assigned leaders and the participant's assigned welcome member can record follow-ups. Participants have a read-only view of their own schedule and results. Entries open on the workshop's end date. Due and overdue milestones appear in app reminders and the leader queue; support requests remain visible even with a future retry date. Filters cover participant, member, milestone, status and outcome, with a CSV export of the filtered results. No external messages are sent.

### First Admin from Coolify environment variables

Set these as **runtime** environment variables, then redeploy:

- `PAW_ADMIN_EMAIL`: the email used to sign in.
- `PAW_ADMIN_PASSWORD`: your private password (minimum 5 characters).
- `PAW_ADMIN_NAME`: optional display name; defaults to `Main Admin`.

On an empty database the server creates the Main Admin and its team record automatically. No setup form or setup token is needed for this route. Passwords are hashed in the database and never returned to the browser. These variables do not change or reset an existing account on restart. Once the first account exists, manage staff accounts inside **Manage logins**; change your own password inside the dashboard. Public registration is disabled.
