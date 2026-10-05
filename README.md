# PAW (Personality Awareness Workshop) Operating System

A modern, production-ready Operating System and CRM Dashboard designed for **Coach For Life's Personality Awareness Workshop (PAW)**, supporting both **Online** and **Offline** workshops.

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
- **Bulk Lead Import**: Upload CSV or paste contacts (`Name, Phone, City`) with automatic capacity-based distribution.
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
- **Persistence**: Browser `localStorage` with instant synchronization

---

## Getting Started

### Installation
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

### Production Build
```bash
npm run build
npm run preview
```

---

## License
MIT
