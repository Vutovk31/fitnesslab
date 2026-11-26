# Cycle 005 — portable acceptance handoff
Date 2026-11-26. Parent 901893e101c17ddd329262d242ab41242dec072a. Scope P0-02B-VERIFY, no feature expansion. No personal data.

## Restore
All 14 previously recorded local Git blob hashes matched the pinned checkpoint. Managed Chromium policy remains URLBlocklist=["*"]. No policy changes, no blind retry, no alternate executable to bypass restriction. Authorized external host is not accessible in current session.

## Execution
- npm run typecheck: exit 0 (TypeScript 5.8.3).
- npm test: exit 0, 56/56 (Node 22.16.0, npm 10.9.2).
- python -m unittest discover -s tests/browser -p 'test_*.py' -v: exit 0, 13/13 (6 previous + 7 wrapper tests).
- python -m py_compile tools/acceptance_bundle.py: exit 0.
- Browser: NOT_RUN, 0/14 assertions executed; previous restriction remains.
- GitHub candidate tree 74594691acc45221ba613ec605688784d8c8d138 matched both new source blob hashes. Full manifest below.

## Change
Portable wrapper checks an exact list of bundled source/compiled file SHA-256 hashes and source commit format before invoking the existing browser test runner. Produces local ACCEPTANCE_RESULT.json containing UTC timestamp, OS, Python version, source commit, hashes, stdout, stderr, exit code and decision. Rejects nonzero exit, malformed/partial report or failed assertion. Does not install software, upload or modify browser security policy. A checksum manifest is integrity metadata, not a signed attestation. Returned evidence must be reviewed and compared to the pinned source. Windows launcher and full browser run not verified in this session.

## Source blob manifest
54de87d454d5ad0d1f3359c9797a2916fed8bbbd  fit-control/package.json
3294347ae35b3ea61d1088607ee6e426b1227879  fit-control/package-lock.json
7f12d3348627cddedcd9dfa66483dec8e286b784  fit-control/tsconfig.json
3d2bc62692c4b0ba42e61d71a964424f53f9c2be  fit-control/.gitignore
d5ed7f0f06f682625b8b1e4b0d538bcb1bde8ce7  fit-control/src/nutrition.ts
52c78e2085daa480aa3b28e9e64c0ee4e4836029  fit-control/tests/nutrition.test.mjs
e345c8709dac176255c30a278e68bde9315cced6  fit-control/src/storage.ts
80d5bc5a8b7e9fcf0e2fe8f322ea97e5e2386747  fit-control/tests/storage-validation.test.mjs
f56c457486b8e6775d05bac689aa0e166261b71b  fit-control/tests/browser/index.html
3e46054afa89bf17c68378d82ca1991babe48038  fit-control/tests/browser/storage.test.mjs
3cd0b9d6747b002330ce86d6606c197d5a362635  fit-control/tests/browser/run.py
c6c2e9e336e65f52e7be5ba1cc71e509f1324d2d  fit-control/tests/storage-promise.test.mjs
3874e9b313792a981642e36ab2a30b1ca2e55225  fit-control/tests/browser/report_contract.py
7192b93e8367ff6e8c9a58ecb217bdba2d441003  fit-control/tests/browser/test_report_contract.py
f8bb3a75a0cfe1276f06f2161f24bef11f1f0508  fit-control/tools/acceptance_bundle.py
741256520ac715202645132ca6cb4bb87e9f9355  fit-control/tests/browser/test_acceptance_bundle.py

Next: manually run package on authorized host, review receipt, then P0-02C. No changes to main, backup, schedules or other projects.
