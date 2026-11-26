# Cycle 017 — Training draft
Parent 3257ce661bc11c71b9c0742c98dc83ca98e17958. Manual NextCycle. Remote branch and checkpoint restored; parent combined statuses empty. Local previous HTML SHA256 matched checkpoint; baseline 16/16 blob hashes verified. No browser acceptance receipt found in available local workspace. No repeat blocked browser navigation.

## Change
Separate temporary session with explicit date, exercise name, sets, repetitions per set, external load in kg and session duration. Uniform repetitions/load per row; different loads require separate rows. Positive integer sets 1–100, optional positive integer repetitions up to 1000, optional nonnegative external load up to 10000 kg, optional positive duration up to 1440 min, 100 rows. These are input bounds, not health recommendations. Unknown values null; zero load distinct. Summary total sets and repetitions; unknown repetition total exposes known subtotal. Add/remove/clear with clear confirmation for existing rows, manual text/JSON report. Training neither changes nutrition nor estimates calorie burn. No network or durable storage. Date and duration are session controls; date change does not create a second session. Existing nutrition backup excludes training; no training import/history. No user data in Git.

## Actual verification
Node v22.16.0. node --test tests/*.test.mjs: 103 pass, 0 fail, 0 skipped (95 prior + 8 training, one mock DOM). node tests/dom-smoke.mjs exit 0 PARTIAL_DOM_ONLY for existing diary. Built third module script executed in minimal Node DOM adapter: add, export, zero weight and total repetitions PASS; node --check passed. Python preview/build.py generated 259173 bytes SHA256 60e1382671d99ad5843512c52b9b5c685aebccc61d64126470c7c9c92c17eff8. Four changed files matched local git hash-object in candidate tree 4d47b770c1d9c98279b0419d356972d3252603df. Full source compilation, real browser, microphone, IndexedDB, native devices and CI NOT_RUN.
32731915b2937a96f85e626971ee32cafc3bb315  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
7486226249d74934002cfdb43a33296b338b9c83  fit-control/preview/diary-preview.mjs
756c8c898264e5a772525157dac53ccda3e326db  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
6b47b01577ae4a882649f197696ce9a97cb89eab  fit-control/tests/dom-smoke.mjs
e17fa3b67a0e4344abd161b4a638b8994a7511a1  fit-control/tests/preview-goals.test.mjs
d4cb6a0b9bef0dad373804bcc831599c2ff9fd80  fit-control/preview/voice.mjs
0042dfeab4f105ed2f7adb058fb4bd82a308e777  fit-control/tests/voice.test.mjs
86e9205db6c73bd3cf9d56bcc3d286c5855c9cf3  fit-control/preview/transcript.mjs
88d2247e5d26f1a53c4425aa51e8166b37133490  fit-control/tests/transcript.test.mjs
de22b5a09ff9a56aa128c7a5f4597fa71675707a  fit-control/tests/backup.test.mjs
fc6ffc6cd0318252cf99ba31e107f573b9c66517  fit-control/tests/catalog.test.mjs
7050f0f95c5bc20636c94336fed62a5a94f27d35  fit-control/tests/meal.test.mjs
fb77a553fb8549e74a35b50359ebc05efe401ede  fit-control/tests/shopping.test.mjs
5e103efc482564cc791bb3c7cc86342bb27dd2cc  fit-control/preview/training.mjs
5641bd21e9ca3aa98be73fa2668dedbd3297b453  fit-control/tests/training.test.mjs
Next: P1-02-PREP-REMINDER if no receipt. Rollback scoped commit. No main, backup, other projects or automation changes.
