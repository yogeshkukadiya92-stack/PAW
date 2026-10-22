# Reference structure reconstruction — 22 October 2026

Reference: https://pawtest.coachforlife.in/

## Evidence and boundaries

The reference was inspected in the browser: public basic-details screen, advertised demo dashboard login, Main Admin reports/metrics/hierarchy, and question-bank editor. No report or question changes were submitted to the reference site. No real user account was created there.

The publicly delivered inline JavaScript was retained as `reference-pawtest/public-app.js` and analyzed once with the existing REA CLI. REA MCP tools were not available in this session; registration was already aligned, so client configuration and native engines were not changed.

REA Evidence ID: `ev_a3763b5598da04ab51bb382b637869a1b8af73483634350714cca4a54f6c3572`.

Full canonical evidence: `reference-pawtest/rea-evidence.json`. Compact identity/coverage summary: `reference-pawtest/rea-summary.json`. This is static evidence for one shipped public JavaScript file, not the reference PHP backend or a claim that every function executed.

## Investigation ledger

| Question | Evidence | Outcome |
| --- | --- | --- |
| Public entry structure | Browser + public script lines 586–698 | Basic details, 40 questions, report; country code and four language choices |
| Dashboard modules | Browser + lines 500–581 | Reports, participants, question bank, metrics and nested completion cards |
| Assignment hierarchy | Lines 721–730, 1324–1444; Main Admin browser view | Main Admin → ICL Head → ICL Leader → ICL Member → participant; lower-role reference scoping inferred from client code |
| Scoring and saved reports | Lines 1184–1290, 1447–1502 | 20 strengths + 20 weaknesses; four style counts; primary/secondary, history and print |
| Translation/editor shape | Lines 53–353, 862–884, 1524–1585 | Four languages, question/style keyed wording overrides, 1–20 / 21–40 editor groups |
| Private server implementation | Not provided | Unresolved; PHP endpoint names in client code do not establish backend authorization or storage behavior |

## Implemented

- Public three-step assessment with a split introduction/form layout, a country selector, native language choices, green selection states, coral actions and a mobile layout.
- All 160 options in English, Hindi, Gujarati and Marathi. Translations use independently phrased short definitions; existing English questionnaire content remains canonical.
- Answer validation, live progress, report bars/table, primary/secondary styles, existing temperament explanations, print/PDF action and saved report history.
- Main Admin / ICL dashboards with report search, language filtering, participant history, completion counts, hierarchy cards and parent/participant assignment controls.
- Admin-only server-backed wording editor with language/group selection, save, reset and revision conflicts. Scoring identifiers are immutable.
- Server-enforced Head/Leader descendant scoping and canonical scoring. Completed report snapshots cannot be modified or removed through an ordinary assessment update.
- The existing calling, welcome, attendance, batch and account tools remain under Workshop operations.

## Deliberate differences

- Existing backend role identifiers remain compatible: PAW_HEAD is displayed as Main Admin; LEADER_HEAD as ICL Head; LEADER as ICL Leader. Calling and Welcome members retain their separate responsibilities.
- Existing real personal accounts and HttpOnly sessions remain. The reference's demo credentials and people were not installed in the app.
- Guest reports stay in the current browser. A typed name, phone or login ID does not authenticate a guest. Authenticated participants save only to their linked server profile.
- The participants table includes pending assigned people, rather than deriving the entire directory solely from completed reports.
- The secure Node/SQLite backend is retained; the reference PHP server was not copied or claimed to be reverse engineered.
- Workshop operations is an additional tab to preserve the project's existing workflows.

## Verification

- Production TypeScript/Vite build: passed.
- 23 automated tests passed, including prior login security checks, hierarchy isolation, question-bank authorization and concurrency, immutable retake history, valid answer enforcement, 20/20/40 scoring and stable tie ranking.
- Translation coverage checked: 160 nonempty word/description options and UI copy in each of four languages.
- Browser: guest details → all 40 answers → report; incomplete answer protection; Gujarati questions and retained answers; Main Admin reports/hierarchy/question editor; shared wording changes visible to participant; authenticated completion survives reload.
- Actual tab-specific viewport checks at 320, 375, 768 and 1280px: no document overflow on the questionnaire or dashboard. Basic-details mobile layout also checked at 375px.
- Exercised browser flows had no console errors/warnings.
- Reference and implementation screenshots were inspected at 1280×900; the implementation mobile capture is 375×900. Compared brand/header placement, centered stepper, two-column desktop structure, country-code input, language controls, green selected states, coral action and white/bordered surfaces. Spacing was adjusted to align with the reference.
- PDF action uses browser print and print styles; an actual exported PDF file was not generated during QA.

Preview images: `structure-preview.png`, `structure-mobile.png`. Reference image: `reference-pawtest/basic-details.png`.
