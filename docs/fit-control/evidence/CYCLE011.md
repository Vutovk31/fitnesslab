# Cycle 011 — local voice capture preview
Date 2026-11-26. Parent 05dee33aaab6d03acc0024d2534e8d2704f7eba6. Manual only. The supplied MAESTRO stabilization prompt is Atlas-specific; generic engineering discipline applied to existing FIT CONTROL, not Atlas tasks or repository. Prior standalone HTML SHA256 matched checkpoint. P0-02B remains open; no new browser receipt supplied and no repeat of blocked navigation.

## Change
Independent MediaRecorder controller and UI. Explicit user start, permission wait, cancel pending request (late stream released), stop and release tracks, preview via blob URL, manual download, discard and pagehide cleanup. Configured 120-second timer and 16 MiB chunk limit; actual scheduling may vary with browser throttling. Error/unsupported states. No speech recognition, storage, automatic upload or external calls. Starting a new recording replaces previous temporary audio. Browser support and secure-context permissions vary. BFCache restoration, real asynchronous recorder events, playback and downloads require real browser verification. No actual user audio or records used.

## Actual evidence
- Node v22.16.0.
- node --test tests/*.test.mjs: 54/54 pass, 0 fail, 0 skipped (43 previous + 11 mocked voice controller tests).
- python preview/build.py: 108102 bytes, SHA256 b30bf3fa8f94fbe6b2813855a3a15a4e780a85551a07e13cf357fc519d50d52c.
- Extracted first module script from HTML; node tests/dom-smoke.mjs: exit 0, PARTIAL_DOM_ONLY for existing diary, goals and report. New voice UI mount not exercised by this smoke test.
- Four changed blob IDs locally computed with git hash-object and matched GitHub candidate tree 57517d43a6f83051099edbaedd8bd20a24325a27.
- Full repository compilation, microphone/browser acceptance, IndexedDB, native devices and CI NOT_RUN.
352353e3f2dd691bfd2b34150c4afd3b30bb39b6  fit-control/preview/build.py
ba816538be242ad46a5bb7732a81e6c9bc63d56f  fit-control/preview/daily-report.mjs
9bde62ee9b8674f68c5f8a8515ac4f6b22e99a77  fit-control/preview/diary-preview.mjs
0bac52aa9ac7735ac22ac1f7ac79cc56b3114aa9  fit-control/preview/index.html
66b5e5f0c6dc994f12b3971133a33422e0dba855  fit-control/tests/daily-report.test.mjs
b765e619f6c782784bcc2a0a024eacf55b9beb0c  fit-control/tests/diary-preview.test.mjs
5f6713667f62c1a6a1f771093ccd24fcb5773a2c  fit-control/tests/dom-smoke.mjs
e17fa3b67a0e4344abd161b4a638b8994a7511a1  fit-control/tests/preview-goals.test.mjs
d4cb6a0b9bef0dad373804bcc831599c2ff9fd80  fit-control/preview/voice.mjs
0042dfeab4f105ed2f7adb058fb4bd82a308e777  fit-control/tests/voice.test.mjs

## Next
Manual transcript draft and explicit confirmation workflow if acceptance evidence remains unavailable. Real browser/microphone acceptance pending. Rollback scoped commit only; no production, main, backup, other project or schedule changes.
