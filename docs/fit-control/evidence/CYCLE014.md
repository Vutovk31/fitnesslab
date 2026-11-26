# Cycle 014 — derived food catalog
Parent 6653b98da712c580943d70445503789b55e8686c. NextCycle manual continuation. Recovered interrupted Cycle013 and repeated 74/74 tests before committing. No new browser evidence supplied; no repeat of blocked browser.

## Change
Catalog derives templates from confirmed and planned records across all session dates. No extra store, external API or guesses. Exact matching of food fields including basis, preparation and source metadata; distinct variants remain separate. Draft/deleted excluded. Case-insensitive search; UI shows first 30 matches, count and refinement message. Template selection resets quantity and meal/date context; no diary write until explicit action. Unsaved editor replacement confirmation. Catalog regenerates from restored backup. Only synthetic data. Not a comprehensive food database, no barcode provider. Existing decimal editor limitations on extreme exponent values remain.

## Actual verification
Node v22.16.0. node --test tests/*.test.mjs 80/80 pass, 0 fail, 0 skipped. First DOM smoke failed because expected 290 instead of correct 300 (180+120); corrected assertion only, reran node tests/dom-smoke.mjs exit 0, PARTIAL_DOM_ONLY. Catalog search, transfer without change, explicit confirmation and previous journeys exercised. Built standalone HTML with python preview/build.py, 236655 bytes SHA256 021cee9dc2306afa80e6023d61603fddbe77789bc1aa3cc56fb5104574aa722a. Four changed blobs matched local git hash-object. Full repository compile, actual browser, microphone, IndexedDB, native devices and CI NOT_RUN. Browser acceptance remains open.
f1ac01e6b0828266b03a433b1a8904c286accf86  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
a3a2054bf96d94da653f0b148d669275edb196fc  fit-control/preview/diary-preview.mjs
b385d894150e418d647b091012c50b3521f848ec  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
73df70be09d49dcbfd2d150832b16192521cbab3  fit-control/tests/dom-smoke.mjs
e17fa3b67a0e4344abd161b4a638b8994a7511a1  fit-control/tests/preview-goals.test.mjs
d4cb6a0b9bef0dad373804bcc831599c2ff9fd80  fit-control/preview/voice.mjs
0042dfeab4f105ed2f7adb058fb4bd82a308e777  fit-control/tests/voice.test.mjs
86e9205db6c73bd3cf9d56bcc3d286c5855c9cf3  fit-control/preview/transcript.mjs
88d2247e5d26f1a53c4425aa51e8166b37133490  fit-control/tests/transcript.test.mjs
de22b5a09ff9a56aa128c7a5f4597fa71675707a  fit-control/tests/backup.test.mjs
fc6ffc6cd0318252cf99ba31e107f573b9c66517  fit-control/tests/catalog.test.mjs
Next: P1-03-PREP-MEAL if no actual browser receipt. Rollback scoped commit. No main, backup, other projects, automations or real data changes.
