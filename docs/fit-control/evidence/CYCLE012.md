# Cycle 012 — manual transcript draft
Date 2026-11-26. Parent 11db23b87bbdb4606e060e3295eb932e202f468d. Manual only. Prior standalone HTML SHA256 matched checkpoint. Existing local preview source restored and changed in isolated workspace. No browser receipt supplied; no repeat of blocked navigation.

## Change
Manual Russian text area, line selector, explicit transfer into existing diary editor. Format product; positive decimal quantity + g/ml/piece (Russian symbols); plain lines remain literal names without inferred quantity. Unknown nutrients left blank. No speech recognition, automatic association of audio/text, network call or implicit diary write. User must review and explicitly submit. Replacement of unsaved editor fields requires confirmation; clearing text does not remove diary or audio. Text limit 8000 characters, name 300. Source kind remains estimate pending user correction. Existing demo-only memory semantics unchanged. HTML size grows because data URL bundler nests repeated dependency references; optimization deferred.

## Actual evidence
- Node v22.16.0.
- node --test tests/*.test.mjs: 61/61 pass, 0 fail, 0 skipped (54 prior + 7 new).
- python preview/build.py: 219385 bytes, SHA256 d4f032dfb81f2b1e63686ca79f3a3e4b87f0cb713ce3cecc4aae476f0daa6872.
- Extract first module script; node tests/dom-smoke.mjs: exit 0, PARTIAL_DOM_ONLY; existing startup/modes/add/edit/delete/date/goals/report plus transcript transfer, explicit confirmation and text clear assertions. Voice mount not exercised.
- Five changed blob IDs locally computed with git hash-object matched candidate tree c32f0483542635a0bb0b5f8cbb8dbbfe1795520a.
- Full repository compilation, real browser, microphone, IndexedDB, native devices and CI NOT_RUN.
f1ac01e6b0828266b03a433b1a8904c286accf86  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
9bde62ee9b8674f68c5f8a8515ac4f6b22e99a77  fit-control/preview/diary-preview.mjs
95a7f450da99ca4f9f0de34a24e1c3b8526ceb32  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
edc17c88ef628edd88bcd080739c29892faf68ec  fit-control/tests/dom-smoke.mjs
e17fa3b67a0e4344abd161b4a638b8994a7511a1  fit-control/tests/preview-goals.test.mjs
d4cb6a0b9bef0dad373804bcc831599c2ff9fd80  fit-control/preview/voice.mjs
0042dfeab4f105ed2f7adb058fb4bd82a308e777  fit-control/tests/voice.test.mjs
86e9205db6c73bd3cf9d56bcc3d286c5855c9cf3  fit-control/preview/transcript.mjs
88d2247e5d26f1a53c4425aa51e8166b37133490  fit-control/tests/transcript.test.mjs

## Next
Versioned local backup export and validated explicit restore for temporary preview if acceptance evidence absent. Browser gate remains open. No changes to main, backup branch, other projects or automations. Rollback scoped engineering commit only.
