# Cycle 002 — P0-02A evidence
Date 2026-11-26. Parent b31c59c1b702a9d160f296cac1f7d01a6c720f0b. Test environment: Linux container, Node v22.16.0, npm 10.9.2, TypeScript 5.8.3.

Observed commands: npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund (up to date); npm ci --offline --ignore-scripts --no-audit --no-fund (up to date); npm run typecheck (no errors); npm test (tsc build, Node TAP: tests 26, pass 26, fail 0, skipped 0). Tested source uses synthetic fixtures. Git blob hashes measured with git hash-object; all six matched GitHub candidate tree 13f15f067ea91d69a48b13209e5fbbf39c56df3a before adding this evidence and checkpoint.

54de87d454d5ad0d1f3359c9797a2916fed8bbbd  fit-control/package.json
3294347ae35b3ea61d1088607ee6e426b1227879  fit-control/package-lock.json
7f12d3348627cddedcd9dfa66483dec8e286b784  fit-control/tsconfig.json
3d2bc62692c4b0ba42e61d71a964424f53f9c2be  fit-control/.gitignore
d5ed7f0f06f682625b8b1e4b0d538bcb1bde8ce7  fit-control/src/nutrition.ts
52c78e2085daa480aa3b28e9e64c0ee4e4836029  fit-control/tests/nutrition.test.mjs

Scope: deterministic scale, null vs zero, source kcal priority, unit mismatch, invalid inputs, calendar date, duplicate ids, confirmed/planned/forecast, overflow. No actual health data. No claim of independent reviewer, CI, browser E2E, persistence, native build or physical device verification. Compiler is externally provisioned; dependency lock contains zero npm dependencies. Full persisted schema/provenance and browser integration are P0-02B. Rollback: revert cycle commit on engineering branch only. Next P0-02B.
