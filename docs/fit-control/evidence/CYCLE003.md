# Cycle 003 — P0-02B evidence
Date 2026-11-26. Parent d09ef164edaf21758fcee212ed7bab5d36a38820. Linux, Node 22.16.0, npm 10.9.2, TypeScript 5.8.3, Python Playwright 1.57.0, installed Chromium 144.0.7559.96.

## Actual commands and outcomes
- npm ci --offline --ignore-scripts --no-audit --no-fund: exit 0, up to date.
- npm run typecheck: exit 0.
- npm test: exit 0, tsc build, TAP 51 tests, 51 pass, 0 fail, 0 skipped (26 existing nutrition + 25 new validation and unavailable API tests).
- python tests/browser/run.py: exit 1, browser navigation stopped at page.goto with net::ERR_BLOCKED_BY_ADMINISTRATOR for http://127.0.0.1:<ephemeral-port>/tests/browser/. Managed environment blocks navigation. No policy changes, no browser assertions executed; 14 planned browser cases NOT_RUN. Do not interpret as app failure or success.
- Candidate tree blob comparison: five added files match locally hashed files; six original core files were also locally hashed against prior checkpoint. Synthetic entries only.

## Blob hashes
54de87d454d5ad0d1f3359c9797a2916fed8bbbd  fit-control/package.json
3294347ae35b3ea61d1088607ee6e426b1227879  fit-control/package-lock.json
7f12d3348627cddedcd9dfa66483dec8e286b784  fit-control/tsconfig.json
3d2bc62692c4b0ba42e61d71a964424f53f9c2be  fit-control/.gitignore
d5ed7f0f06f682625b8b1e4b0d538bcb1bde8ce7  fit-control/src/nutrition.ts
52c78e2085daa480aa3b28e9e64c0ee4e4836029  fit-control/tests/nutrition.test.mjs
e4ca409b5b463bbcb3936f5b3108737887bd674d  fit-control/src/storage.ts
80d5bc5a8b7e9fcf0e2fe8f322ea97e5e2386747  fit-control/tests/storage-validation.test.mjs
f56c457486b8e6775d05bac689aa0e166261b71b  fit-control/tests/browser/index.html
3e46054afa89bf17c68378d82ca1991babe48038  fit-control/tests/browser/storage.test.mjs
d252a074d6be4f59ac8004d7e78f63297efa251c  fit-control/tests/browser/run.py

## Scope and remaining gates
Implemented IndexedDB v1 initialization, transaction-completion-based writes, revision compare-and-swap, duplicate rejection, tombstone deletion, date index and integration with dayBalance. Validation covers strict entry shape, local calendar date, timezone, source confidence/kind, source snapshot fields, numeric units and timestamps. Node tests do not prove transaction behavior. Browser cases cover create, duplicate, snapshot copy, reopen, planned/draft/unknown, update, concurrent connections, rollback, tombstone, metadata, date filtering, closed DB, document reload and offline operations after load. Only schema v0→v1 initialization exists; subsequent migrations, backup, full history of revisions, hard deletion/privacy purge and native iOS/Android remain future scope. No PWA offline reload claimed. No CI or independent review. Source validation checks format, not accuracy or license authorization. Next P0-02B-VERIFY, then P0-02C after acceptance.
