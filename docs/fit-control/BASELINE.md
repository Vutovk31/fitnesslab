# FIT CONTROL — engineering baseline

Status: remote baseline verified; no application runtime claimed. Product continues the existing FitnessLab repository. No second repo or scheduler. Owner requests manually initiated engineering cycles.

## Source authority
- Main 074fa61929e85c50a1c4e65bdbd6d42b64f45733; backup 6b162a36cfc00eb00f08cfcbef2f4086d6da9ef6; backup only adds recovery manifest. Preserve both.
- Prior FIT CONTROL v1.0 canon and P0-01 package govern product scope. This decision supersedes the proposed repository name only; preserve original documents and reconcile local worktrees before replacing legacy paths.
- Prompt VN main a9e56d6140874fd2c98c79806aa10cc634865862; use RESTORE → AUDIT → HYPOTHESIS → ONE CHANGE → VERIFY → EVIDENCE → NEXT_ACTION. MAESTRO task cards, AES decision gates, SkyNet quality, CreaDesign UX. No new runtime or scheduler.

## Architecture
Start isolated buildable workspace inside this repo; shared TypeScript domain, React/Vite PWA, IndexedDB, offline shell after installation. Native SQLite adapter and Capacitor spike later. No account or paid API required for core. Local diary SSOT; confirmed/planned/draft/deleted separate. Immutable food source basis and revision, exact unit compatibility, unknown != zero, source kcal priority. Optional providers cannot silently modify diary. Explicit consent, versioned backup and manual ChatGPT export.

## iPhone widget gate
Reuse GPT Project Pulse snapshot pattern, not its runtime or personal data. Prior Pulse design is recovered; native device proof not verified. WidgetKit/SwiftUI extension reads minimal versioned local snapshot via App Group, not cloud. Small: calorie balance; medium: macros and activity; large: training and next meal. Unknown values visible, stale timestamp, privacy toggle, deep link to entry capture. OS controls refresh; no always-on microphone in widget. PWA icon is not a native widget. Validate Swift compilation, signing, real iPhone add-widget, offline snapshot, update after diary mutation and privacy behavior before declaring ready. Early contract after core, implementation P1-04. No change to Pulse.

## Public repository boundary
Only generic code, synthetic fixtures, redacted technical logs. No actual diary, body measurements, health data, voice, secrets or personal exports. Visibility unchanged. No deploy or main merge without owner acceptance.

## Manual cycle
Read checkpoint, verify current branch head and scope, take one next task, implement one reversible slice, run checks, record evidence and next action. If no test environment, label NOT_RUN. No recurring ChatGPT automation created. No changes to existing automations. Next: P0-02A.

## Owner decision 2026-11-26 — mobile-first supersession (M01)
Target is installable iPhone and Android applications, not a Windows desktop application. Owner accepted mobile-first migration and next-cycle development. MANUAL_ONLY remains in effect; all other project automations unchanged. Existing core, prototype, IndexedDB code and prior evidence preserved. The older "PWA first" priority and desktop acceptance as a prerequisite to mobile development are superseded; the IndexedDB gate is NOT_RUN_BLOCKED, not passed or deleted. If a PWA is shipped, its own browser gate remains mandatory. No mandatory Windows user action for mobile development.

Architecture direction: reuse TypeScript domain and validation, mobile-first UI, Capacitor candidate shell, native SQLite candidate persistence. Choose and pin compatible dependencies and actual SDK/toolchain after verification; no dependency selected in M01. SQLite spike is isolated from runtime; metadata and payload must be reconstructed and checked by validateEntry, and domain transitions, transactions, migrations, durable backup and error mapping implemented before use. No raw SQL interpolation, no real data in fixtures, no silent network transfer, no sensitive logs. Prefer native app-private storage and platform protection, explicitly evaluate backup and deletion behavior. Existing HTML remains a synthetic preview only.

### Mobile roadmap (supersedes earlier execution order, preserves feature scope)
| ID | Dependency | Deliverable and acceptance |
|---|---|---|
| M01 P0 | existing baseline | Mobile architecture/acceptance decision, isolated SQLite feasibility, preserve historical evidence |
| M02 P0 | M01 | Responsive mobile diary vertical slice; reusable domain, touch controls, safe-area, accessible labels, no fake persistence; verify real target UI later |
| M03 P0 | M02 | Native storage adapter contract and SQLite implementation with validated records, atomic revision checks, transactional migrations, durable local data, unit and integration tests; no production claim |
| M04 P0 | M03 | Pin compatible mobile dependencies; real Android project and build, iOS project and build/signing when authorized toolchain available; no paid account or publishing without consent |
| M05 P0 | M04 | Physical Android and iPhone acceptance separately; storage and UI, offline, kill/relaunch, backup/restore; no desktop gate bypass claim |
| M06 P1 | M05 | Voice capture, permission refusal, lifecycle, explicit transcript confirmation and optional supported recognition with manual fallback |
| M07 P1 | M05 | Native WidgetKit and Glance, privacy-aware minimal versioned snapshot, stale time, deep link, real add-widget and refresh evidence |
| M08 P1 | M05 | Local catalog, meal plan, shopping, training/reminders and manual GPT export; retain unknowns and consent, optional AI only after safe provider decision |
| M09 P2 | M05 | Optional health integrations, explicit scoped consent, secure sync only if approved |
| M10 P2 | M05–M09 as applicable | Release checklist, signing, target acceptance, owner approval; distribution and paid costs separate |

### Mandatory native acceptance per platform
1. create and correct nutrition totals; 2. duplicate rejected; 3. input snapshot isolation; 4. close/reopen with source/timezone; 5. planned/draft/confirmed and unknown vs zero; 6. edit and stale revision; 7. two writers atomic CAS; 8. rollback on failure; 9. tombstone/no resurrection; 10. invalid domain record rejected; 11. date isolation; 12. closed/unavailable storage failure surfaced; 13. force-stop/relaunch durability; 14. airplane-mode read/write/relaunch. Additionally migration/upgrade rollback, actual backup/restore, privacy, and responsive UI on each platform. Native microphone/widget gates separate. Each receipt identifies exact source SHA, artifact hash, platform/device/OS, versions, actual case results and limitations; no simulated test substitutes. Historical Cycle005 receipt may close only the old IndexedDB gate if valid. Native gates remain NOT_RUN until executed.

Rollback: revert isolated M01 code/docs/checkpoint changes; preserve legacy source/evidence and never roll back user data destructively.
