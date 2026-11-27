# Cycle 060 — bounded delivery recovery: one-shot CI candidate
Date 2026-11-27. Parent 33d530167f3a910d2c73e14eebd1d8eddd9d85d3. DEEP / MANUAL_ONLY. No new periodic scheduler. Owner directive RECOVERY + OPTIMIZE supersedes archive-only waiting; all native/privacy gates remain.
Live GitHub: PUBLIC, push permission true, 99 product files (475262 bytes), 33 top-level test files. No workflows in current tree; actions/runs API returned total_count=0. Actions settings/permissions endpoints rejected by connector as unsupported; actual workflow-write scope and runner availability are not proven. No direct Git/codeload/SDK retries. No existing Codex execution tool found. Official billing https://docs.github.com/en/actions/concepts/billing-and-usage and runner https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job reviewed: standard hosted runners public repos free; no larger/self-hosted runner, paid services, artifact/cache storage or publication used. Public-repository status guarded at job execution. Single bounded workflow-file push to exact branch and exact before SHA, no schedule or recurring trigger; no existing automation changed. Workflow permissions contents:read; pinned actions/checkout v6 and setup-node v7 commit IDs checked via upstream Git refs, persist-credentials and package-manager-cache false. Node 22.16.0/npm 10.9.2 exact; TypeScript 5.8.3 archive integrity pinned to registry https://registry.npmjs.org/typescript/5.8.3; no install lifecycle scripts. Full archive and checked-out bytes verified against existing 99-file manifest before any test. 33 test files required. Real CI result not yet available. 
Locally validated candidate YAML with PyYAML BaseLoader: branch/path/parent/public restrictions, contents read, standard runner, 10-minute job limit, no schedule/cache/artifact/secret use, checkout credentials false; bash -n passed; all three embedded Python blocks compiled. Local workflow Git blob 688b17ecd03c83d0d472baa108f8d4982df73d30; SHA256 94b5e1640c5b9f36bbcfa0d19816697e78a344e39cdfc4bd21be2cf935611e3f. Static checks only, no GitHub runner execution or full regression claim. Last actual local product test 114/114 historical C059; 23/99 local recovered; no new product code or product tests. No native build, dependency lock, privacy, OS/device, release proof.
Recovery strategy: move testing to repository's authorized runner, only one controlled candidate attempt. If access denied or no run visible, no blind repeats; require owner-approved existing Codex checkout execution or enabling/allowing the standard free runner, not a new project or paid service. Full M07D remains open until exact-SHA complete regression evidence verified; M04B synthetic Android build and iOS prep still separately gated. No main/backup, real data, deployment or existing automations changes. 

## Exact-SHA CI acceptance receipt — observed 2026-11-27
Run: https://github.com/Vutovk31/fitnesslab/actions/runs/45980722354
Job: https://github.com/Vutovk31/fitnesslab/actions/runs/45980722354/job/140443624100
Event push, exact source 51e2642e77995fe051ccf99b48d22e9107926bf6; run completed success, all seven job steps completed success. Run created 10:16:39Z, updated 10:17:15Z. Live log read through GitHub connector, distinguished actual output from echoed script. 399 actual ok lines, zero not ok. Source archive and actual checked-out working files 99/99 match pinned 72f2eb7 manifest; 33 top-level Node test files. Node 22.16.0 and npm 10.9.2, registry integrity-checked TypeScript 5.8.3, offline core install and fresh typecheck/build. Actual TAP:
# tests 399
# pass 399
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 16415.269937
Compiled outputs:
5dc82cdac14cc28ec98016fc895bb60e6080c9ef108844c55af06882a526a823  dist/diary-editor.js
c7a3981901ae7c7ff8c0cc82a017897f6b957aad21bce2d9e5e581f115cf1a6c  dist/diary-view.js
b33ab1bcd9bb80ef2ef0bab6534f6ea720352cb93b064e65a53ac4a4f735182c  dist/nutrition.js
74e9ecdf76355dad3911e24df2d262e3de80edfb092127dce2eda7b36cf478c4  dist/storage.js
REGRESSION_PASS source=51e2642e77995fe051ccf99b48d22e9107926bf6; native/device/browser NOT_RUN
Actual integrated cases include:
ok 300 - widget source reads complete day and goals in one transaction and refuses pending journal
ok 301 - synthetic widget publication integrates consistent SQLite source and explicit mutation guard
ok 379 - canonical domain to publication to consumer: confirmed-only values and safe routes
ok 380 - canonical render hides lock surface, revoked consent and stale snapshot
ok 381 - late canonical read cannot publish after consent revocation
ok 382 - failed transport revocation requires independent current consent; cached snapshot is not erased
ok 383 - canonical validator rejects tampered snapshot and unsupported schema
ok 396 - real file SQLite to canonical widget: exact confirmed totals, goals and persistence after reopen
ok 397 - tracked mutation invalidates widget before storage and committed journal blocks publication until acknowledgement
ok 398 - prepared operation and corrupt SQLite row refuse widget result; no implicit journal acknowledgement or repair
ok 399 - late actual SQLite snapshot cannot publish after revocation
M07D accepted for complete core Node regression on verified CI checkout; local working copy remains partial (23/99 C059 historical), not a blocker for this completed regression. Historical C059 114 subset superseded for same product source, not summed. Separate Python verifier unit 8/8 historical; current verifier actually executed in CI. Browser E2E, Python SQLite spike/browser helper suites, native dependency lock/compatibility/security, native Android/iOS build and device, real-data privacy, voice, OS widgets/cache, recovery release blockers remain open/NOT_RUN. No claim of G1–G5 independent formal acceptance or release. Workflow guarded by exact before SHA and path; no schedule, no further trigger on this documentation-only receipt commit. No paid runner, cache or artifact storage requested; no existing automation changed. 
M04B preparation: public standard ubuntu-24.04 runner actually available for core regression. Upstream runner inventory documents Android SDK and Java 21; macOS 26 runner inventory documents Xcode 26.x, Capacitor v8 requires Xcode 26+. Sources https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md ; https://github.com/actions/runner-images/blob/main/images/macos/macos-26-Readme.md ; https://capacitorjs.com/docs/getting-started/environment-setup . Native SDK/Gradle versions and macOS actual availability must be observed on new runner; no build or signing performed. Exact mobile pins inspected (Capacitor 8.6.3, SQLite 8.1.1, esbuild 0.28.2, TS 5.8.3), native lockfile absent. Next M04B-A: resolve lockfile on approved public standard runner with scripts disabled, capture/review exact tree, integrity, registry, licenses, vulnerabilities and platform compatibility before installing or building; no automatic update. Synthetic flag mandatory; no real data. Android debug APK only after dependency review, then separate actual device tests and iOS simulator/signing decision. No user archive needed for core regression.
