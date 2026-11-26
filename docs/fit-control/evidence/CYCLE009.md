# Cycle 008/009 — interrupted commit recovery
Date 2026-11-26. Parent 2cd6bfabf465107fe133e306ce983efe9b54abef. Manual cycle. Previous response interrupted before branch update; recovered original locally saved source and HTML, no rewrite.
- Fresh verification in container: node --test tests/*.test.mjs, 37 pass, 0 fail, exit 0; node tests/dom-smoke.mjs exit 0, PARTIAL_DOM_ONLY (startup/modes/add/edit/delete/date/report). No browser or clipboard acceptance. Full source typecheck/suite not rerun.
- Python preview/build.py rebuilt HTML from local restored modules and matched original byte-for-byte (97203 bytes; SHA256 f97a74b1ea5b31cbad06927c0405f92a7db942b0ae845f53577dab553e25d221).
- Local git hash-object matched all seven candidate blobs:
eaeb465f9cb7c2eedb67e3b22cf9d0ca80831f49  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
8988ef0951b05a46c2eea694349e99bfd0490ebb  fit-control/preview/diary-preview.mjs
b89d6b402f5726dc868c58664d11e36d6445a8b1  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
38616ec92006561572c0da1c42141851631f3976  fit-control/tests/dom-smoke.mjs
- Preview uses temporary memory only, synthetic seeded rows, explicit status transitions and existing Nutrition Engine, Diary View and Diary Editor. GPT report is read-only manual export, no external upload, IDs/source references omitted. Targets illustrative. No persistent storage or real browser acceptance.
- Main and backup out of scope. Rollback scoped commit; next configurable preview goals.
