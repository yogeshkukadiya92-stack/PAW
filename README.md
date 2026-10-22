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
