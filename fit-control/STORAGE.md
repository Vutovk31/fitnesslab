# IndexedDB diary storage (P0-02B)
Status: implementation compiled; Node tests pass; browser acceptance blocked in current environment. Do not treat as release.

Use DiaryStore.open(), create(entry), list(localDate), update(entry, expectedRevision), remove(id, expectedRevision, updatedAt), balance(localDate, targetKcal), close(). Use lowercase UUIDs, UTC ISO timestamps with milliseconds, explicit local date and IANA timezone. Update accepts full entry with its current revision and original created_at; increments revision atomically. Explicit user corrections may change food snapshot or local date. Tombstone remains in list; nutrition engine excludes it. No revision history beyond latest version and tombstone. Source validation checks metadata structure only. Caller handles license/consent. Browser storage may be evicted; backup and full privacy purge remain future tasks. No application or native UI here.

From fit-control/:
- npm ci --offline --ignore-scripts --no-audit --no-fund
- npm run typecheck
- npm test
- python tests/browser/run.py (requires Python Playwright 1.57.0 and authorized local Chromium; CHROMIUM_PATH may specify installed binary). Runner uses an ephemeral loopback HTTP server, fresh browser context and synthetic test records. Do not alter security policy to run it. Browser test coverage: 14 cases, including offline after page load, not offline app reload. If browser blocked, report NOT_RUN; do not close acceptance.
