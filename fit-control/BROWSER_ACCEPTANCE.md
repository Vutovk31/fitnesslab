# Manual IndexedDB browser acceptance
P0-02B remains blocked until this test succeeds on a normal authorized host. Use an existing local checkout of the canonical repo; inspect git status and preserve unrelated changes. Do not change browser or organization security policies. No new CI workflow or scheduler.

Prerequisites: Node 22, npm, TypeScript 5.8.3 on PATH, Python and Playwright 1.57.0. Use standard Playwright Chromium or an explicitly authorized installed executable via CHROMIUM_PATH. The hardened runner requests Chromium sandbox enabled. If security policy prohibits it, stop and report the blocker.

From fit-control/:
```powershell
git rev-parse HEAD
npm ci --offline --ignore-scripts --no-audit --no-fund
npm run typecheck
npm test
python -m unittest discover -s tests/browser -p 'test_report_contract.py' -v
python tests/browser/run.py
```
If prerequisites are absent, install them on the authorized development machine only with owner permission, e.g. Python Playwright 1.57.0 and its standard Chromium using python -m playwright install chromium. No real diary or credentials needed. If using an authorized installed Chromium set CHROMIUM_PATH to its actual executable; no security overrides.

Expected: 56 Node tests, 6 Python report contract tests, and 14 named browser scenarios all true; nonzero runner exit or missing report means not accepted. Save actual stdout/stderr, exit code, git HEAD, browser version, and OS. The browser runner creates only synthetic data in a fresh temporary context. No native device or offline PWA restart claim.

P0-02C preparation (conditional): responsive local diary UI, create/edit/confirm/delete, date and meal groups, unknown display, separate actual/plan/forecast, revision conflict and storage-error states; test offline after initial load, reload persistence, mobile layout, accessibility, no external requests. Start implementation only after P0-02B acceptance.
