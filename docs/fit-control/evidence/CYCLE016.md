# Cycle 016 — Shopping List Engine
Parent d80c506f7c3cbc47efa453a0f7f5b9de0632ff79. Manual NextCycle. Branch and checkpoint restored; combined parent commit statuses empty. Previous HTML SHA256 matched checkpoint, three modified baseline source hashes matched. No acceptance receipt in local files. No repeat of blocked browser navigation.

## Change
Read-only shopping list over 1–7 inclusive local calendar dates (UTC date arithmetic only), planned entries only. Exact grouping by name, unit, preparation, basis, nutrition and source metadata; variants kept separate, including different source snapshots. Finite quantity sum; no price, stock, pack size, home inventory or raw/cooked conversion. JS number arithmetic, no exact decimal guarantee. Manual text export includes truncated source references, review before sharing. Invalidate output when range or diary rendering changes. No extra persistent store, external API, implicit upload or actual personal data.

## Actual verification
Node v22.16.0. node --test tests/*.test.mjs: 95 pass, 0 fail, 0 skipped, exit 0; 87 prior targeted + 8 new. node tests/dom-smoke.mjs exit 0 PARTIAL_DOM_ONLY, including shopping generation, export, unchanged diary and range invalidation. python preview/build.py generated 250373 bytes SHA256 cc162ab1b7aaa97479f6056c9c069cf5fbb85dc688f9cb41a043317d2dfefd6a. Four changed source/test blobs matched locally computed git hash-object in candidate tree a5ace97945f83b24f172019314930d779bab03a7. Full repo compile, real browser, microphone, IndexedDB, native devices and CI NOT_RUN.
f1ac01e6b0828266b03a433b1a8904c286accf86  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
7486226249d74934002cfdb43a33296b338b9c83  fit-control/preview/diary-preview.mjs
5b06bea7c52ee9f6104fd8982470fa08e9c1d23e  fit-control/preview/index.html
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
Next: P1-02-PREP-TRAINING if no actual acceptance receipt. Rollback scoped engineering commit. No main, backup, other project or automation changes.
