# PAW UI and stability check — 9 October 2026

Overall status: UI fixes verified; this remains a browser-local application.

## Fixed

- [P1] Hook-using modals now mount their contents only while open, avoiding changing hook order and stale form state when reopening.
- [P1] Registration handover requires an available Welcome member and avoids duplicate registrations.
- [P1] Mobile navigation provides all four workspace views. Calling controls and process instructions wrap; the page no longer overflows at 320px and 375px.
- [P2] Modals support keyboard focus containment, Escape, focus restoration, labelled controls, background scroll lock and bounded viewport height.
- [P2] New installs start empty with a first-batch setup screen. Unchanged legacy demo records are filtered out; new and edited records remain. Demo insertion and assessment autofill controls were removed.
- [P2] Batch creation rejects reversed dates. Selected batch survives reload. Toast timers are cleaned up and storage-save failures produce visible feedback.
- [P2] Lead IDs use UUIDs. Lead entry gives validation feedback and requires an available member. Team creation no longer invents phone or email values, supports PAW heads and correctly categorizes leadership. Members with assigned records cannot be removed.
- [P2] Participant portal searches exact normalized phone or login ID, prevents blank searches and displays current participant state after assessments.
- [P2] Questionnaire choices are keyboard-accessible and reports require all 40 answers.
- [P2] CSV exports use properly quoted Blob downloads; participant exports respect active filters. Callback dates are cleared when a lead leaves callback status.
- [P3] Visible focus, mobile input sizing and reduced-motion support were added.

## Validation done

- Production build (TypeScript + Vite): passed after final changes.
- Browser: clean startup has no console errors or warnings.
- Exercised: empty startup, batch creation, member creation, direct participant registration, checklist opening and Escape, assessment opening, answer selection and persistence after reopening, partial-report disabling.
- Responsive page-width checks: 320, 375, 768, 1024 and 1440px passed without document overflow. Screenshots inspected at mobile and desktop widths.
- Storage regression checks: all four collections start empty; unchanged seeds are excluded; edited and new records remain; non-array stored collections fall back safely. Passed.
- Lint and automated browser test suite: no scripts configured in the project.

## Still needs attention / coverage limits

- Storage and role switching are browser-local; no authenticated backend or multi-user synchronization exists.
- Full 40-answer scoring, certificate printing, import round trips and external phone/WhatsApp actions were not exercised end to end.
- Legacy edited demo records are intentionally retained to avoid deleting user changes.

## Files changed

- src/App.tsx — empty setup, registration guards, selected batch and toast persistence, member deletion checks.
- src/lib/storage.ts — empty defaults, legacy demo filtering, array validation and save-error events.
- src/lib/use-dialog.ts — reusable dialog keyboard and focus behavior.
- src/lib/export-utils.ts — escaped CSV Blob downloads.
- src/index.css — responsive dialog sizing, focus and reduced-motion styles.
- src/components/Header.tsx — wrapping header and mobile workspace selector.
- src/components/NewBatchModal.tsx — mounted form lifecycle and date validation.
- src/components/ManageTeamModal.tsx — lifecycle, leadership roles and real contact values.
- src/components/ImportLeadsModal.tsx — lifecycle, removed sample insertion and accurate allocation copy.
- src/components/AddParticipantModal.tsx — lifecycle and explicit unassigned member choice.
- src/components/CallLogModal.tsx, WelcomeChecklistModal.tsx, CertificateModal.tsx — dialog lifecycle and accessibility.
- src/components/ParticipantAssessmentModal.tsx — lifecycle, answer accessibility, removed demo filling and complete-answer report requirement.
- src/components/MissionCallingView.tsx, WelcomeFollowupView.tsx — responsive controls, validation and filtered exports.
- src/components/ParticipantLivePortal.tsx — exact searches and up-to-date participant display.
- README.md — startup and persistence behavior.
