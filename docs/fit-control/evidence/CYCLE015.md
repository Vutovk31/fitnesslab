# Cycle 015 — Meal Constructor
Parent 037f2b5fa116d7c4b943663e3ed73f55d3fa246a. Manual NextCycle. Previous HTML SHA256 matched checkpoint. Current branch and checkpoint restored; combined commit statuses empty. No acceptance receipt found in local files; no repeated blocked browser test.

## Change
Meal composition uses existing catalog templates, prepareEntry and diaryView; 1–30 products, explicit date/timezone/meal, manual portions, sum and forecast. Preview does not mutate diary records (ID allocator advances); approved batch validates all entries, candidate totals, record count and export-size guard before replacing the in-memory array. Status planned only. Unique IDs within batch and existing rows. UI requires calculation and confirmation; invalidates preview when input or diary changes. Draft selection clears on date change or backup restore and is not included in backup. No new persistent store or API, no real data. Atomicity applies to synchronous temporary array, not actual IndexedDB. No durable meal grouping ID or recipe storage.

## Actual verification
Node v22.16.0. node --test tests/*.test.mjs: 87 pass, 0 fail, 0 skipped, exit 0; 80 prior targeted + 7 new. node tests/dom-smoke.mjs exit 0 PARTIAL_DOM_ONLY, including meal preview, cancellation, save, and unchanged confirmed intake. python preview/build.py generated 242647 bytes SHA256 0342cab6a498217f638c208e70df826307920dc20dcb380e124c2ddea2ff25e6. Four changed Git blobs match locally computed git hash-object. Full repository compile, real browser, actual microphone, IndexedDB, native devices and CI NOT_RUN.
f1ac01e6b0828266b03a433b1a8904c286accf86  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
6739061b4a6e245e787ebb80a689f05a00c59b33  fit-control/preview/diary-preview.mjs
4630f207bc0d3a9d2711f4b79b0a3760b294b17f  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
73f3ab5817f50f417ebbd51718cfa10f4ca33ff0  fit-control/tests/dom-smoke.mjs
e17fa3b67a0e4344abd161b4a638b8994a7511a1  fit-control/tests/preview-goals.test.mjs
d4cb6a0b9bef0dad373804bcc831599c2ff9fd80  fit-control/preview/voice.mjs
0042dfeab4f105ed2f7adb058fb4bd82a308e777  fit-control/tests/voice.test.mjs
86e9205db6c73bd3cf9d56bcc3d286c5855c9cf3  fit-control/preview/transcript.mjs
88d2247e5d26f1a53c4425aa51e8166b37133490  fit-control/tests/transcript.test.mjs
de22b5a09ff9a56aa128c7a5f4597fa71675707a  fit-control/tests/backup.test.mjs
fc6ffc6cd0318252cf99ba31e107f573b9c66517  fit-control/tests/catalog.test.mjs
7050f0f95c5bc20636c94336fed62a5a94f27d35  fit-control/tests/meal.test.mjs
Rollback scoped engineering commit only. Next P1-03-PREP-SHOPPING if no actual browser receipt. No changes to main, backup, other projects or automations.
