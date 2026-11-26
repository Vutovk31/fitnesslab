import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DiaryStore } from '../dist/storage.js';
// Invalid input must reject before touching the browser database; no IDB emulator.
for (const [name, invoke, kind] of [
  ['invalid date', () => DiaryStore.prototype.list.call({}, '2026-02-30'), 'RangeError'],
  ['uncloneable create', () => DiaryStore.prototype.create.call({}, { x: () => {} }), 'DataCloneError'],
  ['uncloneable update', () => DiaryStore.prototype.update.call({}, { x: () => {} }, 1), 'DataCloneError'],
  ['malformed create', () => DiaryStore.prototype.create.call({}, {}), 'RangeError'],
  ['malformed update', () => DiaryStore.prototype.update.call({}, {}, 1), 'RangeError'],
]) test('promise contract: ' + name, async () => {
  let result;
  assert.doesNotThrow(() => { result = invoke(); });
  assert.ok(result instanceof Promise);
  await assert.rejects(result, { name: kind });
});
