# Cycle 020 — voice page lifecycle stabilization
Parent 004d24284fec3daccaabad41738fc152278c0051. Cycle019 was interrupted before update of branch. Recovered full source and test logs, reran integrated smoke on Cycle019 HTML. Local exact 39 baseline blob hashes matched pinned Git tree. No browser receipt in local workspace; no repeat of blocked navigation.

## Reproduced defect
Voice mount installed once-only pagehide handler and never restarted polling on pageshow. New test simulates event once semantics, pagehide/pageshow repeated, two explicit captures and resource release. Before fix: exit 1, 0/1; polling 0 instead of 1 on pageshow. After fix: pass; regular pagehide cleanup on every transition, idempotent interval restart on pageshow. No new feature, no automatic recording, no real BFCache or microphone claim.

## Actual tests
Node v22.16.0, TypeScript 5.8.3. npm run typecheck exit 0; npm test exit 0, 183/183 (182 existing + 1 regression); python -m unittest discover -s tests/browser -p 'test_*.py' -v: 13/13, exit 0. python preview/build.py produced 265463 bytes SHA256 640b5dd4d5273567a558feb0f408c61e510a9ea27cb0877f76c685fe32bf7ba9. node tests/standalone-smoke.mjs and node tests/dom-smoke.mjs exit 0, PARTIAL_DOM_ONLY. Full source compilation verified; actual browser/media/IndexedDB/native/CI NOT_RUN. Next actual owner-authorized acceptance, do not continue feature expansion while gate unchanged. No main/backup/other projects or schedules changed. Rollback scoped engineering commit.
