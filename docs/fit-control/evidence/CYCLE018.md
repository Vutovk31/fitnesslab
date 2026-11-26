# Cycle 018 — Foreground timers
Parent f326068b0341e2b4e6eb6006d1f25b295ef8009c. Manual NextCycle. Branch/checkpoint restored, parent combined commit statuses empty. Previous HTML SHA256 matched checkpoint; prior tracked source hashes verified locally. No local ACCEPTANCE_RESULT.json found; no repeat of blocked browser navigation.

## Change
Two independent one-shot countdowns (rest 1–3600 seconds, activity 1–240 minutes), explicit start/pause/resume/reset. Monotonic elapsed-time deadline instead of counting interval callbacks. One shared 250 ms polling interval only while running and page not suspended; pagehide stops polling, pageshow and visibility change reconcile display. Visual completion only. No notifications permission request, audio alarm, network, persistence, calorie adjustment or diary writes. Defaults 90 seconds and 60 minutes; these are UI defaults, not personalized health prescriptions. Real sleeping-device timing depends on platform; completion is not guaranteed while suspended or closed.

## Actual verification
Node v22.16.0. node --test tests/*.test.mjs: 111 pass, 0 fail, 0 skipped (103 prior + 8 timer tests, including mock DOM). node tests/dom-smoke.mjs exit 0 PARTIAL_DOM_ONLY. Extracted fourth module script: node --check passed; executing the built module with mocked DOM, monotonic clock and interval confirmed start, elapsed completion and polling cleanup. Python preview/build.py produced 265179 bytes SHA256 beddbad0608dda8007fa87b480c99096e77c47d41e9902ea6eea3fd267742889. Four changed local blob hashes match candidate tree 718d94b84312bacbcb92e3836983d641afb6cc5b. Full canonical source compilation, real browser, actual microphone, IndexedDB, native devices and CI NOT_RUN.
4022e7477a3814b598fb9b6f12ae421e8b1cf327  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
7486226249d74934002cfdb43a33296b338b9c83  fit-control/preview/diary-preview.mjs
b1da72c38318857f3677bd1b80fc51a09e10c5b7  fit-control/preview/index.html
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
306bb00a6545ea91fd7fb08e5338584d47f96ed6  fit-control/preview/timer.mjs
eb6f6d8b79db4de5685a6759b5397c6f7703136a  fit-control/tests/timer.test.mjs

Next: P0-02C-RECONCILE, full canonical source rebuild/regression before more preview expansion, prioritizing any valid browser receipt. Rollback scoped engineering commit. No main, backup, other projects or automation changes.
