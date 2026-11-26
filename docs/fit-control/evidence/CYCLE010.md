# Cycle 010 — configurable preview goals
Date 2026-11-26. Parent f02f0b701a85b7de11f0a7ee3407855acdef8acd. Manual only. Recovered interrupted Cycle008/009 commit first; verified 37/37 targeted tests, DOM smoke and byte-identical rebuilt HTML. No receipt supplied; no repeat blocked browser test.

## Product change
Configurable session-wide demonstration targets for kcal/protein/fat/carbs. Positive finite decimals or blank/null, no automatic personal recommendations. Atomic validation, existing domain calculation, data and statuses unchanged. Existing example defaults remain visibly illustrative. Targets are not persisted and apply to all dates during current session. Successful update invalidates report; invalid input preserves prior targets and report. No new dependencies, APIs or store.

## Evidence
- Node v22.16.0, TypeScript 5.8.3 available. Existing restored compiled domain code used; no full source compilation in this cycle.
- python preview/build.py: generated 99986-byte standalone HTML, SHA256 768e4cc5291c021eaf08267e7f779bc37d49e0d849addb6596d42e2055a1a245.
- node --test tests/*.test.mjs: 43/43 pass, 0 failures, 0 skipped; 37 prior + 6 new.
- node tests/dom-smoke.mjs: exit 0; PARTIAL_DOM_ONLY startup, modes, add/edit/delete, date, target changes and report invalidation.
- All four changed Git blobs matched local git hash-object in candidate tree b972ddfba68b03a91d324ec902344bdb4a95ec90. Full browser, physical device, IndexedDB, clipboard and CI NOT_RUN.
eaeb465f9cb7c2eedb67e3b22cf9d0ca80831f49  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
9bde62ee9b8674f68c5f8a8515ac4f6b22e99a77  fit-control/preview/diary-preview.mjs
18bf234508625512cace526f867dd89bdd90756f  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
5f6713667f62c1a6a1f771093ccd24fcb5773a2c  fit-control/tests/dom-smoke.mjs
e17fa3b67a0e4344abd161b4a638b8994a7511a1  fit-control/tests/preview-goals.test.mjs

## Next
P0-02B remains ENV_BLOCKED. Prioritize returned actual receipt; independent voice capture preview if absent. No actual health records or secrets; no main/backup/other project/schedule changes. Rollback: revert scoped engineering commit.
